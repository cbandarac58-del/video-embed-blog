import axios from 'axios';

async function test() {
  try {
    const urls = [
      'https://xxxbp.tv/embed/196676?sizes=144,240,360,480,720',
      'https://xxxbp.tv/embed/196676?video-sizes=144,240,360,480,720',
      'https://xxxbp.tv/embed/196676?sizes=true',
    ];

    for (const url of urls) {
      const { data } = await axios.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        }
      });
      const line = data.split('\n').find(line => line.includes('playerNext') && line.includes('div'));
      console.log(`${url.split('?')[1]}:`, line ? line.trim() : 'Not found');
    }

  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
