import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceImage = 'C:/Users/Pubudu Nuwan/.gemini/antigravity/brain/42e93aff-8d6b-468d-ab02-4762e3216635/vixtube_favicon_raw_1780139004460.png';
const publicDir = './public';

// Helper to create ICO file from multiple PNG buffers
function createIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type (1 for ICO)
  header.writeUInt16LE(count, 4); // Number of images

  const directories = [];
  let currentOffset = 6 + 16 * count;

  for (let i = 0; i < count; i++) {
    const size = sizes[i];
    const data = pngBuffers[i];
    const dataSize = data.length;

    const dir = Buffer.alloc(16);
    dir.writeUInt8(size >= 256 ? 0 : size, 0); // Width (0 means 256)
    dir.writeUInt8(size >= 256 ? 0 : size, 1); // Height (0 means 256)
    dir.writeUInt8(0, 2); // Colors (0 = no palette)
    dir.writeUInt8(0, 3); // Reserved
    dir.writeUInt16LE(1, 4); // Color planes
    dir.writeUInt16LE(32, 6); // Bits per pixel
    dir.writeUInt32LE(dataSize, 8); // Data size
    dir.writeUInt32LE(currentOffset, 12); // Offset

    directories.push(dir);
    currentOffset += dataSize;
  }

  return Buffer.concat([header, ...directories, ...pngBuffers]);
}

async function run() {
  try {
    console.log(`Starting favicon and icon generation using source: ${sourceImage}`);
    
    // Check if source exists
    if (!fs.existsSync(sourceImage)) {
      throw new Error(`Source image not found at ${sourceImage}`);
    }

    // 1. Generate PWA Icons (PNG)
    console.log('Generating PWA icons...');
    await sharp(sourceImage)
      .resize(192, 192)
      .toFile(path.join(publicDir, 'pwa_icon_192.png'));
    console.log('Created pwa_icon_192.png');

    await sharp(sourceImage)
      .resize(512, 512)
      .toFile(path.join(publicDir, 'pwa_icon_512.png'));
    console.log('Created pwa_icon_512.png');

    // 2. Generate browser-specific PNG favicons
    console.log('Generating individual PNG favicons...');
    const sizes = [16, 32, 48];
    const pngBuffers = [];

    for (const size of sizes) {
      const buffer = await sharp(sourceImage)
        .resize(size, size)
        .png()
        .toBuffer();
      
      const fileName = `favicon-${size}x32.png`.replace('32.png', `${size}.png`); // e.g. favicon-16x16.png
      const outputPath = path.join(publicDir, `favicon-${size}x${size}.png`);
      await fs.promises.writeFile(outputPath, buffer);
      console.log(`Created favicon-${size}x${size}.png`);
      
      pngBuffers.push(buffer);
    }

    // 3. Assemble PNGs into ICO
    console.log('Creating multi-resolution favicon.ico...');
    const icoBuffer = createIco(pngBuffers, sizes);
    await fs.promises.writeFile(path.join(publicDir, 'favicon.ico'), icoBuffer);
    console.log('Created favicon.ico containing 16x16, 32x32, 48x48 sizes!');

    console.log('Icon generation successfully completed.');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

run();
