const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function generateIcons() {
  const svgContent = fs.readFileSync(path.join(__dirname, '../public/logo.svg'), 'utf8')

  // Generate 192x192 icon
  await sharp(Buffer.from(svgContent))
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, '../public/icon-192x192.png'))
  console.log('✓ Generated icon-192x192.png')

  // Generate 512x512 icon
  await sharp(Buffer.from(svgContent))
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, '../public/icon-512x512.png'))
  console.log('✓ Generated icon-512x512.png')

  // Generate 32x32 favicon
  await sharp(Buffer.from(svgContent))
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, '../public/favicon-32x32.png'))
  console.log('✓ Generated favicon-32x32.png')

  // Generate 16x16 favicon
  await sharp(Buffer.from(svgContent))
    .resize(16, 16)
    .png()
    .toFile(path.join(__dirname, '../public/favicon-16x16.png'))
  console.log('✓ Generated favicon-16x16.png')

  console.log('\n�� All icons generated successfully!')
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err)
  process.exit(1)
})
