import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cropsDir = path.resolve(__dirname, '../public/crops');

async function convertImages() {
  const files = fs.readdirSync(cropsDir);
  const pngFiles = files.filter(f => f.toLowerCase().endsWith('.png'));
  
  if (pngFiles.length === 0) {
    console.log('No PNG files found.');
    return;
  }

  let convertedCount = 0;
  let totalSavedBytes = 0;

  for (const file of pngFiles) {
    const inputPath = path.join(cropsDir, file);
    const outputPath = path.join(cropsDir, file.replace(/\.png$/i, '.webp'));
    
    try {
      const stats = fs.statSync(inputPath);
      const originalSize = stats.size;

      // Convert to WebP
      await sharp(inputPath)
        .webp({ quality: 80, effort: 4 })
        .toFile(outputPath);

      const newStats = fs.statSync(outputPath);
      const newSize = newStats.size;

      const saved = originalSize - newSize;
      totalSavedBytes += saved;
      convertedCount++;

      console.log(`Converted ${file} to WebP. Saved ${(saved / 1024).toFixed(2)} KB`);

      // Optionally delete original PNG to save space
      fs.unlinkSync(inputPath);
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
    }
  }

  console.log(`\nSuccessfully converted ${convertedCount} images.`);
  console.log(`Total space saved: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB`);
}

convertImages();
