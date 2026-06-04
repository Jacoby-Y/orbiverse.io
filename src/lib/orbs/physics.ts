import type { Bounds, Orb, SimConfig } from './types';

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function randomBetween(min: number, max: number): number {
	return min + Math.random() * (max - min);
}

function randomSign(): number {
	return Math.random() > 0.5 ? 1 : -1;
}

function orbMass(orb: Orb): number {
	return orb.radius * orb.radius;
}

export function getBoundsScale(bounds: Bounds, config: SimConfig): number {
	const minDim = Math.min(bounds.width, bounds.height);
	return clamp(minDim / config.boundsReference, config.minBoundsScale, config.maxBoundsScale);
}

function scaledRadiusRange(bounds: Bounds, config: SimConfig): { min: number; max: number } {
	const scale = getBoundsScale(bounds, config);
	return {
		min: config.minRadius * scale,
		max: config.maxRadius * scale
	};
}

export function createOrbs(bounds: Bounds, config: SimConfig): Orb[] {
	const orbs: Orb[] = [];
	const hueStep = 360 / config.orbCount;
	const { min: minR, max: maxR } = scaledRadiusRange(bounds, config);

	for (let i = 0; i < config.orbCount; i++) {
		const radius = randomBetween(minR, maxR);
		const margin = radius + 8;

		orbs.push({
			x: randomBetween(margin, Math.max(margin, bounds.width - margin)),
			y: randomBetween(margin, Math.max(margin, bounds.height - margin)),
			vx: randomSign() * randomBetween(config.minSpeed, config.velocityRange),
			vy: randomSign() * randomBetween(config.minSpeed, config.velocityRange),
			ax: 0,
			ay: 0,
			radius,
			hue: i * hueStep
		});
	}

	return orbs;
}

export function applyPointerRepulsion(
	orbs: Orb[],
	pointer: { x: number; y: number },
	config: SimConfig
): void {
	if (orbs.length === 0) return;

	let totalMass = 0;
	for (const orb of orbs) {
		totalMass += orbMass(orb);
	}
	const referenceMass = totalMass / orbs.length;

	for (const orb of orbs) {
		const dx = orb.x - pointer.x;
		const dy = orb.y - pointer.y;
		const distSq = dx * dx + dy * dy;
		const influence = config.pointerFalloff * config.pointerFalloff;
		const t = influence / (distSq + influence);
		const force = config.pointerForce * t * t;

		if (force <= 0) continue;

		const dist = Math.sqrt(distSq) || 1;
		const massScale = referenceMass / orbMass(orb);
		orb.ax += (dx / dist) * force * massScale;
		orb.ay += (dy / dist) * force * massScale;
	}
}

function resolveWallCollisions(orb: Orb, bounds: Bounds, restitution: number): void {
	if (orb.x - orb.radius < 0) {
		orb.x = orb.radius;
		orb.vx = Math.abs(orb.vx) * restitution;
	} else if (orb.x + orb.radius > bounds.width) {
		orb.x = bounds.width - orb.radius;
		orb.vx = -Math.abs(orb.vx) * restitution;
	}

	if (orb.y - orb.radius < 0) {
		orb.y = orb.radius;
		orb.vy = Math.abs(orb.vy) * restitution;
	} else if (orb.y + orb.radius > bounds.height) {
		orb.y = bounds.height - orb.radius;
		orb.vy = -Math.abs(orb.vy) * restitution;
	}
}

function resolveOrbCollisions(orbs: Orb[], separationStrength: number): void {
	for (let i = 0; i < orbs.length; i++) {
		for (let j = i + 1; j < orbs.length; j++) {
			const a = orbs[i];
			const b = orbs[j];
			const dx = b.x - a.x;
			const dy = b.y - a.y;
			const dist = Math.hypot(dx, dy) || 0.001;
			const minDist = a.radius + b.radius;
			const overlap = minDist - dist;

			if (overlap <= 0) continue;

			const nx = dx / dist;
			const ny = dy / dist;
			const massA = orbMass(a);
			const massB = orbMass(b);
			const totalMass = massA + massB;
			const push = overlap * separationStrength;

			a.vx -= nx * push * (massB / totalMass);
			a.vy -= ny * push * (massB / totalMass);
			b.vx += nx * push * (massA / totalMass);
			b.vy += ny * push * (massA / totalMass);
		}
	}
}

export function stepPhysics(orbs: Orb[], bounds: Bounds, config: SimConfig): void {
	for (const orb of orbs) {
		orb.vx += orb.ax;
		orb.vy += orb.ay;
		orb.ax *= config.accelerationDecay;
		orb.ay *= config.accelerationDecay;

		const speed = Math.hypot(orb.vx, orb.vy);
		if (speed > config.maxSpeed) {
			const scale = config.maxSpeed / speed;
			orb.vx *= scale;
			orb.vy *= scale;
		}

		orb.vx *= config.damping;
		orb.vy *= config.damping;

		const dampedSpeed = Math.hypot(orb.vx, orb.vy);
		if (dampedSpeed > 0 && dampedSpeed < config.minSpeed) {
			const boost = config.minSpeed / dampedSpeed;
			orb.vx *= boost;
			orb.vy *= boost;
		} else if (dampedSpeed === 0) {
			const angle = Math.random() * Math.PI * 2;
			orb.vx = Math.cos(angle) * config.minSpeed;
			orb.vy = Math.sin(angle) * config.minSpeed;
		}

		orb.x += orb.vx;
		orb.y += orb.vy;

		resolveWallCollisions(orb, bounds, config.restitution);
	}

	resolveOrbCollisions(orbs, config.separationStrength);
}

export function fitOrbsToBounds(orbs: Orb[], bounds: Bounds): void {
	for (const orb of orbs) {
		orb.x = clamp(orb.x, orb.radius, Math.max(orb.radius, bounds.width - orb.radius));
		orb.y = clamp(orb.y, orb.radius, Math.max(orb.radius, bounds.height - orb.radius));
	}
}

export function scaleOrbsToBounds(
	orbs: Orb[],
	from: Bounds,
	to: Bounds,
	config: SimConfig
): void {
	if (from.width <= 0 || from.height <= 0) {
		fitOrbsToBounds(orbs, to);
		return;
	}

	const scaleX = to.width / from.width;
	const scaleY = to.height / from.height;
	const uniformScale = Math.min(scaleX, scaleY);
	const { min: minR, max: maxR } = scaledRadiusRange(to, config);

	for (const orb of orbs) {
		orb.x *= scaleX;
		orb.y *= scaleY;
		orb.radius = clamp(orb.radius * uniformScale, minR, maxR);
	}

	fitOrbsToBounds(orbs, to);
}

