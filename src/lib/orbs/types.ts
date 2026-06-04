export type Vec2 = {
	x: number;
	y: number;
};

export type Orb = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	ax: number;
	ay: number;
	radius: number;
	hue: number;
};

export type Bounds = {
	width: number;
	height: number;
};

export type SimConfig = {
	orbCount: number;
	minRadius: number;
	maxRadius: number;
	velocityRange: number;
	minSpeed: number;
	damping: number;
	accelerationDecay: number;
	restitution: number;
	maxSpeed: number;
	pointerForce: number;
	pointerFalloff: number;
	separationStrength: number;
	boundsReference: number;
	minBoundsScale: number;
	maxBoundsScale: number;
};

export const DEFAULT_SIM_CONFIG: SimConfig = {
	orbCount: 6,
	minRadius: 28,
	maxRadius: 52,
	velocityRange: 1.65,
	minSpeed: 0.75,
	damping: 0.999,
	accelerationDecay: 0.88,
	restitution: 0.92,
	maxSpeed: 6.6,
	pointerForce: 14,
	pointerFalloff: 140,
	separationStrength: 0.04,
	boundsReference: 680,
	minBoundsScale: 0.32,
	maxBoundsScale: 1
};

export type RenderConfig = {
	opacity: number;
	glowBlur: number;
	saturation: number;
	lightness: number;
	innerHighlight: number;
};

export const DEFAULT_RENDER_CONFIG: RenderConfig = {
	opacity: 0.62,
	glowBlur: 34,
	saturation: 74,
	lightness: 68,
	innerHighlight: 0.58
};
