const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function generateSocialThumbnails() {
  // Read the logo SVG content
  const svgContent = fs.readFileSync(path.join(__dirname, '../public/logo-v2.svg'), 'utf8')
  
  // Extract just the content (remove outer SVG wrapper and defs)
  const logoBody = svgContent
    .replace(/<\?xml[^?]*\?>/i, '')
    .replace(/<defs>[\s\S]*?<\/defs>/, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim()
  
  const outDir = path.join(__dirname, '../public/thumbnails')
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }
  
  // Helper to create thumbnail with embedded logo
  const createThumbnail = async (width, height, outputFile, scale = 1) => {
    const scaledLogo = `
      <g transform="translate(${width/2}, ${height * 0.38}) scale(${Math.min(width, height) / 512 * scale})">
        ${logoBody}
      </g>
    `
    
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  ${scaledLogo}
  <text x="${width/2}" y="${height * 0.85}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="${Math.floor(width * 0.045)}" font-weight="bold" fill="#ffffff">BADIK</text>
  <text x="${width/2}" y="${height * 0.92}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.floor(width * 0.022)}" fill="#bae6fd">Bantuan Akses Digital untuk Informasi Keadilan</text>
</svg>`.trim()
    
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputFile)
  }
  
  // Generate thumbnails
  await createThumbnail(1200, 630, path.join(outDir, 'og-facebook.png'), 0.9)
  console.log('✓ Generated og-facebook.png (1200x630)')
  
  await createThumbnail(1080, 1080, path.join(outDir, 'og-instagram.png'), 0.85)
  console.log('✓ Generated og-instagram.png (1080x1080)')
  
  await createThumbnail(1280, 720, path.join(outDir, 'og-youtube.png'), 0.9)
  console.log('✓ Generated og-youtube.png (1280x720)')
  
  await createThumbnail(1200, 627, path.join(outDir, 'og-linkedin.png'), 0.9)
  console.log('✓ Generated og-linkedin.png (1200x627)')
  
  await createThumbnail(1080, 1920, path.join(outDir, 'og-whatsapp.png'), 0.8)
  console.log('✓ Generated og-whatsapp.png (1080x1920)')
  
  console.log('\n🎉 All social media thumbnails generated!')
}

generateSocialThumbnails().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
