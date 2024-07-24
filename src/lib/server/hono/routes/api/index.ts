import { Hono } from 'hono';
import { router as Product } from './v1/products';
import { router as Categories } from './v1/categories';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
// import { router as Seed } from './v1/seed';
import * as schema from '$lib/drizzle/schema';

export type Variables = {
	id_token: string;
};

export type Bindings = {
	DB_SUPABASE: PostgresJsDatabase<typeof schema>;
	AI_PRODUCTS_BUCKET: R2Bucket;
};

const routerv1 = new Hono<{ Variables: Variables; Bindings: Bindings }>();
routerv1.route('/', Product);
routerv1.route('/', Categories);
// routerv1.route('/', Seed);

export { routerv1 as apiV1Router };
