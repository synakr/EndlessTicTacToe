import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;

	const { email, password } = await request.json();

	if (!email || !password) {
		throw error(400, 'Email and password required');
	}

	const { error: authError } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (authError) {
		throw error(401, authError.message);
	}

	return json({ success: true });
};
