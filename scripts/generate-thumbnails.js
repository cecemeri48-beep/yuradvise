const { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } = require('@napi-rs/canvas')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// Register high-quality fonts
const fontsDir = path.join(__dirname, '../fonts')
const logoSvg = fs.readFileSync(path.join(__dirname, '../public/logo-v2.svg'), 'utf8')

async function drawLogo(ctx, x, y, size) {
  // Create a temporary canvas with the logo SVG
  const logoCanvas = createCanvas(size, size)
  const logoCtx = logoCanvas.getContext('2d')

  // Draw logo from SVG data URL
  const logoDataUri = 'data:image/svg+xml;base64,' + Buffer.from(logoSvg).toString('base64')
  const img = await loadImage(logoDataUri)
  logoCtx.drawImage(img, 0, 0, size, size)

  ctx.drawImage(logoCanvas, x, y, size, size)
}

async function generateSocialThumbnails() {
  const outDir = path.join(__dirname, '../public/thumbnails')
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  // Register fonts if available
  try {
    const files = fs.readdirSync(fontsDir)
    const interFile = files.find(f => f.toLowerCase().includes('inter') && f.endsWith('.ttf'))
    const montserratFile = files.find(f => f.toLowerCase().includes('montserrat') && f.endsWith('.ttf'))
    if (interFile) registerFont(path.join(fontsDir, interFile), { family: 'Inter' })
    if (montserratFile) registerFont(path.join(fontsDir, montserratFile), { family: 'Montserrat' })
  } catch (e) { /* use system fonts */ }

  const createThumbnail = async (width, height, outputFile) => {
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // === BACKGROUND GRADIENT ===
    const bgGrad = ctx.createLinearGradient(0, 0, width, height)
    bgGrad.addColorStop(0, '#0ea5e9')
    bgGrad.addColorStop(1, '#0284c7')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // === SUBTLE PATTERN OVERLAY ===
    ctx.fillStyle = 'rgba(255,255,255,0.02)'
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i + 20, height)
      ctx.lineTo(i - 20, height)
      ctx.closePath()
      ctx.fill()
    }

    // === GLOW EFFECT BEHIND LOGO ===
    const logoSize = Math.floor(Math.min(width * 0.32, height * 0.38))
    const logoX = Math.floor((width - logoSize) / 2)
    const logoY = Math.floor(height * 0.12)

    const glowGrad = ctx.createRadialGradient(
      width / 2, logoY + logoSize / 2, 0,
      width / 2, logoY + logoSize / 2, logoSize * 0.8
    )
    glowGrad.addColorStop(0, 'rgba(245,158,11,0.25)')
    glowGrad.addColorStop(0.5, 'rgba(245,158,11,0.08)')
    glowGrad.addColorStop(1, 'rgba(245,158,11,0)')
    ctx.fillStyle = glowGrad
    ctx.fillRect(0, logoY - logoSize * 0.3, width, logoSize * 1.6)

    // === LOGO IMAGE ===
    await drawLogo(ctx, logoX, logoY, logoSize)

    // === SHADOW UNDER LOGO ===
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.ellipse(width / 2, logoY + logoSize + 12, logoSize * 0.45, 8, 0, 0, Math.PI * 2)
    ctx.fill()

    // === TITLE: BADIK ===
    const titleFontSize = Math.floor(width * 0.09)
    ctx.font = `900 ${titleFontSize}px "Montserrat", "Inter", "Arial Black", sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Title shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillText('BADIK', width / 2 + 3, height * 0.58 + 3)

    // Title gradient
    const titleGrad = ctx.createLinearGradient(0, height * 0.52, 0, height * 0.64)
    titleGrad.addColorStop(0, '#ffffff')
    titleGrad.addColorStop(1, '#f1f5f9')
    ctx.fillStyle = titleGrad
    ctx.fillText('BADIK', width / 2, height * 0.58)

    // === SUBTITLE ===
    const subFontSize = Math.floor(width * 0.038)
    ctx.font = `500 ${subFontSize}px "Inter", "Segoe UI", Arial, sans-serif`
    ctx.fillStyle = '#bae6fd'
    ctx.fillText('Bantuan Hukum AI Gratis untuk Warga Indonesia', width / 2, height * 0.68)

    // === FEATURE LINE ===
    const featFontSize = Math.floor(width * 0.024)
    ctx.font = `400 ${featFontSize}px "Inter", "Segoe UI", Arial, sans-serif`
    ctx.fillStyle = '#7dd3fc'
    ctx.fillText('Konsultasi  |  Yurisprudensi MA & MK  |  Rekomendasi Hukum', width / 2, height * 0.75)

    // === BOTTOM ACCENT LINE ===
    const lineGrad = ctx.createLinearGradient(width * 0.2, 0, width * 0.8, 0)
    lineGrad.addColorStop(0, 'rgba(245,158,11,0)')
    lineGrad.addColorStop(0.5, 'rgba(245,158,11,0.6)')
    lineGrad.addColorStop(1, 'rgba(245,158,11,0)')
    ctx.strokeStyle = lineGrad
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(width * 0.2, height * 0.83)
    ctx.lineTo(width * 0.8, height * 0.83)
    ctx.stroke()

    // === FOOTER TEXT ===
    const footerFontSize = Math.floor(width * 0.018)
    ctx.font = `400 ${footerFontSize}px "Inter", "Segoe UI", Arial, sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.fillText('yuradvise.vercel.app', width / 2, height * 0.92)

    // === EXPORT ===
    const buffer = canvas.toBuffer('image/png')
    await sharp(buffer).png().toFile(outputFile)
  }

  await createThumbnail(1200, 630, path.join(outDir, 'og-facebook.png'))
  console.log('✓ og-facebook.png (1200x630)')

  await createThumbnail(1080, 1080, path.join(outDir, 'og-instagram.png'))
  console.log('✓ og-instagram.png (1080x1080)')

  await createThumbnail(1280, 720, path.join(outDir, 'og-youtube.png'))
  console.log('✓ og-youtube.png (1280x720)')

  await createThumbnail(1200, 627, path.join(outDir, 'og-linkedin.png'))
  console.log('✓ og-linkedin.png (1200x627)')

  await createThumbnail(1080, 1920, path.join(outDir, 'og-whatsapp.png'))
  console.log('✓ og-whatsapp.png (1080x1920)')

  console.log('\nAll social media thumbnails generated!')
}

generateSocialThumbnails().catch(err => { console.error('Error:', err); process.exit(1) })
