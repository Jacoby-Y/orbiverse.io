import { buildSitemap } from '$lib/feeds';

export const prerender = true;

export function GET() {
	const body = buildSitemap();

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
