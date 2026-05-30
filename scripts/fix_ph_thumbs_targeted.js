import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The 3 problematic viewkeys
const BAD_VIEWKEYS = [
  '69b5d815869ad',
  '69c5d61dae089',
  '69090003e1ae4'
];

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function tryGetThumbFromEmbed(viewkey) {
  try {
    const url = `https://www.pornhub.com/embed/${viewkey}`;
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.pornhub.com/',
      }
    });

    // Look for video poster in embed page
    const $ = cheerio.load(data);
    const poster = $('video').attr('poster') || $('video source').attr('poster') || '';
    if (poster && poster.startsWith('http') && !poster.includes('hdnea=')) {
      return poster;
    }

    // Look for image_url in JS inline data
    const scriptContent = $('script').map((i, el) => $(el).html()).get().join('\n');
    
    // Match static ei.phncdn.com URLs
    const eiMatch = scriptContent.match(/https:\/\/ei\.phncdn\.com\/[^"'\s]+\.jpg/);
    if (eiMatch) return eiMatch[0];

    // Match other static phncdn URLs (no hdnea token)
    const staticMatch = scriptContent.match(/https:\/\/[a-z0-9\-]+\.phncdn\.com\/[^"'\s]+\.jpg(?![^"']*hdnea)/);
    if (staticMatch && !staticMatch[0].includes('hdnea=')) return staticMatch[0];

    // Try og:image from embed page
    const ogImage = $('meta[property="og:image"]').attr('content') || '';
    if (ogImage && !ogImage.includes('hdnea=') && ogImage.startsWith('http')) {
      return ogImage;
    }

    return null;
  } catch (err) {
    return null;
  }
}

async function tryGetThumbFromVideoPage(viewkey) {
  try {
    const url = `https://www.pornhub.com/view_video.php?viewkey=${viewkey}`;
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': 'bs=; platform=pc;',
      }
    });

    const $ = cheerio.load(data);

    // Look for the JSON-LD schema's thumbnail
    const jsonLd = $('script[type="application/ld+json"]').html() || '';
    if (jsonLd) {
      try {
        const parsed = JSON.parse(jsonLd);
        if (parsed.thumbnailUrl && !parsed.thumbnailUrl.includes('hdnea=')) return parsed.thumbnailUrl;
        if (Array.isArray(parsed.thumbnailUrl) && parsed.thumbnailUrl[0]) return parsed.thumbnailUrl[0];
      } catch(e) {}
    }

    // Find image from inline JS flashvars/player config
    const scripts = $('script').map((i, el) => $(el).html()).get().join('\n');
    
    // Match ei.phncdn.com static image URLs
    const eiMatch = scripts.match(/https:\/\/ei\.phncdn\.com\/[^"'\s\\]+\.jpg/);
    if (eiMatch) return eiMatch[0];

    // Match any static non-signed phncdn image
    const phnMatch = scripts.match(/["'](https:\/\/[a-z0-9\-]+\.phncdn\.com\/[^\s"'\\]+\.jpg)["']/);
    if (phnMatch && !phnMatch[1].includes('hdnea=')) return phnMatch[1];

    return null;
  } catch(err) {
    return null;
  }
}

async function main() {
  const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  console.log('\n🔧 Targeted fix for 3 remaining bad Pornhub thumbnails\n');

  let fixed = 0;
  for (const viewkey of BAD_VIEWKEYS) {
    const idx = db.findIndex(v => v.embedUrl === `https://www.pornhub.com/embed/${viewkey}`);
    if (idx === -1) {
      console.log(`viewkey ${viewkey} not found in DB, skipping.`);
      continue;
    }

    const v = db[idx];
    process.stdout.write(`Fixing "${v.title.slice(0, 50)}"...\n`);

    // Try embed page first
    process.stdout.write('  → trying embed page...');
    let thumb = await tryGetThumbFromEmbed(viewkey);
    if (thumb) {
      console.log(' ✅ Got from embed!');
    } else {
      console.log(' ❌');
      // Try video page with different approach
      process.stdout.write('  → trying video page...');
      thumb = await tryGetThumbFromVideoPage(viewkey);
      if (thumb) {
        console.log(' ✅ Got from video page!');
      } else {
        console.log(' ❌');
        // Remove the video from DB as it seems removed/private
        console.log('  → Video appears removed/private. Removing from DB.');
        db.splice(idx, 1);
        continue;
      }
    }

    db[idx].thumbnailUrl = thumb;
    fixed++;
    await sleep(1000);
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  console.log(`\n✅ Fixed: ${fixed} | DB updated (${db.length} total videos)`);
}

main();
