import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const CROPS_DIR = path.resolve('public/crops');
const LOGO_PATH = path.resolve('public/AgriPresyo_logoFinal.png');
const LOGO_OUT = path.resolve('public/AgriPresyo_logoFinal.webp');

// Max dimension for crop icons (2x of largest display size 80px = 160px for retina)
const MAX_CROP_SIZE = 160;
// Logo max dimension
const MAX_LOGO_SIZE = 200;

async function optimizeCrops() {
  const files = fs.readdirSync(CROPS_DIR).filter(f => f.endsWith('.png'));
  console.log(`Found ${files.length} PNG files to convert to WebP...\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const inputPath = path.join(CROPS_DIR, file);
    const outputPath = path.join(CROPS_DIR, file.replace('.png', '.webp'));
    
    const beforeSize = fs.statSync(inputPath).size;
    totalBefore += beforeSize;

    await sharp(inputPath)
      .resize(MAX_CROP_SIZE, MAX_CROP_SIZE, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    const afterSize = fs.statSync(outputPath).size;
    totalAfter += afterSize;

    const reduction = ((1 - afterSize / beforeSize) * 100).toFixed(1);
    console.log(`  ${file} → ${file.replace('.png', '.webp')} : ${(beforeSize/1024).toFixed(0)}KB → ${(afterSize/1024).toFixed(1)}KB (${reduction}% smaller)`);
  }

  console.log(`\nCrop images: ${(totalBefore/1024/1024).toFixed(2)}MB → ${(totalAfter/1024).toFixed(0)}KB (${((1 - totalAfter/totalBefore)*100).toFixed(1)}% reduction)`);
}

async function optimizeLogo() {
  const beforeSize = fs.statSync(LOGO_PATH).size;

  await sharp(LOGO_PATH)
    .resize(MAX_LOGO_SIZE, MAX_LOGO_SIZE, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(LOGO_OUT);

  const afterSize = fs.statSync(LOGO_OUT).size;
  const reduction = ((1 - afterSize / beforeSize) * 100).toFixed(1);
  console.log(`\nLogo: ${(beforeSize/1024).toFixed(0)}KB → ${(afterSize/1024).toFixed(1)}KB (${reduction}% smaller)`);
}

async function main() {
  console.log('=== AgriPresyo Image Optimization ===\n');
  await optimizeCrops();
  await optimizeLogo();
  console.log('\n✅ Done! All images optimized.');
}

main().catch(console.error);
