/**
 * Scraper for putusan3.mahkamahagung.go.id
 * Uses Playwright to bypass Cloudflare protection
 *
 * Note: This scraper is for non-commercial, educational/research purposes only.
 * The website's robots.txt allows 'search' and 'use=reference' but prohibits 'ai-train'.
 * Data collected should NOT be used to train AI models.
 */

import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

interface Putusan {
  id: number
  case_number: string
  court: string
  date: string
  summary: string
  keywords: string[]
  source_url: string
  category: string
  scraped_at: string
}

const OUTPUT_FILE = path.join(__dirname, '../data/putusan_scraper.json')
const MAX_PAGES = 10 // Maximum pages to scrape per category
const DELAY_MS = 2000 // Delay between requests (respectful scraping)

// Category configurations
const CATEGORIES = {
  pidana: {
    keywords: ['pencurian', 'penganiayaan', 'penipuan', 'narkotika', 'pembunuhan', 'korupsi'],
    searchQuery: 'pidana',
  },
  perdata: {
    keywords: ['wanprestasi', 'gugatan', 'harta bersama', 'waris', 'tanah'],
    searchQuery: 'perdata',
  },
  keluarga: {
    keywords: ['perceraian', 'hak asuh', 'nafkah', 'talak'],
    searchQuery: 'keluarga',
  },
  ketenagakerjaan: {
    keywords: ['PHK', 'pesangon', 'pekerja', 'upah'],
    searchQuery: 'ketenagakerjaan',
  },
}

async function scrapePage(page: any, searchQuery: string, pageNum: number): Promise<Putusan[]> {
  const results: Putusan[] = []

  try {
    // Navigate to search page
    const searchUrl = `https://putusan3.mahkamahagung.go.id/index.php/search-result/search/${encodeURIComponent(searchQuery)}/page/${pageNum}`
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 })

    // Wait for Cloudflare challenge to pass
    await page.waitForTimeout(3000)

    // Extract results from the page
    const items = await page.$$eval('.search-result-item, .result-item, .putusan-item, article, .card', (elements) => {
      return elements.map(el => {
        const text = el.textContent || ''
        const links = el.querySelectorAll('a')
        const link = links.length > 0 ? links[0].getAttribute('href') || '' : ''
        return { text, link }
      })
    })

    for (const item of items) {
      const putusan: Putusan = parsePutusan(item, searchQuery)
      if (putusan && putusan.case_number) {
        results.push(putusan)
      }
    }
  } catch (error) {
    console.error(`Error scraping page ${pageNum}:`, error)
  }

  return results
}

function parsePutusan(item: any, category: string): Putusan | null {
  try {
    const text = item.text || ''
    const link = item.link || ''

    // Extract case number (format: NO. PENDAFTARAN / PIDANA / 2024 / PN XXX)
    const caseNumberMatch = text.match(/(\d+ \/ \w+ \/ \d+ \/ \w+)/)
    const caseNumber = caseNumberMatch ? caseNumberMatch[1] : ''

    // Extract court
    const courtMatch = text.match(/Pengadilan (Negeri|Agama|Tipikor|Tata Usaha Negara)\s*([\w\s]+)/)
    const court = courtMatch ? `Pengadilan ${courtMatch[2].trim()}` : 'Pengadilan Umum'

    // Extract date
    const dateMatch = text.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/)
    const date = dateMatch ? `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1].padStart(2, '0')}` : ''

    // Extract summary (first 2-3 sentences)
    const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 20)
    const summary = sentences.slice(0, 3).join('. ').substring(0, 500)

    // Extract keywords from text
    const allKeywords = Object.values(CATEGORIES).flatMap(c => c.keywords)
    const matchedKeywords = allKeywords.filter(kw => text.toLowerCase().includes(kw.toLowerCase()))

    // Build full URL
    const sourceUrl = link.startsWith('http')
      ? link
      : `https://putusan3.mahkamahagung.go.id${link}`

    if (!caseNumber && !summary) return null

    return {
      id: Date.now() + Math.random(),
      case_number: caseNumber || `Putusan-${category}-${Date.now()}`,
      court: court || 'Pengadilan Negeri',
      date: date || new Date().toISOString().split('T')[0],
      summary: summary || text.substring(0, 500),
      keywords: matchedKeywords.slice(0, 5),
      source_url: sourceUrl,
      category: category,
      scraped_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error parsing putusan:', error)
    return null
  }
}

async function scrapeCategory(page: any, categoryName: string, config: any): Promise<Putusan[]> {
  console.log(`\n📂 Scraping category: ${categoryName}`)
  const allResults: Putusan[] = []

  for (let pageNum = 1; pageNum <= MAX_PAGES; pageNum++) {
    console.log(`  Page ${pageNum}/${MAX_PAGES}...`)

    const pageResults = await scrapePage(page, config.searchQuery, pageNum)
    console.log(`    Found ${pageResults.length} results`)

    if (pageResults.length === 0) {
      console.log(`    No more results, stopping.`)
      break
    }

    allResults.push(...pageResults)

    // Respectful delay
    await new Promise(resolve => setTimeout(resolve, DELAY_MS))
  }

  console.log(`  ✅ Category ${categoryName}: ${allResults.length} total`)
  return allResults
}

async function main() {
  console.log('🚀 Starting Putusan 3 Scraper')
  console.log('=' .repeat(50))

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    // Create data directory
    const dataDir = path.dirname(OUTPUT_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Load existing data
    let existingData: Putusan[] = []
    if (fs.existsSync(OUTPUT_FILE)) {
      existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'))
      console.log(`📊 Loaded ${existingData.length} existing records`)
    }

    // Scrape all categories
    const allResults: Putusan[] = []
    for (const [category, config] of Object.entries(CATEGORIES)) {
      const results = await scrapeCategory(page, category, config)
      allResults.push(...results)
    }

    // Combine and deduplicate
    const existingCaseNumbers = new Set(existingData.map(d => d.case_number))
    const newResults = allResults.filter(r => !existingCaseNumbers.has(r.case_number))

    const finalData = [...existingData, ...newResults]

    // Save results
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2))
    console.log(`\n✅ Done! Total: ${finalData.length} records (New: ${newResults.length})`)
    console.log(`📁 Saved to: ${OUTPUT_FILE}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await browser.close()
  }
}

main().catch(console.error)
