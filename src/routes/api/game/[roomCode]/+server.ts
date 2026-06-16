import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.server.js';

export const GET = async ({ params, locals }) => {
	const game = await prisma.game.findUnique({
		where: { roomCode: params.roomCode },
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

	if (!game) {
		return json({ error: 'Not found' }, { status: 404 });
	}

	return json({
		...game,
		currentUserId: locals.user?.id ?? null
	});
};
