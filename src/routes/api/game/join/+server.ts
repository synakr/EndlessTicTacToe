import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.server.js';

export const POST = async ({ locals, request }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const user = locals.user;

	const { roomCode } = await request.json();

	const game = await prisma.game.findUnique({
		where: {
			roomCode
		},
		include: {
			players: true
		}
	});

	if (!game) {
		return json({ error: 'Game not found' }, { status: 404 });
	}

	if (game.players.length >= 2) {
		return json({ error: 'Game already full' }, { status: 400 });
	}

	const alreadyJoined = game.players.find((player) => player.userId === user.id);

	if (alreadyJoined) {
		return json({
			message: 'Already joined'
		});
	}

	await prisma.$transaction([
		prisma.gamePlayer.create({
			data: {
				gameId: game.id,
				userId: user.id,
				symbol: 'O'
			}
		}),
		prisma.game.update({
			where: {
				id: game.id
			},
			data: {
				status: 'active'
			}
		})
	]);

	return json({
		success: true
	});
};
