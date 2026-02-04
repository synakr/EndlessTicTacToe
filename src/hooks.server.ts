import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = createServerClient(PUBLIC_SUPABASE_URL!, PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			get: (key) => event.cookies.get(key),

			set: (key, value, options) =>
				event.cookies.set(key, value, {
					path: '/',
					...options
				}),

			remove: (key, options) =>
				event.cookies.delete(key, {
					path: '/',
					...options
				})
		}
	});

	// LET SUPABASE HANDLE SESSION — NO MANUAL TOKENS
	const {
		data: { user }
	} = await supabase.auth.getUser();

	event.locals.supabase = supabase;
	event.locals.user = user ?? null;

	return resolve(event);
};
