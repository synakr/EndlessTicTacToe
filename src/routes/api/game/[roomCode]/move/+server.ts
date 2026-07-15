import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.server.js';

function checkWinner(board: string[][], boardSize: number, target: number): 'X' | 'O' | null {
	const directions = [
		[0, 1], // horizontal
		[1, 0], // vertical
		[1, 1], // diagonal
		[1, -1] // anti-diagonal
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

					if (nr < 0 || nr >= boardSize || nc < 0 || nc >= boardSize || board[nr][nc] !== symbol) {
						break;
					}

					count++;
				}

				if (count >= target) {
					return symbol as 'X' | 'O';
				}
			}
		}
	}

	return null;
}

function buildBoard(moves: any[], boardSize: number): string[][] {
	const board = Array(boardSize)
		.fill(null)
		.map(() => Array(boardSize).fill(''));

	for (const move of moves) {
		const row = Math.floor(move.cell / boardSize);
		const col = move.cell % boardSize;

		board[row][col] = move.symbol;
	}

	return board;
}

async function getUpdatedGame(id: string) {
	return prisma.game.findUnique({
		where: { id },
		include: {
			players: {
				include: {
					user: true
				}
			},
			moves: {
				orderBy: {
					moveNo: 'asc'
				}
			}
		}
	});
}

export const POST = async ({ params, request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { cell } = await request.json();

	const game = await prisma.game.findUnique({
		where: {
			roomCode: params.roomCode
		},
		include: {
			players: true,
			moves: {
				orderBy: {
					moveNo: 'asc'
				}
			}
		}
	});

	if (!game) {
		return json({ error: 'Game not found' }, { status: 404 });
	}

	if (game.status === 'finished') {
		return json({ error: 'Game already finished' }, { status: 400 });
	}

	const player = game.players.find((p) => p.userId === locals.user?.id);

	if (!player) {
		return json({ error: 'Not a player in this game' }, { status: 403 });
	}

	if (player.symbol !== game.currentTurn) {
		return json({ error: 'Not your turn' }, { status: 400 });
	}

	const existingMove = game.moves.find((move) => move.cell === cell);

	if (existingMove) {
		return json({ error: 'Cell already occupied' }, { status: 400 });
	}

	const move = await prisma.move.create({
		data: {
			gameId: game.id,
			userId: locals.user.id,
			symbol: player.symbol,
			cell,
			moveNo: game.moves.length + 1
		}
	});

	const moves = [...game.moves, move];

	const board = buildBoard(moves, game.boardSize);

	const winner = checkWinner(board, game.boardSize, game.tieBreaker);

	if (winner) {
		await prisma.gamePlayer.updateMany({
			where: {
				gameId: game.id,
				symbol: winner
			},
			data: {
				score: {
					increment: 1
				}
			}
		});

		await prisma.game.update({
			where: {
				id: game.id
			},
			data: {
				status: 'finished'
			}
		});

		const updatedGame = await getUpdatedGame(game.id);

		return json({
			game: updatedGame,
			winner
		});
	}

	const totalCells = game.boardSize * game.boardSize;

	if (moves.length >= totalCells) {
		const movesToRemove = moves.slice(0, game.tieBreaker);

		await prisma.move.deleteMany({
			where: {
				id: {
					in: movesToRemove.map((m) => m.id)
				}
			}
		});

		await prisma.game.update({
			where: {
				id: game.id
			},
			data: {
				currentTurn: game.currentTurn === 'X' ? 'O' : 'X'
			}
		});

		const updatedGame = await getUpdatedGame(game.id);

		return json({
			game: updatedGame,
			winner: null,
			tieBreakerActivated: true
		});
	}

	await prisma.game.update({
		where: {
			id: game.id
		},
		data: {
			currentTurn: game.currentTurn === 'X' ? 'O' : 'X'
		}
	});

	const updatedGame = await getUpdatedGame(game.id);

	return json({
		game: updatedGame,
		winner: null,
		tieBreakerActivated: false
	});
};
