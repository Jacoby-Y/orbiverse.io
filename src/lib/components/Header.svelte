<script lang="ts">
	import { page } from '$app/stores';
	import site from '$lib/data/site.json';
	import type { SiteConfig } from '$lib/types';

	const config = site as SiteConfig;
	const isHome = $derived($page.url.pathname === '/');

	function navHref(hash: string, route: string): string {
		return isHome ? hash : route;
	}
</script>

<header class="header">
	<div class="container header-inner">
		<a href="/" class="brand" aria-label="{config.name} home">
			<img draggable="false" src="/mini-logo.png" alt="" class="logo" width="36" height="36" />
			<span class="brand-name">{config.name}</span>
		</a>

		<nav class="nav" aria-label="Main">
			<a href="/games" class="nav-link">Games</a>
			<a href="/blog" class="nav-link">Blog</a>
			<a href={navHref('#subscribe', '/blog#subscribe')} class="nav-link">Subscribe</a>
		</nav>
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 100;
		min-height: var(--header-height);
		height: calc(var(--header-height) + env(safe-area-inset-top, 0px));
		padding-top: env(safe-area-inset-top, 0px);
		background: color-mix(in srgb, var(--bg-elevated) 94%, transparent);
		backdrop-filter: blur(14px);
		border-bottom: 1px solid var(--border);
		box-shadow: 0 1px 0 color-mix(in srgb, var(--text) 4%, transparent);
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
		gap: 1rem;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--text);
		text-decoration: none;
		flex-shrink: 0;
	}

	.brand:hover {
		color: var(--text);
	}

	.logo {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		object-fit: cover;
	}

	.brand-name {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.05rem;
		letter-spacing: -0.02em;
	}

	.nav {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.nav-link {
		color: var(--text-secondary);
		font-size: 1rem;
		font-weight: 500;
		text-decoration: none;
		transition:
			color 150ms ease,
			background 150ms ease;
		padding: 0.5rem 0.85rem;
		min-height: var(--touch-min);
		display: inline-flex;
		align-items: center;
		border-radius: 8px;
		-webkit-tap-highlight-color: transparent;
	}

	.nav-link:hover {
		color: var(--text);
		background: color-mix(in srgb, var(--text) 6%, transparent);
	}

	.nav-link:focus-visible {
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 10%, transparent);
	}

	@media (max-width: 480px) {
		.brand-name {
			display: none;
		}

		.nav {
			gap: 0.15rem;
		}

		.nav-link {
			font-size: 0.9375rem;
			padding: 0.5rem 0.65rem;
		}
	}
</style>
