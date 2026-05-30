import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const NEW_CATEGORY = 'Sri Lankan';

// Detection function - find all Sri Lankan videos
function isSriLankan(v) {
  const title = (v.title || '').toLowerCase();
  const tags = (v.tags || []).join(' ').toLowerCase();
  const embedUrl = (v.embedUrl || '').toLowerCase();

  return (
    title.includes('sri lanka') ||
    title.includes('sinhala') ||
    title.includes('ceylon') ||
    title.includes('lanka desi') ||
    tags.includes('sri-lankan') ||
    tags.includes('sinhala') ||
    tags.includes('ceylon') ||
    tags.includes('sri-lanka') ||
    embedUrl.includes('pornhub.com') // all PH embeds in our DB are Sri Lankan
  );
}

let updated = 0;
const updatedDb = db.map(v => {
  if (isSriLankan(v)) {
    if (v.category !== NEW_CATEGORY) {
      console.log(`  ✅ [${v.category} → Sri Lankan] "${v.title.slice(0, 60)}"`);
      updated++;
      // Also ensure 'sri-lankan' tag exists
      if (!v.tags.includes('sri-lankan')) {
        v.tags = ['sri-lankan', ...v.tags];
      }
      return { ...v, category: NEW_CATEGORY };
    } else {
      console.log(`  ✔️  Already Sri Lankan: "${v.title.slice(0, 60)}"`);
      return v;
    }
  }
  return v;
});

fs.writeFileSync(dbPath, JSON.stringify(updatedDb, null, 2), 'utf-8');

const total = updatedDb.filter(v => v.category === NEW_CATEGORY).length;
console.log(`\n✅ Updated ${updated} videos to category "Sri Lankan"`);
console.log(`🇱🇰 Total Sri Lankan category videos: ${total}`);
console.log(`📦 Total videos: ${updatedDb.length}`);
