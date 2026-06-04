import site from '$lib/data/site.json';
import { canonicalUrl, toIsoDate } from '$lib/seo';
import { getAllPosts } from '$lib/server/blog';
import type { BlogPost } from '$lib/types';
import type { SiteConfig } from '$lib/types';

const config = site as SiteConfig;

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function postUrl(slug: string): string {
	return `${config.url}/blog/${slug}`;
}

function formatRfc822(date: string): string {
	return new Date(date).toUTCString();
}

function formatIso(date: string): string {
	return toIsoDate(date);
}

export function buildRssFeed(): string {
	const posts = getAllPosts();
	const items = posts
		.map(
			(post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl(post.slug)}</link>
      <guid isPermaLink="true">${postUrl(post.slug)}</guid>
      <pubDate>${formatRfc822(post.date)}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`
		)
		.join('');

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.name)} Blog</title>
    <link>${config.url}/blog</link>
    <description>${escapeXml(config.tagline)}</description>
    <language>en-us</language>
    <lastBuildDate>${posts[0] ? formatRfc822(posts[0].date) : formatRfc822(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${config.url}/blog/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;
}

export function buildAtomFeed(): string {
	const posts = getAllPosts();
	const updated = posts[0]?.date ?? new Date().toISOString();
	const entries = posts
		.map(
			(post) => `
  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${postUrl(post.slug)}" />
    <id>${postUrl(post.slug)}</id>
    <updated>${formatIso(post.date)}</updated>
    <summary>${escapeXml(post.description)}</summary>
  </entry>`
		)
		.join('');

	return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(config.name)} Blog</title>
  <link href="${config.url}/blog" />
  <link href="${config.url}/blog/atom.xml" rel="self" type="application/atom+xml" />
  <id>${config.url}/blog</id>
  <updated>${formatIso(updated)}</updated>${entries}
</feed>`;
}

export function buildJsonFeed(): string {
	const posts = getAllPosts();

	const feed = {
		version: 'https://jsonfeed.org/version/1.1',
		title: `${config.name} Blog`,
		home_page_url: `${config.url}/blog`,
		feed_url: `${config.url}/blog/feed.json`,
		description: config.tagline,
		items: posts.map((post: BlogPost) => ({
			id: postUrl(post.slug),
			url: postUrl(post.slug),
			title: post.title,
			summary: post.description,
			date_published: formatIso(post.date),
			tags: post.tags
		}))
	};

	return JSON.stringify(feed, null, 2);
}

export function buildSitemap(): string {
	const posts = getAllPosts();
	const staticRoutes = ['/', '/games', '/blog'];
	const buildDate = new Date().toISOString().split('T')[0];

	const urls = [
		...staticRoutes.map(
			(path) => `
  <url>
    <loc>${canonicalUrl(path)}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>${path === '/' ? 'weekly' : 'weekly'}</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`
		),
		...posts.map(
			(post) => `
  <url>
    <loc>${postUrl(post.slug)}</loc>
    <lastmod>${formatIso(post.date).split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
		)
	].join('');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
}

export { config as siteConfig };
