import fs from 'fs';
const db = JSON.parse(fs.readFileSync('src/content/videos/database.json', 'utf-8'));

const badAll = db.filter(v => !v.thumbnailUrl || v.thumbnailUrl.trim() === '' || v.thumbnailUrl.includes('hdnea='));
console.log('Total videos with bad thumbnails:', badAll.length);

badAll.forEach(v => {
  const site = v.embedUrl.includes('pornhub') ? 'PH' 
    : v.embedUrl.includes('xvideos') ? 'XV' 
    : v.embedUrl.includes('xxxbp') ? 'XXXBP' 
    : 'OTHER';
  const thumb = v.thumbnailUrl ? v.thumbnailUrl.slice(0, 80) : 'NONE';
  console.log('[' + site + '] ' + v.title.slice(0, 50) + ' | thumb: ' + thumb);
});
