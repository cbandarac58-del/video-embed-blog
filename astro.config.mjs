import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://vixtube.net',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  }
});
