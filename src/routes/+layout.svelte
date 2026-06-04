<script lang="ts">
	import '$lib/styles/theme.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';

	let { children } = $props();
</script>

<SeoHead />

<div class="app">
	<Header />
	<main>{@render children()}</main>
	<Footer />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
	}
</style>
