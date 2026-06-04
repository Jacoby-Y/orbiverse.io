import { buildAtomFeed } from '$lib/feeds';

export const prerender = true;

export function GET() {
	const body = buildAtomFeed();

	return new Response(body, {
		headers: {
			'Content-Type': 'application/atom+xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
