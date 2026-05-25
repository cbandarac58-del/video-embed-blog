import axios from 'axios';

export async function GET({ request }) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Fetch the remote image as binary arraybuffer
    const response = await axios.get(targetUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 8000
    });

    const contentType = response.headers['content-type'] || 'image/jpeg';

    // Stream the binary data back to the browser with caching enabled
    return new Response(response.data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400' // Cache image locally for 24 hours
      }
    });

  } catch (error) {
    console.error('Image proxy request failed:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to fetch remote image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
