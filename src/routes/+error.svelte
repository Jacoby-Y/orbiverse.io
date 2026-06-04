<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="error-page">
	<div class="container">
		<p class="status">{page.status}</p>
		<h1>{page.status === 404 ? 'Page not found' : 'Something went wrong'}</h1>
		<p class="message">
			{page.error?.message ?? 'The page you are looking for does not exist.'}
		</p>
		<a href="/" class="btn btn--primary">Back to home</a>
	</div>
</div>

<style>
	.error-page {
		padding-block: 4rem 6rem;
		text-align: center;
	}

	.status {
		margin: 0 0 0.5rem;
		color: var(--accent);
		font-family: var(--font-display);
		font-size: clamp(3rem, 12vw, 5rem);
		font-weight: 700;
		line-height: 1;
	}

	h1 {
		margin: 0 0 1rem;
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 5vw, 2rem);
	}

	.message {
		margin: 0 0 2rem;
		color: var(--text-secondary);
		max-width: 40ch;
		margin-inline: auto;
	}
</style>
