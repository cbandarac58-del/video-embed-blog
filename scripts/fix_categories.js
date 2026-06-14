import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');

const CATEGORY_MAP = {
  'indian': 'Indian',
  'stepsister': 'Stepsister',
  'step sister': 'Stepsister',
  'step-sister': 'Stepsister',
  'milf': 'MILF',
  'stepmom': 'Step Mom',
  'step mom': 'Step Mom',
  'step-mom': 'Step Mom',
  'latina': 'Latina',
  'lesbian': 'Lesbian',
  'anal': 'Anal',
  'asian': 'Asian',
  'threesome': 'Threesome',
  'arab': 'Arab',
  'ebony': 'Ebony',
  'big-ass': 'Big Ass',
  'big ass': 'Big Ass',
  'big-tits': 'Big Tits',
  'big tits': 'Big Tits',
  'teen': 'Teen',
  'hardcore': 'Hardcore',
  'doctor': 'Doctor',
  'doctor / gyno': 'Doctor',
  'doctor/gyno': 'Doctor',
  'doctor / nurse': 'Doctor',
  'massage': 'Massage',
  'office': 'Office',
  'amateur': 'Amateur',
  'yt romance': 'YT Romance',
  'yt-romance': 'YT Romance',
  'romance': 'YT Romance'
};

function main() {
  console.log('📖 Reading database.json...');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // Get unique categories before cleaning
  const originalCats = [...new Set(db.map(v => v.category))];
  console.log('\n=== ORIGINAL CATEGORIES IN DATABASE ===');
  console.log(originalCats);

  let updatedCount = 0;
  
  // Standardize categories
  db.forEach(video => {
    const orig = video.category || '';
    const cleanKey = orig.trim().toLowerCase();
    let mapped = CATEGORY_MAP[cleanKey] || orig;
    
    // Smart rule: if video is classified as MILF or Amateur, but the title contains Stepmom keywords, reclassify to "Step Mom"
    const titleLower = (video.title || '').toLowerCase();
    const isStepMom = titleLower.includes('stepmom') || titleLower.includes('step mom') || titleLower.includes('step-mom') || titleLower.includes('stepmother');
    if ((mapped === 'MILF' || mapped === 'Amateur') && isStepMom) {
      mapped = 'Step Mom';
    }
    
    if (video.category !== mapped) {
      video.category = mapped;
      updatedCount++;
    }
  });

  const finalCats = [...new Set(db.map(v => v.category))];
  console.log('\n=== STANDARDIZED CATEGORIES IN DATABASE ===');
  console.log(finalCats);

  if (updatedCount > 0) {
    console.log(`\n💾 Writing changes to database.json (${updatedCount} videos updated)...`);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log('🎉 Database updated successfully!');
  } else {
    console.log('\n✅ Database categories are already standardized. No changes needed.');
  }
}

main();
