import type { Game } from '$lib/types';

/** Itch.io cover thumbnail ratio (315×250). */
export const GAME_COVER_ASPECT = '315 / 250';

export async function logCoverLoadError(game: Game, src: string, event: Event): Promise<void> {
	const img = event.target as HTMLImageElement;

	console.warn('[GameCard] Cover failed to load', {
		gameId: game.id,
		title: game.title,
		src,
		reason: 'Image onerror event (browser could not decode or fetch the resource)',
		currentSrc: img.currentSrc || img.src,
		complete: img.complete,
		naturalWidth: img.naturalWidth,
		naturalHeight: img.naturalHeight
	});

	try {
		const response = await fetch(src, { method: 'HEAD', mode: 'cors' });

		console.warn('[GameCard] Cover fetch diagnostic', {
			gameId: game.id,
			title: game.title,
			src,
			httpStatus: response.status,
			statusText: response.statusText,
			contentType: response.headers.get('content-type'),
			reason: response.ok
				? 'HTTP OK — image URL responds but <img> failed (wrong type, corrupt data, or hotlink restriction)'
				: `HTTP ${response.status} ${response.statusText}`
		});
	} catch (error) {
		console.warn('[GameCard] Cover fetch diagnostic', {
			gameId: game.id,
			title: game.title,
			src,
			reason:
				error instanceof Error
					? `${error.name}: ${error.message} (likely CORS, network, or blocked request)`
					: 'Unknown fetch error'
		});
	}
}
