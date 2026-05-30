import axios from 'axios';
import * as cheerio from 'cheerio';

const url = 'https://www.xvideos.com/c/Big_Ass-24';

async function test() {
  try {
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const $ = cheerio.load(data);
    const urls = [];

    // Find all links containing "/video."
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/video.')) {
        // Resolve absolute URL
        let absoluteUrl = href;
        if (href.startsWith('/')) {
          absoluteUrl = 'https://www.xvideos.com' + href;
        }
        if (!urls.includes(absoluteUrl)) {
          urls.push(absoluteUrl);
        }
      }
    });

    console.log(`Found ${urls.length} raw video links.`);
    console.log('First 5 URLs:');
    urls.slice(0, 5).forEach(u => console.log(' -', u));

    // Specifically filter watch links which usually have video.XXXXX/slug format
    const filteredUrls = urls.filter(u => {
      // Matches /video.xxxx/
      return /\/video\.[a-z0-9]+\//i.test(u);
    });

    console.log(`Filtered to ${filteredUrls.length} actual video watch URLs.`);
    console.log('First 10 filtered URLs:');
    filteredUrls.slice(0, 10).forEach(u => console.log(' -', u));

  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
