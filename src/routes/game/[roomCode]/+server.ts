import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.server.js';

export const GET = async ({ params, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const game = await prisma.game.findUnique({
		where: { roomCode: params.roomCode },
		include: {
			players: true,
			moves: true
		}
	});

	if (!game) {
		return json({ error: 'Game not found' }, { status: 404 });
	}

	return json(game);
};
