import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.server.js';
import { generateRoomCode } from '$lib/roomCode.js';

export const POST = async ({ locals, request }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await request.json();
	const { gameMode, boardSize, tieBreaker } = data;

	// check if everything conveyed okay
	console.log(gameMode, boardSize, tieBreaker);

	let roomCode;
	let exists = true;

	while (exists) {
		roomCode = generateRoomCode();
		const game = await prisma.game.findUnique({
			where: { roomCode }
		});
		exists = !!game;
	}

	// Check if user profile exists in database
	const profile = await prisma.profile.findUnique({
		where: { id: locals.user.id }
	});

	const game = await prisma.game.create({
		data: {
			roomCode: roomCode!,
			mode: gameMode,
			boardSize: boardSize,
			tieBreaker: tieBreaker,
			status: 'waiting',
			currentTurn: 'X',
			players: {
				create: {
					userId: profile ? locals.user.id : null,
					symbol: 'X'
				}
			}
		}
	});

	console.log(game);

	return json({ roomCode: game.roomCode });
};
