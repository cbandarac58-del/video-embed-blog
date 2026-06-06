import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');

try {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const initialCount = data.length;

  const isSriLankan = (video) => {
    const searchString = `
      ${video.title || ''} 
      ${video.category || ''} 
      ${(video.tags || []).join(' ')} 
      ${video.description || ''}
    `.toLowerCase();

    return searchString.includes('sri lanka') || 
           searchString.includes('srilanka') || 
           searchString.includes('sinhala') ||
           searchString.includes('srilankan');
  };

  const filtered = data.filter(video => !isSriLankan(video));
  
  const deletedCount = initialCount - filtered.length;

  fs.writeFileSync(dbPath, JSON.stringify(filtered, null, 2), 'utf-8');

  console.log(`✅ Successfully deleted ${deletedCount} Sri Lankan/Sinhala videos.`);
  console.log(`📦 Database now has ${filtered.length} videos.`);
} catch (error) {
  console.error("Error modifying database:", error.message);
}
