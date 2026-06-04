import { buildPageSeo, siteConfig } from '$lib/seo';
import type { PageLoad } from './$types';

export const load: PageLoad = () => ({
	seo: buildPageSeo({
		title: 'Games',
		description: `Games from ${siteConfig.name} — available on Itch.io and Steam.`
	})
});
