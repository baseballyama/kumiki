// Sandbox pages drive demos through `?…` query parameters
// (`page.url.searchParams`), which prerendering forbids — let them
// stay SSR + client-hydrated.
export const prerender = false;
