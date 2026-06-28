import { g as getCollection } from './_astro_content_BE1xHoIF.mjs';

async function GET() {
  // Read our collection from content layer
  const videos = await getCollection('videos');

  // Helper to slugify consistently
  const slugify = (text) => 
    text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

  // Extract unique categories
  const categories = [...new Set(videos.map(v => v.data.category))].filter(Boolean);

  // Extract unique tags
  const tagsSet = new Set();
  videos.forEach(v => {
    (v.data.tags || []).forEach(tag => {
      const tagClean = tag.trim();
      if (tagClean) {
        tagsSet.add(slugify(tagClean));
      }
    });
  });
  const tags = Array.from(tagsSet);

  // Build the XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Homepage -->
  <url>
    <loc>https://vixtube.net/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Legal Pages -->
  <url>
    <loc>https://vixtube.net/dmca</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://vixtube.net/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://vixtube.net/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://vixtube.net/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Popular & Featured Static Pages -->
  <url>
    <loc>https://vixtube.net/popular</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://vixtube.net/featured</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Categories Pages -->
  ${categories.map((cat) => `
  <url>
    <loc>https://vixtube.net/category/${slugify(cat)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}

  <!-- Tags Pages -->
  ${tags.map((tagSlug) => `
  <url>
    <loc>https://vixtube.net/tag/${tagSlug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

  <!-- Individual Video Pages -->
  ${videos.map((video) => `
  <url>
    <loc>https://vixtube.net/videos/${video.data.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
