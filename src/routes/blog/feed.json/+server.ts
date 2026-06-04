import { buildJsonFeed } from '$lib/feeds';

export const prerender = true;

export function GET() {
	const body = buildJsonFeed();

	return new Response(body, {
		headers: {
			'Content-Type': 'application/feed+json; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
