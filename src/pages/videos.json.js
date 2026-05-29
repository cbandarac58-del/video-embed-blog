import fs from 'fs';
import path from 'path';

export async function GET() {
  const jsonPath = path.resolve('src/content/videos/database.json');
  const fileData = fs.readFileSync(jsonPath, 'utf-8');
  const videos = JSON.parse(fileData);

  // Expose clean, minimal fields needed for search and card rendering
  const searchIndex = videos.map(v => ({
    title: v.title,
    slug: v.slug,
    rating: v.rating || 90,
    views: v.views || '100K',
    category: v.category || 'Other',
    tags: v.tags || [],
    thumbnailUrl: v.thumbnailUrl || '',
    dateAdded: v.dateAdded
  }));

  // Sort by dateAdded descending by default
  searchIndex.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}
