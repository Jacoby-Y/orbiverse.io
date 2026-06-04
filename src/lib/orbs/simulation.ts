import { applyPointerRepulsion, createOrbs, fitOrbsToBounds, scaleOrbsToBounds, stepPhysics } from './physics';
import {
	DEFAULT_PARTICLE_CONFIG,
	spawnClickParticles,
	stepParticles,
	type Particle,
	type ParticleConfig
} from './particles';
import {
	buildOrbSprites,
	clearCanvas,
	createCanvasSurface,
	drawScene,
	resizeCanvas,
	type CanvasSurface,
	type OrbSprite
} from './renderer';
import {
	DEFAULT_RENDER_CONFIG,
	DEFAULT_SIM_CONFIG,
	type Bounds,
	type Orb,
	type RenderConfig,
	type SimConfig
} from './types';

export type OrbSimulationOptions = {
	container?: HTMLElement;
	config?: Partial<SimConfig>;
	render?: Partial<RenderConfig>;
	particles?: Partial<ParticleConfig>;
	animate?: boolean;
};

export type OrbSimulation = {
	applyPointerForce(clientX: number, clientY: number): void;
	setEnabled(enabled: boolean): void;
	resize(): void;
	destroy(): void;
};

export function createOrbSimulation(
	canvas: HTMLCanvasElement,
	options: OrbSimulationOptions = {}
): OrbSimulation | null {
	const config: SimConfig = { ...DEFAULT_SIM_CONFIG, ...options.config };
	const renderConfig: RenderConfig = { ...DEFAULT_RENDER_CONFIG, ...options.render };
	const particleConfig: ParticleConfig = { ...DEFAULT_PARTICLE_CONFIG, ...options.particles };
	const animate = options.animate ?? true;

	const surface = createCanvasSurface(canvas);
	if (!surface) return null;

	let bounds: Bounds = { width: 0, height: 0 };
	let orbs: Orb[] = [];
	let orbSprites: OrbSprite[] = [];
	let particles: Particle[] = [];
	let frameId = 0;
	let running = animate;
	let destroyed = false;

	const rebuildSprites = () => {
		orbSprites = buildOrbSprites(surface, orbs, bounds, renderConfig, config);
	};

	const measureBounds = (): Bounds => {
		const element = options.container ?? canvas.parentElement ?? canvas;
		const rect = element.getBoundingClientRect();
		return {
			width: Math.max(rect.width, 1),
			height: Math.max(rect.height, 1)
		};
	};

	const resize = () => {
		const nextBounds = measureBounds();
		const prevBounds = bounds;

		bounds = nextBounds;
		resizeCanvas(surface, bounds);

		if (orbs.length === 0) {
			orbs = createOrbs(bounds, config);
			rebuildSprites();
		} else if (
			prevBounds.width !== bounds.width ||
			prevBounds.height !== bounds.height
		) {
			scaleOrbsToBounds(orbs, prevBounds, bounds, config);
			rebuildSprites();
		} else {
			fitOrbsToBounds(orbs, bounds);
		}

		if (!running) {
			clearCanvas(surface, bounds);
		} else {
			drawScene(surface, orbs, orbSprites, particles, bounds, particleConfig);
		}
	};

	const tick = () => {
		if (!running) return;

		stepPhysics(orbs, bounds, config);
		particles = stepParticles(particles, particleConfig);
		drawScene(surface, orbs, orbSprites, particles, bounds, particleConfig);
		frameId = requestAnimationFrame(tick);
	};

	const toLocalPoint = (clientX: number, clientY: number) => {
		const rect = canvas.getBoundingClientRect();
		return {
			x: clientX - rect.left,
			y: clientY - rect.top
		};
	};

	const applyPointerForce = (clientX: number, clientY: number) => {
		if (!running) return;
		const point = toLocalPoint(clientX, clientY);
		applyPointerRepulsion(orbs, point, config);
		particles.push(...spawnClickParticles(point, particleConfig));
	};

	const onVisibilityChange = () => {
		if (document.hidden) {
			cancelAnimationFrame(frameId);
			frameId = 0;
			return;
		}

		if (running && !frameId) {
			frameId = requestAnimationFrame(tick);
		}
	};

	const startAnimation = () => {
		if (destroyed || frameId) return;

		frameId = requestAnimationFrame(tick);
		document.addEventListener('visibilitychange', onVisibilityChange);
	};

	const stopAnimation = () => {
		cancelAnimationFrame(frameId);
		frameId = 0;
		document.removeEventListener('visibilitychange', onVisibilityChange);
		particles = [];
		clearCanvas(surface, bounds);
	};

	const setEnabled = (enabled: boolean) => {
		if (destroyed || enabled === running) return;

		running = enabled;

		if (enabled) {
			resize();
			startAnimation();
			return;
		}

		stopAnimation();
	};

	resize();

	if (running) {
		startAnimation();
	} else {
		clearCanvas(surface, bounds);
	}

	return {
		applyPointerForce,
		setEnabled,
		resize,
		destroy() {
			destroyed = true;
			running = false;
			stopAnimation();
		}
	};
}
