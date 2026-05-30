import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://vixtube.net',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  }
});
