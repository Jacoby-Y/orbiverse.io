<script lang="ts">
	import GameCover from '$lib/components/GameCover.svelte';
	import GameFormatTag from '$lib/components/GameFormatTag.svelte';
	import PlatformBadge from '$lib/components/PlatformBadge.svelte';
	import { formatGamePrice, getCardPlatformVariant, getGameFormats, getPrimaryPlatformUrl } from '$lib/games';
	import type { Game } from '$lib/types';

	type Props = {
		game: Game;
	};

	let { game }: Props = $props();

	const primaryUrl = $derived(getPrimaryPlatformUrl(game));
	const platformVariant = $derived(getCardPlatformVariant(game));
	const formats = $derived(getGameFormats(game));
	const priceLabel = $derived(game.price != null ? formatGamePrice(game.price) : null);
	const hasStoreBadges = $derived(
		Boolean(game.platforms.itch.url || game.platforms.steam.url)
	);
</script>

{#snippet cardBody()}
	<GameCover {game} />
	<div class="body">
		<h3 class="title">{game.title}</h3>
		<p class="tagline">{game.tagline}</p>
		<div class="meta-row">
			<div class="meta-group meta-group--availability">
				{#if priceLabel}
					<span class="meta-tag price-tag" aria-label="Price {priceLabel}">{priceLabel}</span>
				{/if}
				<div class="format-tags" aria-label="Available formats">
					{#each formats as format (format)}
						<GameFormatTag {format} />
					{/each}
				</div>
			</div>
			{#if hasStoreBadges}
				<div class="meta-group meta-group--stores">
					<PlatformBadge platform={game.platforms.itch} variant="itch" />
					<PlatformBadge platform={game.platforms.steam} variant="steam" />
				</div>
			{/if}
		</div>
	</div>
{/snippet}

{#if primaryUrl}
	<a
		href={primaryUrl}
		class="card card--{platformVariant}"
		target="_blank"
		rel="noopener noreferrer"
	>
		{@render cardBody()}
	</a>
{:else}
	<article class="card card--static card--{platformVariant}">
		{@render cardBody()}
	</article>
{/if}

<style>
	.card {
		display: flex;
		flex-direction: column;
		background: var(--bg-elevated);
		border: 2px solid var(--border);
		border-radius: var(--radius);
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition:
			transform 200ms ease,
			border-color 200ms ease,
			box-shadow 200ms ease;
	}

	.card--itch {
		border-color: color-mix(in srgb, #fa5c5c 28%, var(--border));
	}

	.card--steam {
		border-color: color-mix(in srgb, #66c0f4 32%, var(--border));
	}

	.card--itch:hover {
		border-color: color-mix(in srgb, #fa5c5c 50%, var(--border));
		box-shadow: 0 10px 28px color-mix(in srgb, #fa5c5c 8%, transparent);
	}

	.card--steam:hover {
		border-color: color-mix(in srgb, #66c0f4 55%, var(--border));
		box-shadow: 0 10px 28px color-mix(in srgb, #66c0f4 10%, transparent);
	}

	.card--none:hover {
		border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
		box-shadow: 0 12px 32px color-mix(in srgb, var(--bg) 60%, transparent);
	}

	.card:hover {
		transform: translateY(-3px);
	}

	@media (hover: none) {
		.card:hover {
			transform: none;
			box-shadow: none;
		}
	}

	.card--static {
		cursor: default;
	}

	.body {
		padding: 0.65rem 0.85rem 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.title {
		margin: 0;
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.25;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		overflow: hidden;
	}

	.tagline {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.78rem;
		line-height: 1.35;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	}

	.meta-row {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.35rem;
		min-height: 1.625rem;
	}

	.meta-group {
		display: inline-flex;
		flex-wrap: nowrap;
		align-items: center;
		gap: 0.3rem;
		min-width: 0;
	}

	.meta-group--availability {
		flex-shrink: 0;
	}

	.meta-group--stores {
		flex: 1 1 auto;
		justify-content: flex-end;
	}

	.price-tag {
		font-weight: 600;
		letter-spacing: 0.01em;
		color: #ffe8a3;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, #c9a227 42%, var(--bg-elevated)),
			color-mix(in srgb, #8a6d1d 55%, var(--bg-elevated))
		);
		border-color: color-mix(in srgb, #e4c76b 45%, var(--border));
		box-shadow: inset 0 1px 0 color-mix(in srgb, #fff 10%, transparent);
	}

	.format-tags {
		display: inline-flex;
		flex-wrap: nowrap;
		align-items: center;
		gap: 0.3rem;
	}
</style>
