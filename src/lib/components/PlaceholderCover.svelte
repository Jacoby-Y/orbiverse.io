<script lang="ts">
	type Props = {
		title?: string;
		aspect?: string;
	};

	let { title = '', aspect = '315 / 250' }: Props = $props();
</script>

<div class="placeholder" style:aspect-ratio={aspect} aria-hidden="true">
	<span class="initial">{title.charAt(0) || '?'}</span>
</div>

<style>
	.placeholder {
		display: grid;
		place-items: center;
		width: 100%;
		background: linear-gradient(
			135deg,
			var(--bg-elevated) 0%,
			color-mix(in srgb, var(--accent) 12%, var(--bg-elevated)) 100%
		);
		border-bottom: 1px solid var(--border);
	}

	.initial {
		font-family: var(--font-display);
		font-size: 2.5rem;
		font-weight: 700;
		color: color-mix(in srgb, var(--accent) 40%, var(--text-muted));
	}
</style>
