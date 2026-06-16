import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.server.js';

export const POST = async ({ params }) => {
	const game = await prisma.game.findUnique({
		where: {
			roomCode: params.roomCode
		}
	});

	if (!game) {
		return json({ error: 'Game not found' }, { status: 404 });
	}

	await prisma.move.deleteMany({
		where: {
			gameId: game.id
		}
	});

	await prisma.game.update({
		where: {
			id: game.id
		},
		data: {
			status: 'active',
			currentTurn: 'X'
		}
	});

	return json({
		success: true
	});
};
