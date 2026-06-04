import type { Vec2 } from './types';

export type Particle = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	life: number;
	maxLife: number;
	radius: number;
	hue: number;
};

export type ParticleConfig = {
	count: number;
	speedMin: number;
	speedMax: number;
	radiusMin: number;
	radiusMax: number;
	lifeMin: number;
	lifeMax: number;
	drag: number;
	hue: number;
	hueVariance: number;
	saturation: number;
	lightness: number;
};

export const DEFAULT_PARTICLE_CONFIG: ParticleConfig = {
	count: 12,
	speedMin: 1.2,
	speedMax: 3.2,
	radiusMin: 1.2,
	radiusMax: 2.8,
	lifeMin: 28,
	lifeMax: 48,
	drag: 0.94,
	hue: 168,
	hueVariance: 18,
	saturation: 55,
	lightness: 72
};

function randomBetween(min: number, max: number): number {
	return min + Math.random() * (max - min);
}

export function spawnClickParticles(
	point: Vec2,
	config: ParticleConfig = DEFAULT_PARTICLE_CONFIG
): Particle[] {
	const particles: Particle[] = [];

	for (let i = 0; i < config.count; i++) {
		const angle = randomBetween(0, Math.PI * 2);
		const speed = randomBetween(config.speedMin, config.speedMax);
		const maxLife = Math.round(randomBetween(config.lifeMin, config.lifeMax));

		particles.push({
			x: point.x,
			y: point.y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			life: maxLife,
			maxLife,
			radius: randomBetween(config.radiusMin, config.radiusMax),
			hue: config.hue + randomBetween(-config.hueVariance, config.hueVariance)
		});
	}

	return particles;
}

export function stepParticles(particles: Particle[], config: ParticleConfig): Particle[] {
	const next: Particle[] = [];

	for (const particle of particles) {
		particle.life -= 1;
		if (particle.life <= 0) continue;

		particle.x += particle.vx;
		particle.y += particle.vy;
		particle.vx *= config.drag;
		particle.vy *= config.drag;

		next.push(particle);
	}

	return next;
}
