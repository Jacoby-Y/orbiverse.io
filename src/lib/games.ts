import gamesData from '$lib/data/games.json';
import type { Game, GameDevice, GameFormat } from '$lib/types';

const games = gamesData.games as Game[];

export function getAllGames(): Game[] {
	return games;
}

export function getFeaturedGames(limit = 3): Game[] {
	const featured = games.filter((game) => game.featured);
	if (featured.length > 0) return featured.slice(0, limit);
	return games.slice(0, limit);
}

export function getGameDevices(game: Game): GameDevice[] {
	return game.devices?.length ? game.devices : ['browser'];
}

export function getGameFormats(game: Game): GameFormat[] {
	const devices = getGameDevices(game);
	const formats: GameFormat[] = [];

	if (devices.includes('browser')) {
		formats.push('web');
	}

	if (devices.some((device) => device === 'windows' || device === 'linux')) {
		formats.push('desktop');
	}

	return formats;
}

export function formatGamePrice(price: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(price);
}

export function getPrimaryPlatformUrl(game: Game): string | null {
	return game.platforms.steam.url ?? game.platforms.itch.url;
}

export function getCardPlatformVariant(game: Game): 'itch' | 'steam' | 'none' {
	if (game.platforms.steam.url) return 'steam';
	if (game.platforms.itch.url) return 'itch';
	return 'none';
}
