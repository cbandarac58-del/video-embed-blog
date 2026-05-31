import { defineCollection, z } from 'astro:content';
import fs from 'fs';
import path from 'path';

const videos = defineCollection({
  // Custom loader to read database.json, auto-generating 'id' fields from slugs if omitted
  loader: async () => {
    const filePath = path.resolve('src/content/videos/database.json');
    if (!fs.existsSync(filePath)) return [];
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      
      // Ensure each item has a unique 'id' for the Content Layer
      return data.map((item: any, index: number) => ({
        id: item.id || item.slug || `video-${index}`,
        ...item
      }));
    } catch (e) {
      console.error("Failed to parse database.json in custom loader:", e);
      return [];
    }
  },
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    embedUrl: z.string(),
    thumbnailUrl: z.string(),
    description: z.string().optional().default(''),
    tags: z.array(z.string()),
    category: z.string(),
    rating: z.number().min(0).max(100).optional().default(90),
    views: z.union([z.number(), z.string()]), // Support both numeric (1500000) and string ("1.5M") inputs
    dateAdded: z.string()
  })
});

export const collections = { videos };
