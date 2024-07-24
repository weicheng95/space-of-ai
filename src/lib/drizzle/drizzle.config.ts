import { defineConfig } from 'drizzle-kit';
export default defineConfig({
	schema: './schema.ts',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.PRIVATE_SUPABASE_CONNECTION_STRING || ''
	},
	verbose: true,
	strict: true
});
