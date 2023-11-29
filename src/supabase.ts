import { createClient } from '@supabase/supabase-js';

import type { Database } from './utils/generated-supabase-types';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_PUBLIC_KEY,
);
