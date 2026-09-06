import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://vixtube.net',
  prefetch: {
    prefetchAll: false
  }
});
