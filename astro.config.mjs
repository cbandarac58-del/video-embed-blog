import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: vercel({
    edgeMiddleware: true,
  }),
  site: 'https://vixtube.net',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  }
});
