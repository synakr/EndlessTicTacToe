import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const { roomCode } = params;

	const res = await fetch(`/api/game/${roomCode}`);

	if (!res.ok) {
		throw new Error('Game not found');
	}

	const game = await res.json();

	return {
		game
	};
};
