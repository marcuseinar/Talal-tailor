import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Relative base so the same build works from a domain root, a GitHub Pages
// sub-path, or the Artifact host without rewriting asset URLs.
export default defineConfig({
  base: './',
  plugins: [svelte()],
  build: {
    target: 'es2022',
    // The demo fixtures (avatars, fonts metrics) are small; inlining them keeps
    // the deployable surface to a single JS bundle plus one stylesheet.
    assetsInlineLimit: 512 * 1024,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        codeSplitting: false,
        entryFileNames: 'assets/app.js',
        assetFileNames: 'assets/app[extname]'
      }
    }
  }
});
