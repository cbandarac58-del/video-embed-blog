import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');

function main() {
  console.log('📖 Reading database.json...');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  const titles = {};
  const descriptions = {};

  db.forEach((video, index) => {
    const title = video.title || '';
    const desc = video.description || '';

    if (title) {
      if (!titles[title]) titles[title] = [];
      titles[title].push({ index, slug: video.slug });
    }

    if (desc) {
      if (!descriptions[desc]) descriptions[desc] = [];
      descriptions[desc].push({ index, slug: video.slug });
    }
  });

  const duplicateTitles = Object.entries(titles).filter(([_, val]) => val.length > 1);
  const duplicateDescriptions = Object.entries(descriptions).filter(([_, val]) => val.length > 1);

  console.log(`\n=== DUPLICATE TITLES FOUND: ${duplicateTitles.length} ===`);
  duplicateTitles.slice(0, 10).forEach(([title, occurrences]) => {
    console.log(`Title: "${title}"`);
    console.log(`Occurrences (${occurrences.length}):`, occurrences.map(o => `[${o.index}] ${o.slug}`));
    console.log('-');
  });

  console.log(`\n=== DUPLICATE DESCRIPTIONS FOUND: ${duplicateDescriptions.length} ===`);
  duplicateDescriptions.slice(0, 10).forEach(([desc, occurrences]) => {
    console.log(`Description: "${desc.substring(0, 80)}..."`);
    console.log(`Occurrences (${occurrences.length}):`, occurrences.map(o => `[${o.index}] ${o.slug}`));
    console.log('-');
  });
}

main();
