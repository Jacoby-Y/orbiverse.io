<script lang="ts">
	import type { GameFormat } from '$lib/types';

	type Props = {
		format: GameFormat;
	};

	let { format }: Props = $props();

	const labels: Record<GameFormat, string> = {
		web: 'Web',
		desktop: 'Desktop'
	};
</script>

<span class="meta-tag format-tag format-tag--{format}" aria-label={labels[format]}>{labels[format]}</span>

<style>
	.format-tag--web {
		color: #f5b4d0;
		border-color: color-mix(in srgb, #f472b6 48%, var(--border));
		background: color-mix(in srgb, #f472b6 14%, var(--bg));
	}

	.format-tag--desktop {
		color: #9bd8ff;
		border-color: color-mix(in srgb, #66c0f4 48%, var(--border));
		background: color-mix(in srgb, #66c0f4 14%, var(--bg));
	}
</style>
