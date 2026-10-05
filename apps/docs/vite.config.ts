import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter({
        // Fallback serves any route that wasn't prerendered (e.g. sandbox/*)
        // as a client-rendered SPA shell. SvelteKit's router then hydrates the
        // correct page from the URL.
        fallback: '200.html',
      }),
      paths: {
        // GitHub Pages serves the docs at https://baseballyama.github.io/kumiki/.
        // The deploy workflow sets `BASE_PATH=/kumiki`; local dev / preview leave
        // it unset and serve at the root. Once a custom domain (e.g. kumiki.dev)
        // is wired up, drop the env var and the site moves back to `/`.
        base: (process.env.BASE_PATH ?? '') as '' | `/${string}`,
      },
      prerender: {
        handleHttpError: ({ path, referrer, status }) => {
          // Pre-existing broken links we don't want to block the deploy on.
          // Match suffix only so the rules survive the configured base path.
          const ignoredSuffixes = ['/favicon.svg', '/docs/market-research'];
          if (ignoredSuffixes.some((s) => path.endsWith(s))) {
            console.warn(`Ignoring missing prerender target ${path} (from ${referrer}, ${status})`);
            return;
          }
          throw new Error(`${status} ${path}${referrer ? ` (from ${referrer})` : ''}`);
        },
        // Auto-generated TypeDoc pages occasionally produce `#name-N` anchors
        // (overloaded members) whose collision-suffixed ids only exist in the
        // rendered source pane, not in the link target. Treat as warning.
        handleMissingId: 'warn',
      },
    }),
  ],
  server: {
    port: 5173,
    strictPort: false,
  },
});
