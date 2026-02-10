import { prisma } from '$lib/prisma.server.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	const user = locals.user; // however you store auth user
	if (!user) throw redirect(302, '/login');

	const profile = await prisma.profile.findUnique({
		where: { id: user.id },
		include: {
			players: {
				include: {
					game: true
				}
			}
		}
	});

	if (!profile) throw redirect(302, '/login');

	// basic stats
	const totalGames = profile.players.length;

	const finished = profile.players.filter((p) => p.game.status === 'finished').length;

	return {
		profile,
		stats: {
			totalGames,
			finished
		}
	};
}
