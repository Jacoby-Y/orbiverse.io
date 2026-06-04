<script lang="ts">
	import PlaceholderCover from '$lib/components/PlaceholderCover.svelte';
	import { GAME_COVER_ASPECT, logCoverLoadError } from '$lib/gameCover';
	import type { Game } from '$lib/types';

	type Props = {
		game: Game;
	};

	let { game }: Props = $props();

	let coverFailed = $state(false);

	async function onCoverError(event: Event) {
		if (!game.cover) return;
		coverFailed = true;
		await logCoverLoadError(game, game.cover, event);
	}
</script>

{#if game.cover && !coverFailed}
	<img
		draggable="false"
		src={game.cover}
		alt="{game.title} cover art"
		class="cover"
		loading="lazy"
		decoding="async"
		onerror={onCoverError}
	/>
{:else}
	<PlaceholderCover title={game.title} aspect={GAME_COVER_ASPECT} />
{/if}

<style>
	.cover {
		width: 100%;
		aspect-ratio: 315 / 250;
		object-fit: cover;
		display: block;
	}
</style>
