const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function generateSocialThumbnails() {
  // Read the logo SVG content
  const svgContent = fs.readFileSync(path.join(__dirname, '../public/logo-v2.svg'), 'utf8')
  
  // Extract just the content between <defs>...</defs> and </svg>
  const logoBody = svgContent
    .replace(/^<\?xml[^?]*\?>\s*/i, '')
    .replace(/^<svg[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '')
    .trim()
  
  const createSimpleThumbnail = async (width, height, outputFile) => {
    const content = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <g transform="translate(${width/2}, ${height * 0.42}) scale(${Math.min(width, height) / 512 * 0.85})">
    ${logoBody}
  </g>
  <text x="${width/2}" y="${height * 0.75}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="${Math.floor(width * 0.04)}" font-weight="bold" fill="#ffffff">BADIK</text>
  <text x="${width/2}" y="${height * 0.82}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.floor(width * 0.02)}" fill="#bae6fd">Bantuan Akses Digital untuk Informasi Keadilan</text>
</svg>`.trim()
    
    await sharp(Buffer.from(content))
      .png()
      .toFile(outputFile)
  }
  
  const outDir = path.join(__dirname, '../public/thumbnails')
  
  // Ensure output directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }
  
  // 1. Facebook/Twitter Card (1200x630)
  await createSimpleThumbnail(1200, 630, path.join(outDir, 'og-facebook.png'))
  console.log('✓ Generated og-facebook.png (1200x630)')
  
  // 2. Instagram Square (1080x1080)
  await createSimpleThumbnail(1080, 1080, path.join(outDir, 'og-instagram.png'))
  console.log('✓ Generated og-instagram.png (1080x1080)')
  
  // 3. YouTube Thumbnail (1280x720)
  await createSimpleThumbnail(1280, 720, path.join(outDir, 'og-youtube.png'))
  console.log('✓ Generated og-youtube.png (1280x720)')
  
  // 4. LinkedIn Post (1200x627)
  await createSimpleThumbnail(1200, 627, path.join(outDir, 'og-linkedin.png'))
  console.log('✓ Generated og-linkedin.png (1200x627)')
  
  // 5. WhatsApp Status (1080x1920)
  await createSimpleThumbnail(1080, 1920, path.join(outDir, 'og-whatsapp.png'))
  console.log('✓ Generated og-whatsapp.png (1080x1920)')
  
  console.log('\n🎉 All social media thumbnails generated successfully!')
}

generateSocialThumbnails().catch(err => {
  console.error('Error generating thumbnails:', err)
  process.exit(1)
})
