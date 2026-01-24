import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.server.js';
import { buildBoard, checkWinner, isBoardFull } from '$lib/gameEngine';

export const POST = async ({ locals, request }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { roomCode, row, col } = await request.json();

	const game = await prisma.game.findUnique({
		where: { roomCode },
		include: {
			players: true,
			moves: { orderBy: { moveNo: 'asc' } }
		}
	});

	if (!game) {
		return json({ error: 'Game not found' }, { status: 404 });
	}

	if (game.status !== 'active') {
		return json({ error: 'Game not active' }, { status: 400 });
	}

	const player = game.players.find((p) => p.userId === locals.user.id);
	if (!player) {
		return json({ error: 'Not a player' }, { status: 403 });
	}

	if (player.symbol !== game.currentTurn) {
		return json({ error: 'Not your turn' }, { status: 400 });
	}

	const board = buildBoard(
		game.moves.map((m) => ({
			row: m.row,
			col: m.col,
			symbol:
				game.moves.find((mm) => mm.row === m.row && mm.col === m.col)!.moveNo % 2 === 1 ? 'X' : 'O'
		})),
		game.boardSize
	);

	if (board[row][col] !== null) {
		return json({ error: 'Cell already filled' }, { status: 400 });
	}

	const moveNo = game.moves.length + 1;

	await prisma.move.create({
		data: {
			gameId: game.id,
			userId: locals.user.id,
			row,
			col,
			moveNo
		}
	});

	const newBoard = buildBoard([...game.moves, { row, col, symbol: player.symbol }], game.boardSize);

	const winner = checkWinner(newBoard);

	if (winner) {
		await prisma.game.update({
			where: { id: game.id },
			data: { status: 'finished' }
		});

		return json({ winner });
	}

	if (isBoardFull(newBoard)) {
		await prisma.game.update({
			where: { id: game.id },
			data: { status: 'finished' }
		});

		return json({ draw: true });
	}

	await prisma.game.update({
		where: { id: game.id },
		data: {
			currentTurn: player.symbol === 'X' ? 'O' : 'X'
		}
	});

	return json({ success: true });
};
