import app from '$lib/server/hono';
import type { PageServerLoad } from '../../$types';

export const GET: PageServerLoad = async ({ request, platform, locals }) => {
	return await app.fetch(request, { ...platform?.env, ...locals });
};

export const POST = GET;
export const PUT = GET;
