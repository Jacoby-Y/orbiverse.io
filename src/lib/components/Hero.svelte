<script lang="ts">
	import { onMount } from 'svelte';
	import site from '$lib/data/site.json';
	import OrbBackground from '$lib/components/OrbBackground.svelte';
	import type { SiteConfig } from '$lib/types';

	const config = site as SiteConfig;
	const ORBS_STORAGE_KEY = 'orbiverse:orbs-enabled';

	let orbBackground: OrbBackground | undefined = $state();
	let orbsEnabled = $state(false);
	let orbsReady = $state(false);

	onMount(() => {
		const stored = localStorage.getItem(ORBS_STORAGE_KEY);
		if (stored !== null) {
			orbsEnabled = stored === 'true';
		} else {
			orbsEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
		orbsReady = true;
	});

	function handleOrbsToggle(event: Event): void {
		const input = event.currentTarget as HTMLInputElement;
		orbsEnabled = input.checked;
		localStorage.setItem(ORBS_STORAGE_KEY, String(orbsEnabled));
	}

	function handleHeroPointerDown(event: PointerEvent): void {
		if (!orbsEnabled) return;

		const target = event.target as HTMLElement;
		if (target.closest('a, button, label')) return;
		orbBackground?.applyPointerForce(event.clientX, event.clientY);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section class="hero" onpointerdown={handleHeroPointerDown}>
	{#if orbsReady}
		<OrbBackground bind:this={orbBackground} enabled={orbsEnabled} />
	{/if}
	<div class="hero-vignette" aria-hidden="true"></div>
	<label class="orb-toggle">
		<input
			type="checkbox"
			class="orb-toggle__input"
			checked={orbsEnabled}
			disabled={!orbsReady}
			onchange={handleOrbsToggle}
		/>
		<span class="orb-toggle__track" aria-hidden="true">
			<span class="orb-toggle__thumb"></span>
		</span>
		<span class="orb-toggle__label">Toggle Orbs</span>
	</label>
	<div class="container hero-inner">
		<div class="hero-content">
			<h1 class="wordmark">
				<img
					draggable="false"
					src="/full-logo.png"
					alt={config.name}
					class="splash-logo"
					width="480"
					height="120"
					decoding="async"
					fetchpriority="high"
				/>
			</h1>
			<p class="tagline">{config.tagline}</p>
			<div class="actions">
				<a href="#games" class="btn btn--primary btn--stack-mobile">View games</a>
				<a href="#blog" class="btn btn--ghost btn--stack-mobile">Read the blog</a>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - var(--header-height));
		min-height: calc(100dvh - var(--header-height));
		height: calc(100dvh - var(--header-height));
		padding-block: max(1.5rem, env(safe-area-inset-top, 0px))
			max(1.5rem, env(safe-area-inset-bottom, 0px));
		overflow: hidden;
		user-select: none;
	}

	.hero-vignette {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse 85% 70% at 50% 45%,
				transparent 35%,
				color-mix(in srgb, var(--bg) 38%, transparent) 100%
			),
			linear-gradient(to bottom, transparent 75%, color-mix(in srgb, var(--bg) 28%, transparent));
	}

	.orb-toggle {
		position: absolute;
		top: max(1rem, env(safe-area-inset-top, 0px));
		right: var(--page-gutter-right);
		z-index: 3;
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.45rem 0.7rem 0.45rem 0.55rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg-elevated) 72%, transparent);
		color: var(--text-secondary);
		font-size: 0.8125rem;
		line-height: 1;
		cursor: pointer;
		backdrop-filter: blur(8px);
		user-select: none;
		transition:
			border-color 150ms ease,
			color 150ms ease,
			background 150ms ease;
	}

	.orb-toggle:hover {
		border-color: var(--accent);
		color: var(--text);
	}

	.orb-toggle:has(.orb-toggle__input:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.orb-toggle__input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
		margin: 0;
		pointer-events: none;
	}

	.orb-toggle__track {
		position: relative;
		flex-shrink: 0;
		width: 2rem;
		height: 1.125rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg) 55%, var(--border));
		transition: background 150ms ease;
	}

	.orb-toggle__thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: calc(1.125rem - 4px);
		height: calc(1.125rem - 4px);
		border-radius: 50%;
		background: var(--text-muted);
		transition:
			transform 150ms ease,
			background 150ms ease;
	}

	.orb-toggle__input:checked + .orb-toggle__track {
		background: color-mix(in srgb, var(--accent) 35%, var(--bg-elevated));
	}

	.orb-toggle__input:checked + .orb-toggle__track .orb-toggle__thumb {
		transform: translateX(0.875rem);
		background: var(--accent);
	}

	.orb-toggle__label {
		white-space: nowrap;
	}

	.hero-inner {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		padding-left: 17vw;
	}

	.wordmark {
		margin: 0 0 1.25rem;
		line-height: 0;
	}

	.splash-logo {
		width: min(100%, 420px);
		height: auto;
	}

	.tagline {
		margin: 0 0 2rem;
		color: var(--text-secondary);
		font-size: clamp(1rem, 2.5vw, 1.35rem);
		line-height: 1.5;
		max-width: 36ch;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	@media (max-width: 640px) {
		.hero {
			padding-inline: 0;
		}

		.orb-toggle {
			top: max(0.75rem, env(safe-area-inset-top, 0px));
			font-size: 0.75rem;
			padding: 0.4rem 0.6rem 0.4rem 0.5rem;
		}

		.hero-content {
			align-items: center;
			text-align: center;
			padding-left: 0;
		}

		.wordmark {
			margin-bottom: 1rem;
			width: 100%;
		}

		.splash-logo {
			width: min(88vw, 340px);
			margin-inline: auto;
		}

		.tagline {
			margin-bottom: 1.75rem;
			font-size: 1.05rem;
			max-width: 28ch;
		}

		.actions {
			flex-direction: column;
			width: 100%;
			max-width: 20rem;
		}
	}
</style>
