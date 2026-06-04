<script lang="ts">
	type Props = {
		compact?: boolean;
	};

	let { compact = false }: Props = $props();
</script>

<section id="subscribe" class="subscribe" class:subscribe--compact={compact}>
	<div class="subscribe-inner">
		<h2 class="title">Follow the devlog</h2>
		<p class="description">
			Subscribe in Feedly, Inoreader, NetNewsWire, or any RSS reader.
		</p>
		<div class="links">
			<a href="/blog/rss.xml" class="btn btn--primary btn--stack-mobile">RSS</a>
			<a href="/blog/atom.xml" class="btn btn--ghost btn--stack-mobile">Atom</a>
			<a href="/blog/feed.json" class="btn btn--ghost btn--stack-mobile">JSON Feed</a>
		</div>
	</div>
</section>

<style>
	.subscribe {
		padding-block: 3rem;
	}

	.subscribe--compact {
		padding-block: 0;
		margin-bottom: 2.5rem;
	}

	.subscribe-inner {
		padding: 2rem;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: linear-gradient(
			135deg,
			var(--bg-elevated),
			color-mix(in srgb, var(--accent) 5%, var(--bg-elevated))
		);
	}

	.title {
		margin: 0 0 0.5rem;
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 600;
	}

	.description {
		margin: 0 0 1.25rem;
		color: var(--text-secondary);
		max-width: 42ch;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	@media (max-width: 480px) {
		.subscribe-inner {
			padding: 1.25rem;
		}

		.links {
			flex-direction: column;
		}
	}
</style>
