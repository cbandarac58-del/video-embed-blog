import { getCollection } from 'astro:content';

const slugify = (text) => 
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

export async function GET() {
  const videos = await getCollection('videos');
  
  const categorySlugMap = {};
  const tagSlugMap = {};

  videos.forEach(v => {
    if (v.data.category) {
      const clean = v.data.category.trim();
      categorySlugMap[clean.toLowerCase()] = slugify(clean);
    }
    (v.data.tags || []).forEach((tag) => {
      const clean = tag.trim();
      if (clean) {
        tagSlugMap[clean.toLowerCase()] = slugify(clean);
      }
    });
  });

  return new Response(JSON.stringify({ categorySlugMap, tagSlugMap }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
