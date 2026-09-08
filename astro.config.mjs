import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://petruzzellialessandro.github.io',
  base: '/MasterWebSite',
  output: 'static',
  integrations: [sitemap()],
});
