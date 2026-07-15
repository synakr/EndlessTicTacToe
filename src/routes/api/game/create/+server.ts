import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.server.js';
import { generateRoomCode } from '$lib/roomCode.js';

export const POST = async ({ locals, request }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { gameMode, boardSize, tieBreaker } = await request.json();

	let roomCode: string;

	while (true) {
		roomCode = generateRoomCode();

		const exists = await prisma.game.findUnique({
			where: {
				roomCode
			}
		});

		if (!exists) break;
	}

	const game = await prisma.game.create({
		data: {
			roomCode,
			mode: gameMode,
			boardSize,
			tieBreaker,
			status: 'waiting',
			currentTurn: 'X',
			players: {
				create: {
					userId: locals.user.id,
					symbol: 'X'
				}
			}
		}
	});

	return json({
		roomCode: game.roomCode
	});
};
