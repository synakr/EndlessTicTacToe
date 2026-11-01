import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.server.js';
import { supabase } from '$lib/supabase.server.js';

function checkWinner(board: string[][], boardSize: number, target: number): 'X' | 'O' | null {
	const directions = [
		[0, 1],
		[1, 0],
		[1, 1],
		[1, -1]
	];

	for (let r = 0; r < boardSize; r++) {
		for (let c = 0; c < boardSize; c++) {
			const symbol = board[r][c];
			if (!symbol) continue;

			for (const [dr, dc] of directions) {
				let count = 1;
				for (let k = 1; k < target; k++) {
					const nr = r + dr * k;
					const nc = c + dc * k;
					if (nr < 0 || nr >= boardSize || nc < 0 || nc >= boardSize || board[nr][nc] !== symbol)
						break;
					count++;
				}
				if (count >= target) return symbol as 'X' | 'O';
			}
		}
	}

	return null;
}

function buildBoard(moves: Array<{ cell: number; symbol: string | null }>, boardSize: number) {
	const board = Array.from({ length: boardSize }, () => Array<string>(boardSize).fill(''));
	for (const move of moves) {
		if (!move.symbol || move.cell < 0 || move.cell >= boardSize * boardSize) continue;
		board[Math.floor(move.cell / boardSize)][move.cell % boardSize] = move.symbol;
	}
	return board;
}

/**
 * Publish from the server only after the database transaction commits.
 * The service-role client stays server-side; the browser never receives its key.
 */
async function publishMove(roomCode: string, payload: Record<string, unknown>) {
	const channel = supabase.channel(`game-${roomCode}`);

	try {
		const result = await channel.httpSend('move-made', payload);

		if (!result.success) {
			console.error(`[realtime] Failed to publish move for room ${roomCode}:`, result.error);
		}
	} catch (error) {
		console.error(`[realtime] Error publishing move for room ${roomCode}:`, error);
	} finally {
		await supabase.removeChannel(channel);
	}
}

export const POST = async ({ params, request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	let body: { cell?: unknown };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const cell = body.cell;
	if (!Number.isInteger(cell) || (cell as number) < 0) {
		return json({ error: 'Invalid cell' }, { status: 400 });
	}

	try {
		const event = await prisma.$transaction(async (tx) => {
			// Serialize moves for this room. This prevents two simultaneous requests
			// from both passing the turn/occupied-cell checks against stale state.
			const lockedGames = await tx.$queryRaw<Array<{ id: string }>>`
				SELECT "id" FROM "Game" WHERE "roomCode" = ${params.roomCode} FOR UPDATE
			`;
			if (lockedGames.length === 0) return { error: 'Game not found', status: 404 as const };

			const game = await tx.game.findUnique({
				where: { id: lockedGames[0].id },
				include: {
					players: true,
					moves: { orderBy: { moveNo: 'asc' } }
				}
			});

			if (!game) return { error: 'Game not found', status: 404 as const };
			if (game.status === 'finished')
				return { error: 'Game already finished', status: 400 as const };
			if ((cell as number) >= game.boardSize * game.boardSize) {
				return { error: 'Cell is outside the board', status: 400 as const };
			}

			const player = game.players.find((p) => p.userId === locals.user?.id);
			if (!player) return { error: 'Not a player in this game', status: 403 as const };
			if (player.symbol !== game.currentTurn)
				return { error: 'Not your turn', status: 400 as const };
			if (game.moves.some((move) => move.cell === cell)) {
				return { error: 'Cell already occupied', status: 400 as const };
			}

			const move = await tx.move.create({
				data: {
					gameId: game.id,
					userId: locals.user?.id,
					symbol: player.symbol,
					cell: cell as number,
					moveNo: game.moves.reduce((max, item) => Math.max(max, item.moveNo), 0) + 1
				}
			});

			const moves = [...game.moves, move];
			const winner = checkWinner(
				buildBoard(moves, game.boardSize),
				game.boardSize,
				game.tieBreaker
			);
			let currentTurn = game.currentTurn;
			let status: 'waiting' | 'active' | 'finished' = game.status;
			let tieBreakerActivated = false;
			let removedMoveIds: string[] = [];

			if (winner) {
				status = 'finished';
				await tx.gamePlayer.updateMany({
					where: { gameId: game.id, symbol: winner },
					data: { score: { increment: 1 } }
				});
				await tx.game.update({ where: { id: game.id }, data: { status } });
			} else if (moves.length >= game.boardSize * game.boardSize) {
				currentTurn = game.currentTurn === 'X' ? 'O' : 'X';
				tieBreakerActivated = true;
				removedMoveIds = moves.slice(0, game.tieBreaker).map((item) => item.id);
				await tx.move.deleteMany({ where: { id: { in: removedMoveIds } } });
				await tx.game.update({ where: { id: game.id }, data: { currentTurn } });
			} else {
				currentTurn = game.currentTurn === 'X' ? 'O' : 'X';
				await tx.game.update({ where: { id: game.id }, data: { currentTurn } });
			}

			const players = await tx.gamePlayer.findMany({
				where: { gameId: game.id },
				select: { symbol: true, score: true }
			});

			return {
				move,
				currentTurn,
				status,
				winner,
				tieBreakerActivated,
				removedMoveIds,
				scores: Object.fromEntries(players.map((item) => [item.symbol, item.score]))
			};
		});

		if ('error' in event) {
			return json(
				{ error: event.error },
				{ status: typeof event.status === 'number' ? event.status : 500 }
			);
		}

		// Publish the minimal state delta after commit. Do not send the full game,
		// player profiles, and complete move history on every turn.
		await publishMove(params.roomCode, event);

		return json({ event });
	} catch (error) {
		console.error('[move] Failed to process move:', error);
		return json({ error: 'Unable to process move' }, { status: 500 });
	}
};
