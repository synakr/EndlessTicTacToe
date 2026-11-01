import type { Handle } from '@sveltejs/kit';
import type { User } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = createServerClient(PUBLIC_SUPABASE_URL!, PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) =>
				event.cookies.set(key, value, { path: '/', ...options }),
			remove: (key, options) => event.cookies.delete(key, { path: '/', ...options })
		}
	});

	// getClaims verifies the JWT locally using Supabase's cached JWKS instead of
	// making a remote Auth getUser() request on every page/API request.
	// Supabase SSR still refreshes/updates cookies through the cookie callbacks.
	const { data, error } = await supabase.auth.getClaims();
	const claims = data?.claims;

	// Existing server routes only depend on the authenticated user's id. Keep
	// the User-compatible local shape without making an additional network call.
	const user = !error && typeof claims?.sub === 'string'
		? ({
				id: claims.sub,
				email: typeof claims.email === 'string' ? claims.email : undefined,
				user_metadata: claims.user_metadata ?? {},
				app_metadata: claims.app_metadata ?? {},
				aud: claims.aud,
				created_at: '',
				updated_at: ''
			} as unknown as User)
		: null;

	event.locals.supabase = supabase;
	event.locals.user = user;

	return resolve(event);
};
