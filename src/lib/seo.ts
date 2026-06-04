import site from '$lib/data/site.json';
import type { BlogPost } from '$lib/types';
import type { SiteConfig } from '$lib/types';

const config = site as SiteConfig;

export type SeoMeta = {
	title?: string;
	description?: string;
	type?: 'website' | 'article';
	/** Site-relative (`/og-logo.png`) or absolute URL */
	image?: string;
	publishedTime?: string;
	modifiedTime?: string;
	tags?: string[];
	jsonLd?: Record<string, unknown> | Record<string, unknown>[];
	noindex?: boolean;
};

export function toIsoDate(value: unknown): string {
	if (value instanceof Date) {
		return value.toISOString();
	}
	if (typeof value === 'string' && value.trim()) {
		const parsed = new Date(value);
		if (!Number.isNaN(parsed.getTime())) {
			return parsed.toISOString();
		}
	}
	return new Date().toISOString();
}

export function absoluteUrl(pathOrUrl: string): string {
	if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
		return pathOrUrl;
	}
	const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
	return `${config.url}${path}`;
}

export function canonicalUrl(pathname: string): string {
	if (pathname === '/' || pathname === '') {
		return config.url;
	}
	return `${config.url}${pathname}`;
}

export function defaultOgImage(): string {
	return absoluteUrl(config.ogImage ?? '/og-logo.png');
}

export function resolveOgImage(image?: string): string {
	if (!image) return defaultOgImage();
	return absoluteUrl(image);
}

function sameAsLinks(): string[] {
	const links: string[] = [];
	if (config.social.itch) links.push(config.social.itch);
	if (config.social.twitter) links.push(config.social.twitter);
	return links;
}

export function buildOrganizationJsonLd(): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': `${config.url}/#organization`,
		name: config.name,
		url: config.url,
		logo: absoluteUrl('/mini-logo.png'),
		description: config.tagline,
		email: config.author.email,
		sameAs: sameAsLinks()
	};
}

export function buildWebSiteJsonLd(): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${config.url}/#website`,
		name: config.name,
		url: config.url,
		description: config.tagline,
		inLanguage: 'en-US',
		publisher: { '@id': `${config.url}/#organization` }
	};
}

export function buildBreadcrumbJsonLd(
	items: { name: string; path: string }[]
): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: canonicalUrl(item.path)
		}))
	};
}

export function buildBlogPostingJsonLd(post: BlogPost): Record<string, unknown> {
	const url = `${config.url}/blog/${post.slug}`;
	const published = toIsoDate(post.date);

	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		headline: post.title,
		description: post.description,
		datePublished: published,
		dateModified: published,
		url,
		mainEntityOfPage: url,
		inLanguage: 'en-US',
		image: post.cover ? resolveOgImage(post.cover) : defaultOgImage(),
		author: {
			'@type': 'Organization',
			name: config.author.name,
			url: config.url
		},
		publisher: {
			'@type': 'Organization',
			name: config.name,
			url: config.url,
			logo: {
				'@type': 'ImageObject',
				url: absoluteUrl('/mini-logo.png')
			}
		},
		...(post.tags?.length ? { keywords: post.tags.join(', ') } : {})
	};
}

export function buildPageSeo(overrides: SeoMeta = {}): SeoMeta {
	return {
		description: config.tagline,
		type: 'website',
		image: config.ogImage ?? '/og-logo.png',
		...overrides
	};
}

export function buildHomeSeo(): SeoMeta {
	return buildPageSeo({
		jsonLd: [buildOrganizationJsonLd(), buildWebSiteJsonLd()]
	});
}

export function buildBlogPostSeo(post: BlogPost): SeoMeta {
	const published = toIsoDate(post.date);

	return buildPageSeo({
		title: post.title,
		description: post.description,
		type: 'article',
		image: post.cover ?? config.ogImage ?? '/og-logo.png',
		publishedTime: published,
		modifiedTime: published,
		tags: post.tags,
		jsonLd: [
			buildBlogPostingJsonLd(post),
			buildBreadcrumbJsonLd([
				{ name: 'Home', path: '/' },
				{ name: 'Blog', path: '/blog' },
				{ name: post.title, path: `/blog/${post.slug}` }
			])
		]
	});
}

export function jsonLdScriptTag(data: Record<string, unknown> | Record<string, unknown>[]): string {
	const payload = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${payload}</script>`;
}

export { config as siteConfig };
