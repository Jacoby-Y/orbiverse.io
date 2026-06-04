import { getLatestPosts } from '$lib/server/blog';
import { getFeaturedGames } from '$lib/games';
import { buildHomeSeo } from '$lib/seo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		featuredGames: getFeaturedGames(3),
		latestPosts: getLatestPosts(3),
		seo: buildHomeSeo()
	};
};
