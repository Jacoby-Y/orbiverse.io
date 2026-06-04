<script lang="ts">
	import site from '$lib/data/site.json';
	import type { SiteConfig } from '$lib/types';

	const config = site as SiteConfig;
	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="container footer-inner">
		<p class="copyright">&copy; {year} {config.name}</p>

		<div class="footer-links">
			{#if config.social.itch}
				<a href={config.social.itch} rel="noopener noreferrer" target="_blank">Itch.io</a>
			{/if}
			{#if config.social.twitter}
				<a href={config.social.twitter} rel="noopener noreferrer" target="_blank">Twitter</a>
			{/if}
			<a href="/blog/rss.xml">RSS</a>
			<a href="/blog/atom.xml">Atom</a>
		</div>
	</div>
</footer>

<style>
	.footer {
		border-top: 1px solid var(--border);
		padding-block: 2rem;
		padding-bottom: max(2rem, env(safe-area-inset-bottom, 0px));
		margin-top: auto;
	}

	.footer-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	@media (max-width: 480px) {
		.footer-inner {
			flex-direction: column;
			align-items: flex-start;
		}

		.footer-links {
			gap: 1rem;
		}
	}

	.copyright {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.footer-links {
		display: flex;
		gap: 1.25rem;
		flex-wrap: wrap;
	}

	.footer-links a {
		color: var(--text-secondary);
		font-size: 0.9rem;
		font-weight: 500;
		text-decoration: none;
	}

	.footer-links a:hover {
		color: var(--accent);
	}
</style>
