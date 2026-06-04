<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import GameCard from '$lib/components/GameCard.svelte';
	import BlogCard from '$lib/components/BlogCard.svelte';
	import SubscribeLinks from '$lib/components/SubscribeLinks.svelte';

	let { data } = $props();
</script>

<div class="home">
	<div class="home-glow" aria-hidden="true"></div>

	<Hero />

<section id="games" class="section">
	<div class="container">
		<div class="section-header">
			<h2 class="section-title">Games</h2>
			<a href="/games" class="section-link">View all games →</a>
		</div>

		{#if data.featuredGames.length > 0}
			<div class="grid grid--games">
				{#each data.featuredGames as game (game.id)}
					<GameCard {game} />
				{/each}
			</div>
		{:else}
			<div class="empty-state">Games will appear here once you add them to games.json.</div>
		{/if}
	</div>
</section>

<section id="blog" class="section section--alt">
	<div class="container">
		<div class="section-header">
			<h2 class="section-title">Latest from the blog</h2>
			<a href="/blog" class="section-link">All posts →</a>
		</div>

		{#if data.latestPosts.length > 0}
			<div class="grid">
				{#each data.latestPosts as post (post.slug)}
					<BlogCard {post} />
				{/each}
			</div>
		{:else}
			<div class="empty-state">Blog posts will appear here once you add markdown files.</div>
		{/if}
	</div>
</section>

<section class="section">
	<div class="container">
		<SubscribeLinks />
	</div>
</section>
</div>

<style>
	.home {
		position: relative;
		isolation: isolate;
	}

	.home-glow {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse 130% 90% at 8% -5%,
				color-mix(in srgb, var(--accent) 11%, transparent),
				transparent 58%
			),
			radial-gradient(
				ellipse 110% 80% at 92% 8%,
				color-mix(in srgb, #9b84ff 9%, transparent),
				transparent 62%
			),
			linear-gradient(
				to bottom,
				color-mix(in srgb, var(--accent) 4%, transparent) 0%,
				color-mix(in srgb, #8b6bff 3%, transparent) 28%,
				transparent 72%
			);
	}

	.home > :not(.home-glow) {
		position: relative;
		z-index: 1;
	}

	.section--alt {
		background: color-mix(in srgb, var(--bg-elevated) 42%, transparent);
		border-block: 1px solid var(--border);
	}
</style>
