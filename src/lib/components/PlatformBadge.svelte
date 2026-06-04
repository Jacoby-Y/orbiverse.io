<script lang="ts">
	import type { PlatformLink } from '$lib/types';

	type Props = {
		platform: PlatformLink;
		variant: 'itch' | 'steam';
	};

	let { platform, variant }: Props = $props();
</script>

{#if platform.url}
	<a
		href={platform.url}
		class="meta-tag badge badge--{variant}"
		target="_blank"
		rel="noopener noreferrer"
		onclick={(e) => e.stopPropagation()}
	>
		{platform.label}
	</a>
{/if}

<style>
	.badge {
		text-decoration: none;
		transition:
			border-color 150ms ease,
			color 150ms ease,
			background 150ms ease;
	}

	.badge--itch {
		color: #ff9a9a;
		border-color: color-mix(in srgb, #fa5c5c 52%, var(--border));
		background: color-mix(in srgb, #fa5c5c 16%, var(--bg));
	}

	.badge--itch:hover {
		color: #ffb8b8;
		border-color: #fa5c5c;
		background: color-mix(in srgb, #fa5c5c 22%, var(--bg));
	}

	.badge--steam {
		color: #9bd8ff;
		border-color: color-mix(in srgb, #66c0f4 52%, var(--border));
		background: color-mix(in srgb, #66c0f4 16%, var(--bg));
	}

	.badge--steam:hover {
		color: #b8e8ff;
		border-color: #66c0f4;
		background: color-mix(in srgb, #66c0f4 22%, var(--bg));
	}
</style>
