import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DELAY_MS = 800;

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function safeWriteFile(filePath, content) {
  let attempts = 5;
  while (attempts > 0) {
    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      return;
    } catch (err) {
      attempts--;
      if (attempts === 0) throw err;
      console.log(`\n⚠️  File write failed (likely locked). Retrying in 2s... (${attempts} attempts left)`);
      await sleep(2000);
    }
  }
}

function isExpiredThumb(url) {
  if (!url || url.trim() === '') return true;
  // Skip YouTube thumbnails since they contain "default" in "hqdefault.jpg"
  if (url.includes('youtube.com') || url.includes('youtu.be')) return false;
  // pix-fl / pix-cdn77 with signed token
  if (url.includes('hdnea=')) return true;
  // Empty or placeholder
  if (url.includes('no_thumb') || url.includes('default')) return true;
  return false;
}

async function fetchFreshThumb(embedUrl) {
  try {
    // Determine source site and fetch OG image
    let pageUrl = '';
    
    if (embedUrl.includes('pornhub.com')) {
      const viewkey = embedUrl.split('/embed/')[1];
      if (!viewkey) return null;
      pageUrl = `https://www.pornhub.com/view_video.php?viewkey=${viewkey}`;
    } else if (embedUrl.includes('xvideos.com')) {
      const videoId = embedUrl.split('/embedframe/')[1];
      if (!videoId) return null;
      pageUrl = `https://www.xvideos.com/video${videoId}/`;
    } else if (embedUrl.includes('xxxbp.tv')) {
      const videoId = embedUrl.split('/embed/')[1];
      if (!videoId) return null;
      pageUrl = `https://xxxbp.tv/video/${videoId}/`;
    } else {
      return null;
    }

    const { data } = await axios.get(pageUrl, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const $ = cheerio.load(data);
    const ogImage = $('meta[property="og:image"]').attr('content') || '';
    
    // Only return if it's a valid non-signed static URL
    if (ogImage && !ogImage.includes('hdnea=') && ogImage.startsWith('http')) {
      return ogImage;
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function main() {
  const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  // Find all videos with bad thumbnails
  const badVideos = db
    .map((v, i) => ({ ...v, _idx: i }))
    .filter(v => isExpiredThumb(v.thumbnailUrl));

  console.log(`\n📦 Total videos: ${db.length}`);
  console.log(`🔧 Videos with bad/expired thumbnails: ${badVideos.length}`);
  
  if (badVideos.length === 0) {
    console.log('✅ No broken thumbnails found!');
    return;
  }

  let fixed = 0;
  let failed = 0;

  for (let i = 0; i < badVideos.length; i++) {
    const v = badVideos[i];
    process.stdout.write(`[${i+1}/${badVideos.length}] Fixing "${v.title.slice(0, 45)}"...`);

    const newThumb = await fetchFreshThumb(v.embedUrl);
    
    if (newThumb) {
      db[v._idx].thumbnailUrl = newThumb;
      fixed++;
      console.log(` ✅ Fixed`);
    } else {
      failed++;
      console.log(` ❌ Could not fix`);
    }

    await sleep(DELAY_MS);
  }

  // Save updated database
  await safeWriteFile(dbPath, JSON.stringify(db, null, 2));

  console.log(`\n✅ Fixed: ${fixed} thumbnails`);
  console.log(`❌ Could not fix: ${failed} thumbnails`);
  console.log(`📦 Database updated!`);
}

main();
