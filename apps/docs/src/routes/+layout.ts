// Prerender the whole docs site so Cloudflare Pages serves static HTML
// (and Pagefind has something to index). Dynamic routes are reached by
// crawling links from the prerendered index pages (`/components`, `/play`,
// `/api`), which list every slug from the PLAYGROUNDS / API registries.
export const prerender = true;
