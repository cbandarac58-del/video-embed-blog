import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
const db = JSON.parse(readFileSync(dbPath, 'utf-8'));

// Find all videos with .mp4 thumbnailUrls
const mp4Thumbs = db.filter(v => v.thumbnailUrl && v.thumbnailUrl.match(/\.(mp4|webm|mov|avi)(\?.*)?$/i));

console.log(`\n🔍 Videos with .mp4 thumbnailUrl: ${mp4Thumbs.length}`);
mp4Thumbs.forEach(v => {
  console.log(`  slug: ${v.slug}`);
  console.log(`  thumb: ${v.thumbnailUrl}`);
  console.log(`  cat: ${v.category}`);
  console.log(`  tags: ${(v.tags||[]).join(', ')}`);
  console.log('');
});

// Also check the specific problematic URL
const specific = db.filter(v => v.thumbnailUrl && v.thumbnailUrl.includes('c3af78d93cd4d36ccdb1120c9365b6b1baccfc5b'));
console.log(`\n🎯 Videos with the specific problematic URL: ${specific.length}`);
specific.forEach(v => {
  console.log(`  slug: ${v.slug}`);
  console.log(`  embedUrl: ${v.embedUrl}`);
  console.log(`  category: ${v.category}`);
  console.log(`  tags: ${(v.tags||[]).join(', ')}`);
});

// Fix: remove .mp4 thumbnailUrls (set to empty string)
let fixed = 0;
db.forEach(v => {
  if (v.thumbnailUrl && v.thumbnailUrl.match(/\.(mp4|webm|mov|avi)(\?.*)?$/i)) {
    v.thumbnailUrl = '';
    fixed++;
  }
});

if (fixed > 0) {
  writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  console.log(`\n✅ Fixed ${fixed} videos - removed .mp4 thumbnailUrls`);
} else {
  console.log('\n✅ No .mp4 thumbnailUrls found to fix');
}
