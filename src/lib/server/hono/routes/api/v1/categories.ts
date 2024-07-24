import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Bindings } from '..';
import { supabase } from '$lib/supabaseClient';

const router = new Hono<{ Bindings: Bindings }>();

router.get('/categories', async (c) => {
	try {
		const { data } = await supabase.from('categories').select('id, name');
		return c.json({
			data: data
		});
	} catch (err: any) {
		throw new HTTPException(400, { message: err });
	}
});

export { router };
