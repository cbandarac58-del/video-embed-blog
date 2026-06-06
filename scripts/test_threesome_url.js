import axios from 'axios';
import * as cheerio from 'cheerio';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

function countVideoLinks(html) {
  const $ = cheerio.load(html);
  const seen = new Set();
  $('a').each((_, el) => {
    const h = $(el).attr('href') || '';
    if (/\/video\.[a-z0-9]+\//i.test(h)) seen.add(h);
  });
  return seen.size;
}

const TEST_URLS = [
  'https://www.xvideos.com/tags/threesome',
  'https://www.xvideos.com/tags/threesome/0',
  'https://www.xvideos.com/tags/threesome/1',
  'https://www.xvideos.com/tags/threesome/2',
  'https://www.xvideos.com/?k=threesome',
  'https://www.xvideos.com/?k=threesome&p=1',
  'https://www.xvideos.com/?k=threesome&p=2',
];

(async () => {
  for (const url of TEST_URLS) {
    try {
      const r = await axios.get(url, { timeout: 15000, headers: HEADERS });
      const count = countVideoLinks(r.data);
      console.log(`✅ ${r.status} | videos: ${count} | ${url}`);
    } catch (e) {
      console.log(`❌ ${e.response?.status || e.message} | ${url}`);
    }
    await new Promise(res => setTimeout(res, 1000));
  }
})();
