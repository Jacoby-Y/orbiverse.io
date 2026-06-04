import { buildRssFeed } from '$lib/feeds';

export const prerender = true;

export function GET() {
	const body = buildRssFeed();

	return new Response(body, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
