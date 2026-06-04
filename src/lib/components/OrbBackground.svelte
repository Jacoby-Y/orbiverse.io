<script lang="ts">
	import { onMount } from 'svelte';
	import { createOrbSimulation, type OrbSimulation } from '$lib/orbs/simulation';

	let { enabled = true }: { enabled?: boolean } = $props();

	let container: HTMLDivElement | undefined = $state();
	let canvas: HTMLCanvasElement | undefined = $state();
	let simulation: OrbSimulation | null = null;

	export function applyPointerForce(clientX: number, clientY: number): void {
		simulation?.applyPointerForce(clientX, clientY);
	}

	$effect(() => {
		simulation?.setEnabled(enabled);
	});

	onMount(() => {
		if (!canvas || !container) return;

		simulation = createOrbSimulation(canvas, {
			container,
			animate: enabled
		});

		const resizeObserver = new ResizeObserver(() => {
			simulation?.resize();
		});

		resizeObserver.observe(container);

		const onWindowResize = () => {
			simulation?.resize();
		};

		window.addEventListener('resize', onWindowResize, { passive: true });

		return () => {
			window.removeEventListener('resize', onWindowResize);
			resizeObserver.disconnect();
			simulation?.destroy();
			simulation = null;
		};
	});
</script>

<div class="orb-layer" class:orb-layer--hidden={!enabled} bind:this={container} aria-hidden="true">
	<canvas bind:this={canvas} class="orb-canvas"></canvas>
</div>

<style>
	.orb-layer {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.orb-layer--hidden {
		visibility: hidden;
	}

	.orb-canvas {
		display: block;
		width: 100%;
		height: 100%;
		contain: strict;
	}
</style>
