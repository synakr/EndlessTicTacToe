import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const supabase = createServerClient(PUBLIC_SUPABASE_URL!, PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			get: (key) => cookies.get(key),
			set: (key, value, options) =>
				cookies.set(key, value, {
					path: '/',
					...options
				}),
			remove: (key, options) =>
				cookies.delete(key, {
					path: '/',
					...options
				})
		}
	});

	const { email, password } = await request.json();

	if (!email || !password) {
		throw error(400, 'Email and password required');
	}

	const { data, error: authError } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (authError) {
		throw error(401, authError.message);
	}

	return json({
		accessToken: data.session.access_token,
		refreshToken: data.session.refresh_token,
		user: data.user
	});
};
