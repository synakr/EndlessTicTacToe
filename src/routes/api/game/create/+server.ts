import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.server.js';
import { generateRoomCode } from '$lib/roomCode.js';

export const POST = async ({ locals, request }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { boardSize = 3 } = await request.json();

	let roomCode;
	let exists = true;

	while (exists) {
		roomCode = generateRoomCode();
		const game = await prisma.game.findUnique({
			where: { roomCode }
		});
		exists = !!game;
	}

	const game = await prisma.game.create({
		data: {
			roomCode: roomCode!,
			mode: 'MULTI',
			boardSize,
			status: 'waiting',
			currentTurn: 'X',
			players: {
				create: {
					userId: locals.user.id,
					symbol: 'X',
					type: 'HUMAN'
				}
			}
		}
	});

	return json({ roomCode: game.roomCode });
};
