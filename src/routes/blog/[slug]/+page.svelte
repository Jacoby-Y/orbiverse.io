<script lang="ts">
	import '$lib/styles/prose.css';
	import { toIsoDate } from '$lib/seo';

	let { data } = $props();

	const formattedDate = $derived(
		new Date(data.post.date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);

	const isoDate = $derived(toIsoDate(data.post.date));
</script>

<article class="article">
	<div class="container">
		<a href="/blog" class="back">← All posts</a>

		<header class="header">
			<div class="meta">
				<time datetime={isoDate}>{formattedDate}</time>
				<span aria-hidden="true">·</span>
				<span>{data.post.readingTime} min read</span>
			</div>
			<h1 class="title">{data.post.title}</h1>
			{#if data.post.tags && data.post.tags.length > 0}
				<div class="tag-list">
					{#each data.post.tags as tag (tag)}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			{/if}
		</header>

		<div class="prose">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.post.html}
		</div>

		{#if data.prev || data.next}
			<nav class="adjacent" aria-label="Post navigation">
				{#if data.prev}
					<a href="/blog/{data.prev.slug}" class="adjacent-link">
						<span class="adjacent-label">Previous</span>
						<span class="adjacent-title">{data.prev.title}</span>
					</a>
				{:else}
					<span></span>
				{/if}
				{#if data.next}
					<a href="/blog/{data.next.slug}" class="adjacent-link adjacent-link--next">
						<span class="adjacent-label">Next</span>
						<span class="adjacent-title">{data.next.title}</span>
					</a>
				{/if}
			</nav>
		{/if}
	</div>
</article>

<style>
	.article {
		padding-block: 2rem 4rem;
	}

	.back {
		display: inline-block;
		margin-bottom: 2rem;
		color: var(--text-muted);
		font-size: 0.9rem;
		text-decoration: none;
	}

	.back:hover {
		color: var(--accent);
	}

	.header {
		margin-bottom: 2.5rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--border);
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
		color: var(--text-muted);
		font-size: 0.9rem;
	}

	.title {
		margin: 0 0 1rem;
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 5vw, 2.75rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.15;
		max-width: none;
	}

	@media (max-width: 640px) {
		.article {
			padding-block: 1.5rem 3rem;
		}

		.meta {
			flex-wrap: wrap;
		}
	}

	.adjacent {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border);
	}

	.adjacent-link {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1rem;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		text-decoration: none;
		color: inherit;
		transition: border-color 150ms ease;
	}

	.adjacent-link:hover {
		border-color: var(--accent);
	}

	.adjacent-link--next {
		text-align: right;
	}

	.adjacent-label {
		color: var(--text-muted);
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.adjacent-title {
		font-weight: 500;
	}

	@media (max-width: 640px) {
		.adjacent {
			grid-template-columns: 1fr;
		}

		.adjacent-link--next {
			text-align: left;
		}
	}
</style>
