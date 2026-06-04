<script lang="ts">
	import type { BlogPost } from '$lib/types';

	type Props = {
		post: BlogPost;
	};

	let { post }: Props = $props();

	const formattedDate = $derived(
		new Date(post.date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);

	const isoDate = $derived(post.date);
</script>

<a href="/blog/{post.slug}" class="card">
	<div class="meta">
		<time datetime={isoDate}>{formattedDate}</time>
		<span class="dot" aria-hidden="true">·</span>
		<span>{post.readingTime} min read</span>
	</div>
	<h3 class="title">{post.title}</h3>
	<p class="description">{post.description}</p>
	{#if post.tags && post.tags.length > 0}
		<div class="tag-list">
			{#each post.tags as tag (tag)}
				<span class="tag">{tag}</span>
			{/each}
		</div>
	{/if}
</a>

<style>
	.card {
		display: block;
		padding: 1.5rem;
		background: var(--bg-elevated);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		text-decoration: none;
		color: inherit;
		transition:
			transform 200ms ease,
			border-color 200ms ease;
	}

	.card:hover {
		transform: translateY(-2px);
		border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
	}

	@media (hover: none) {
		.card:hover {
			transform: none;
		}
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		color: var(--text-secondary);
		font-size: 0.85rem;
	}

	.dot {
		opacity: 0.5;
	}

	.title {
		margin: 0 0 0.5rem;
		font-family: var(--font-display);
		font-size: 1.2rem;
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.description {
		margin: 0 0 1rem;
		color: var(--text-secondary);
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		background: var(--bg);
		border: 1px solid var(--border);
		color: var(--text-muted);
		font-size: 0.75rem;
	}
</style>
