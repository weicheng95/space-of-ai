import postgres from 'postgres';
import { PRIVATE_DB_CONNECTION_STRING } from '$env/static/private';
import * as schema from './drizzle/schema';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export const ConnectSupabasePg = (): PostgresJsDatabase<typeof schema> => {
	const client = postgres(PRIVATE_DB_CONNECTION_STRING || '', { prepare: false });
	return drizzle(client, { schema: schema });
};

export const injectDbSupabase = async (event: any) => {
	try {
		event.locals.DB_SUPABASE = ConnectSupabasePg();
	} catch (error) {
		console.log('🚀 ~ file: hooks.server.ts: consthandle:Handle= ~ error:', error);
	}
};
