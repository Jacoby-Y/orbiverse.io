<script lang="ts">
	import { page } from '$app/state';
	import site from '$lib/data/site.json';
	import { buildPageSeo, canonicalUrl, jsonLdScriptTag, resolveOgImage } from '$lib/seo';
	import type { SiteConfig } from '$lib/types';

	const config = site as SiteConfig;

	const merged = $derived.by(() => {
		if (page.status >= 400) {
			return buildPageSeo({
				title: page.status === 404 ? 'Page not found' : 'Error',
				description: `The page you requested could not be found on ${config.name}.`,
				noindex: true
			});
		}
		return page.data.seo ?? buildPageSeo();
	});

	const fullTitle = $derived(
		merged.title ? `${merged.title} · ${config.name}` : config.name
	);

	const canonical = $derived(canonicalUrl(page.url.pathname));
	const ogImage = $derived(resolveOgImage(merged.image));
	const twitterCard = $derived(ogImage ? 'summary_large_image' : 'summary');

	const jsonLdItems = $derived.by(() => {
		if (!merged.jsonLd) return [];
		return Array.isArray(merged.jsonLd) ? merged.jsonLd : [merged.jsonLd];
	});

	const twitterHandle = $derived.by(() => {
		const url = config.social.twitter?.trim();
		if (!url) return null;
		try {
			const handle = new URL(url).pathname.replace(/^\//, '').split('/')[0];
			return handle ? `@${handle}` : null;
		} catch {
			return null;
		}
	});
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={merged.description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={merged.description} />
	<meta property="og:type" content={merged.type} />
	<meta property="og:url" content={canonical} />
	<meta property="og:site_name" content={config.name} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:alt" content={merged.title ?? config.name} />

	<meta name="twitter:card" content={twitterCard} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={merged.description} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content={merged.title ?? config.name} />
	{#if twitterHandle}
		<meta name="twitter:site" content={twitterHandle} />
	{/if}

	{#if merged.type === 'article' && merged.publishedTime}
		<meta property="article:published_time" content={merged.publishedTime} />
	{/if}
	{#if merged.type === 'article' && merged.modifiedTime}
		<meta property="article:modified_time" content={merged.modifiedTime} />
	{/if}
	{#if merged.type === 'article' && merged.tags}
		{#each merged.tags as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	{#if merged.noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow, max-image-preview:large" />
	{/if}

	<link rel="icon" href="/mini-logo.png" type="image/png" />
	<link rel="apple-touch-icon" href="/mini-logo.png" />
	<link rel="manifest" href="/manifest.webmanifest" />

	<link
		rel="alternate"
		type="application/rss+xml"
		title="{config.name} Blog"
		href="/blog/rss.xml"
	/>
	<link
		rel="alternate"
		type="application/atom+xml"
		title="{config.name} Blog"
		href="/blog/atom.xml"
	/>
	<link
		rel="alternate"
		type="application/feed+json"
		title="{config.name} Blog"
		href="/blog/feed.json"
	/>

	{#each jsonLdItems as schema, index (index)}
		{@html jsonLdScriptTag(schema)}
	{/each}
</svelte:head>
