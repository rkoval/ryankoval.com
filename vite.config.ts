// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import type {Plugin} from 'vite';
import {defineConfig} from '@lovable.dev/vite-tanstack-config';
import {BLOG_SLUGS} from './src/content/blog/slugs';
import {generateSkillsSprite} from './scripts/generate-skills-sprite';

function skillsSpritePlugin(): Plugin {
  return {
    name: 'skills-sprite',
    buildStart() {
      generateSkillsSprite();
    },
    configureServer() {
      generateSkillsSprite();
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: {entry: 'server'},
    prerender: {
      enabled: true,
      crawlLinks: true,
      autoStaticPathsDiscovery: true,
      pages: [{path: '/404'}, {path: '/error'}, ...BLOG_SLUGS.map((slug) => ({path: `/blog/${slug}`}))],
    },
  },
  vite: {
    plugins: [skillsSpritePlugin()],
  },
});
