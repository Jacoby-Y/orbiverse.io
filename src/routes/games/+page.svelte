<script lang="ts">
	import GameCard from '$lib/components/GameCard.svelte';
	import { getAllGames } from '$lib/games';

	const games = getAllGames();
</script>

<div class="page-header">
	<div class="container">
		<h1 class="page-title">Games</h1>
		<p class="page-subtitle">Explore our catalog. More titles coming to Steam soon.</p>
	</div>
</div>

<section class="section">
	<div class="container">
		{#if games.length > 0}
			<div class="grid grid--games">
				{#each games as game (game.id)}
					<GameCard {game} />
				{/each}
			</div>
		{:else}
			<div class="empty-state">
				Add your games to <code>src/lib/data/games.json</code> to populate this page.
			</div>
		{/if}
	</div>
</section>
