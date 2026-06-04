<script lang="ts">
	import BlogCard from '$lib/components/BlogCard.svelte';
	import SubscribeLinks from '$lib/components/SubscribeLinks.svelte';

	let { data } = $props();
</script>

<div class="page-header">
	<div class="container">
		<h1 class="page-title">Blog</h1>
		<p class="page-subtitle">Devlogs, announcements, and notes from the studio.</p>
	</div>
</div>

<section class="section">
	<div class="container">
		<SubscribeLinks compact />

		{#if data.posts.length > 0}
			<div class="grid">
				{#each data.posts as post (post.slug)}
					<BlogCard {post} />
				{/each}
			</div>
		{:else}
			<div class="empty-state">
				Add markdown files to <code>src/content/blog/</code> to publish your first post.
			</div>
		{/if}
	</div>
</section>
