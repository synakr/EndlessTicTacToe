import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

// Server-only client used for trusted server-side Realtime broadcasts.
// Never import this module from browser code or expose the service-role key.
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
		detectSessionInUrl: false
	},
	realtime: {
		params: {
			eventsPerSecond: 10
		}
	}
});
