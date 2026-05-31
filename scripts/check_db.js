import { readFileSync } from 'fs';
const db = JSON.parse(readFileSync(new URL('../src/content/videos/database.json', import.meta.url), 'utf8'));

// Category distribution
const cats = {};
db.forEach(v => { cats[v.category] = (cats[v.category] || 0) + 1; });
console.log('\n=== CATEGORY COUNTS ===');
console.log(JSON.stringify(cats, null, 2));
console.log('Total videos:', db.length);

// Sample new videos (last batch added by Gemini - after index 2300)
console.log('\n=== SAMPLE NEW VIDEOS (index 2300-2315) ===');
const sample = db.slice(2300, 2315);
sample.forEach((v, i) => {
  console.log(`[${2300 + i}] CAT: ${v.category}`);
  console.log(`     TITLE: ${v.title.substring(0, 70)}`);
  console.log(`     DESC:  ${v.description ? v.description.substring(0, 60) : 'MISSING'}`);
  console.log(`     TAGS:  ${(v.tags || []).slice(0, 4).join(', ')}`);
  console.log('');
});

// Check for mismatches: Stepsister category but title has Indian/Asian etc
console.log('\n=== CHECKING FOR CATEGORY-TITLE MISMATCHES ===');
let mismatches = 0;
db.forEach((v, i) => {
  const title = (v.title || '').toLowerCase();
  const cat = (v.category || '').toLowerCase();
  
  // Flag obvious mismatches
  if (cat === 'stepsister' && (title.includes('indian') || title.includes('milf') || title.includes('asian') || title.includes('doctor') || title.includes('gyno'))) {
    mismatches++;
    if (mismatches <= 10) console.log(`  [${i}] CAT="${v.category}" | TITLE="${v.title.substring(0, 60)}"`);
  }
  if (cat === 'indian' && (title.includes('stepsister') || title.includes('milf') || title.includes('asian') || title.includes('doctor'))) {
    mismatches++;
    if (mismatches <= 10) console.log(`  [${i}] CAT="${v.category}" | TITLE="${v.title.substring(0, 60)}"`);
  }
});
console.log(`Total obvious mismatches found: ${mismatches}`);

// Check for empty/missing descriptions
const missingDesc = db.filter(v => !v.description || v.description.trim() === '').length;
console.log(`\nVideos with missing description: ${missingDesc}`);
