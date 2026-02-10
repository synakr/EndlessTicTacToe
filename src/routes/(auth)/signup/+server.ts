import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.server.js';
import { prisma } from '$lib/prisma.server.js';

export const POST = async ({ request }) => {
	const { email, password, username } = await request.json();

	if (!email || !password || !username) {
		throw error(400, 'All fields required');
	}

	// 1. Create user in Supabase Auth
	const { data, error: authError } = await supabase.auth.signUp({
		email,
		password
	});

	if (authError || !data.user) {
		throw error(400, authError?.message || 'Signup failed');
	}

	// 2. Create Profile row
	await prisma.profile.create({
		data: {
			id: data.user.id, // SAME ID AS AUTH
			email,
			username
		}
	});

	return json({ ok: true });
};
