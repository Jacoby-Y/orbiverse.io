import type { Bounds, Orb, RenderConfig, SimConfig } from './types';
import { getBoundsScale } from './physics';
import type { Particle, ParticleConfig } from './particles';
import { DEFAULT_PARTICLE_CONFIG } from './particles';

const MAX_CANVAS_DPR = 1.5;

export type CanvasSurface = {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	dpr: number;
};

export type OrbSprite = {
	image: CanvasImageSource;
	center: number;
	size: number;
};

export function createCanvasSurface(canvas: HTMLCanvasElement): CanvasSurface | null {
	const ctx = canvas.getContext('2d', {
		alpha: true,
		desynchronized: true
	});
	if (!ctx) return null;

	return { canvas, ctx, dpr: 1 };
}

export function resizeCanvas(surface: CanvasSurface, bounds: Bounds): void {
	const dpr = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
	surface.dpr = dpr;
	surface.canvas.width = Math.floor(bounds.width * dpr);
	surface.canvas.height = Math.floor(bounds.height * dpr);
	surface.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createSpriteCanvas(width: number, height: number): HTMLCanvasElement | OffscreenCanvas {
	if (typeof OffscreenCanvas !== 'undefined') {
		return new OffscreenCanvas(width, height);
	}

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	return canvas;
}

function orbGradient(
	ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
	orb: Orb,
	config: RenderConfig
): CanvasGradient {
	const gradient = ctx.createRadialGradient(
		orb.x - orb.radius * 0.25,
		orb.y - orb.radius * 0.25,
		orb.radius * 0.05,
		orb.x,
		orb.y,
		orb.radius
	);

	const core = `hsla(${orb.hue}, ${config.saturation}%, ${Math.min(config.lightness + 16, 92)}%, ${config.innerHighlight})`;
	const body = `hsla(${orb.hue}, ${config.saturation}%, ${config.lightness}%, ${config.opacity})`;
	const edge = `hsla(${orb.hue}, ${config.saturation}%, ${config.lightness - 4}%, ${config.opacity * 0.15})`;

	gradient.addColorStop(0, core);
	gradient.addColorStop(0.5, body);
	gradient.addColorStop(1, edge);

	return gradient;
}

function drawOrbToContext(
	ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
	orb: Orb,
	center: number,
	config: RenderConfig,
	glowBlur: number
): void {
	ctx.shadowColor = `hsla(${orb.hue}, ${config.saturation}%, ${config.lightness}%, 0.52)`;
	ctx.shadowBlur = glowBlur;
	ctx.fillStyle = orbGradient(ctx, { ...orb, x: center, y: center }, config);
	ctx.beginPath();
	ctx.arc(center, center, orb.radius, 0, Math.PI * 2);
	ctx.fill();
	ctx.shadowBlur = 0;
}

export function buildOrbSprites(
	surface: CanvasSurface,
	orbs: Orb[],
	bounds: Bounds,
	config: RenderConfig,
	simConfig: SimConfig
): OrbSprite[] {
	const boundsScale = getBoundsScale(bounds, simConfig);
	const glowBlur = config.glowBlur * boundsScale;
	const padding = Math.ceil(glowBlur * 2 + 8);

	return orbs.map((orb) => {
		const size = Math.ceil((orb.radius + padding) * 2);
		const center = size / 2;
		const pixelSize = Math.ceil(size * surface.dpr);
		const spriteCanvas = createSpriteCanvas(pixelSize, pixelSize);
		const spriteCtx =
			spriteCanvas instanceof OffscreenCanvas
				? spriteCanvas.getContext('2d')
				: spriteCanvas.getContext('2d');

		if (!spriteCtx) {
			return { image: spriteCanvas, center, size };
		}

		spriteCtx.setTransform(surface.dpr, 0, 0, surface.dpr, 0, 0);
		drawOrbToContext(spriteCtx, orb, center, config, glowBlur);

		return { image: spriteCanvas, center, size };
	});
}

export function clearCanvas(surface: CanvasSurface, bounds: Bounds): void {
	const { ctx } = surface;
	ctx.globalCompositeOperation = 'copy';
	ctx.clearRect(0, 0, bounds.width, bounds.height);
	ctx.globalCompositeOperation = 'source-over';
}

export function drawOrbSprites(surface: CanvasSurface, orbs: Orb[], sprites: OrbSprite[]): void {
	const { ctx } = surface;

	for (let i = 0; i < orbs.length; i++) {
		const orb = orbs[i];
		const sprite = sprites[i];
		if (!sprite) continue;

		ctx.drawImage(
			sprite.image,
			orb.x - sprite.center,
			orb.y - sprite.center,
			sprite.size,
			sprite.size
		);
	}
}

export function drawOrbs(
	surface: CanvasSurface,
	orbs: Orb[],
	bounds: Bounds,
	config: RenderConfig,
	simConfig: SimConfig
): void {
	const sprites = buildOrbSprites(surface, orbs, bounds, config, simConfig);
	drawOrbSprites(surface, orbs, sprites);
}

export function drawParticles(
	surface: CanvasSurface,
	particles: Particle[],
	config: ParticleConfig = DEFAULT_PARTICLE_CONFIG
): void {
	const { ctx } = surface;

	for (const particle of particles) {
		const t = particle.life / particle.maxLife;
		const alpha = t * t * 0.55;

		ctx.fillStyle = `hsla(${particle.hue}, ${config.saturation}%, ${config.lightness}%, ${alpha})`;
		ctx.beginPath();
		ctx.arc(particle.x, particle.y, particle.radius * (0.6 + t * 0.4), 0, Math.PI * 2);
		ctx.fill();
	}
}

export function drawScene(
	surface: CanvasSurface,
	orbs: Orb[],
	sprites: OrbSprite[],
	particles: Particle[],
	bounds: Bounds,
	particleConfig: ParticleConfig = DEFAULT_PARTICLE_CONFIG
): void {
	clearCanvas(surface, bounds);
	drawOrbSprites(surface, orbs, sprites);
	drawParticles(surface, particles, particleConfig);
}

export function drawStaticOrbs(
	surface: CanvasSurface,
	orbs: Orb[],
	sprites: OrbSprite[],
	bounds: Bounds
): void {
	clearCanvas(surface, bounds);
	drawOrbSprites(surface, orbs, sprites);
}
