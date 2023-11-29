import { PostgrestError } from '@supabase/supabase-js';

import { Database } from './generated-supabase-types';

export type Tables<T extends keyof Database['public']['Tables']> =
	Database['public']['Tables'][T]['Row'];

export type Result<T> = T extends PromiseLike<infer U> ? U : never;
export type Success<T> = T extends PromiseLike<{ data: infer U }>
	? Exclude<U, null>
	: never;
export type Error = PostgrestError;
