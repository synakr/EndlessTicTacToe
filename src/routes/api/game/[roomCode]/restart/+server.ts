import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.server.js';

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

export const POST = async ({ params }) => {
	const game = await prisma.game.findUnique({
		where: {
			roomCode: params.roomCode
		}
	});

	if (!game) {
		return json({ error: 'Game not found' }, { status: 404 });
	}

	await prisma.$transaction([
		prisma.move.deleteMany({
			where: {
				gameId: game.id
			}
		}),
		prisma.game.update({
			where: {
				id: game.id
			},
			data: {
				status: 'active',
				currentTurn: 'X'
			}
		})
	]);

	const updatedGame = await getUpdatedGame(game.id);

	return json({
		game: updatedGame
	});
};
