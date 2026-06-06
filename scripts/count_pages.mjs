import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = JSON.parse(readFileSync(path.resolve(__dirname, '../src/content/videos/database.json'), 'utf-8'));

const cats = [...new Set(db.map(v => v.category))];
const tags = [...new Set(db.flatMap(v => v.tags || []))];
const perPage = 24;
const homePagination = Math.ceil(db.length / perPage);
const catPagination = cats.length * Math.ceil((db.length / cats.length) / perPage); // rough estimate

console.log('\n📊 vixtube.net - Page Count Analysis');
console.log('═'.repeat(50));
console.log(`📹 Total videos in DB:       ${db.length.toLocaleString()}`);
console.log('─'.repeat(50));
console.log(`📄 Individual video pages:   ${db.length.toLocaleString()}`);
console.log(`📑 Home pagination pages:    ${homePagination}`);
console.log(`🏷️  Category pages:           ${cats.length}`);
console.log(`🏷️  Tag pages:                ${tags.length}`);
console.log(`📋 Static pages:             5 (home, featured, popular, privacy, dmca, contact, terms)`);
console.log('─'.repeat(50));
const total = db.length + homePagination + cats.length + tags.length + 7;
console.log(`🌐 TOTAL PAGES (estimate):   ${total.toLocaleString()}`);
console.log('═'.repeat(50));
console.log('\n📂 Categories:');
cats.forEach(c => {
  const count = db.filter(v => v.category === c).length;
  console.log(`   ${c.padEnd(20)} → ${count} videos`);
});
console.log('\n🏷️  Sample Tags (first 20):');
tags.slice(0,20).forEach(t => console.log(`   ${t}`));
console.log(`   ... and ${tags.length - 20} more`);
