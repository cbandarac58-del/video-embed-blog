import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');

function main() {
  console.log('📖 Reading database.json...');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  const seenTitles = {};
  const seenDescriptions = {};
  let titleUpdates = 0;
  let descUpdates = 0;

  // We loop from end to beginning so we don't accidentally match renamed titles
  db.forEach((video) => {
    const title = video.title || '';
    const desc = video.description || '';

    // Handle Title Duplicates
    if (title) {
      if (seenTitles[title] !== undefined) {
        seenTitles[title]++;
        const newTitle = `${title} - Clip ${seenTitles[title]}`;
        video.title = newTitle;
        titleUpdates++;
      } else {
        seenTitles[title] = 1;
      }
    }

    // Handle Description Duplicates
    if (desc) {
      if (seenDescriptions[desc] !== undefined) {
        seenDescriptions[desc]++;
        // Append a unique modifier to make it different
        const newDesc = `${desc} Watch ${video.title} free streaming online.`;
        video.description = newDesc;
        descUpdates++;
      } else {
        seenDescriptions[desc] = 1;
      }
    }
  });

  console.log(`\n✅ Duplicate Titles Fixed in DB: ${titleUpdates}`);
  console.log(`\n✅ Duplicate Descriptions Fixed in DB: ${descUpdates}`);

  if (titleUpdates > 0 || descUpdates > 0) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
    console.log('\n💾 Database updated successfully!');
  } else {
    console.log('\n✅ No duplicates found.');
  }
}

main();
