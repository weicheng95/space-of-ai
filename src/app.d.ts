// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// import { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}

		interface PageData {
			// session: Session | null;
		}

		// cloudflare
		interface Platform {
			env: {
				DB: D1Database;
				AI_PRODUCTS_BUCKET: R2Bucket;
			};
			context: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
