import { getAllPosts } from '$lib/server/blog';
import { buildPageSeo, siteConfig } from '$lib/seo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		posts: getAllPosts(),
		seo: buildPageSeo({
			title: 'Blog',
			description: `Devlogs and studio updates from ${siteConfig.name}.`
		})
	};
};
