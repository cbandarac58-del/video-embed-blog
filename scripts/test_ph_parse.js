import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

async function main() {
  try {
    console.log('Fetching Pornhub search page 1...');
    const url = 'https://www.pornhub.com/video/search?search=sri+lankan+girl+sex+video+download&page=1';
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    // Save html for manual reference if needed
    fs.writeFileSync('scripts/ph_search_page.html', data, 'utf-8');
    console.log('Saved page html to scripts/ph_search_page.html');

    const $ = cheerio.load(data);
    
    // Let's search for potential video card containers and items
    console.log('\n--- Analyzing list items ---');
    const selectors = [
      'li.videoBox',
      'div.ph-thumbnail-wrapper',
      'ul.videos.search-video-thumbs li',
      'div.videoBox',
      'a[href*="view_video.php?viewkey="]'
    ];

    selectors.forEach(sel => {
      console.log(`Selector "${sel}" count:`, $(sel).length);
    });

    console.log('\n--- Extracting first 3 links matching view_video.php ---');
    const links = [];
    $('a[href*="view_video.php?viewkey="]').slice(0, 10).each((i, el) => {
      const href = $(el).attr('href');
      const title = $(el).attr('title') || $(el).find('img').attr('alt') || $(el).text().trim();
      links.push({ href, title });
    });
    console.log(links);

    console.log('\n--- Inspecting first li.videoBox HTML ---');
    const firstBox = $('li.videoBox').first();
    if (firstBox.length > 0) {
      console.log('HTML snippet of first videoBox:\n', firstBox.html().slice(0, 1000));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
