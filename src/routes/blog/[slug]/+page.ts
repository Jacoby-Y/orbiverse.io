import { getBlogSlugs } from '$lib/blog-slugs';

export const prerender = true;

export function entries() {
	return getBlogSlugs().map((slug) => ({ slug }));
}
