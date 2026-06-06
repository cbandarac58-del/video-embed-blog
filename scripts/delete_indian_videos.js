import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');

if (!fs.existsSync(dbPath)) {
  console.error('❌ database.json not found!');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
console.log(`\n📦 Total videos before cleanup: ${db.length}`);

const originalCount = db.length;
const filtered = db.filter(v => {
  const isIndian = v.category && v.category.toLowerCase() === 'indian';
  if (isIndian) {
    // We filter them out
    return false;
  }
  return true;
});

const deletedCount = originalCount - filtered.length;

fs.writeFileSync(dbPath, JSON.stringify(filtered, null, 2), 'utf-8');

console.log(`🗑️  Deleted ${deletedCount} Indian videos.`);
console.log(`📦 Total videos after cleanup: ${filtered.length}\n`);
