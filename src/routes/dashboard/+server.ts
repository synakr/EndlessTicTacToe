import { prisma } from '$lib/prisma.server';
import { error, json } from '@sveltejs/kit';

export async function GET({ locals }) {
	if (!locals.user) throw error(401, 'Unauthorized');

	const profile = await prisma.profile.findMany();

	return json(profile);
}

export async function POST({ request, locals }) {
	if (!locals.user) throw error(401, 'Unauthorized');

	const body = await request.json();
	const { email } = body;

	if (!email) throw error(400, 'Email is required');

	const task = await prisma.profile.create({
		data: {
			id: locals.user.id,
			email: email
		}
	});

	return json(task, { status: 201 });
}
