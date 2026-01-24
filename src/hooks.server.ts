import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = createClient(PUBLIC_SUPABASE_URL!, PUBLIC_SUPABASE_ANON_KEY!);
	console.log('HOOK EXECUTED');

	// Get the access token from the Authorization header or cookie
	const authHeader = event.request.headers.get('Authorization');
	const token = authHeader?.replace('Bearer ', '') || event.cookies.get('access_token');

	if (token) {
		// Set the session with the token
		const { data } = await supabase.auth.getUser(token);
		event.locals.user = data.user ?? null;
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
