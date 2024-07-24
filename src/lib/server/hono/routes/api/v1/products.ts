import { type Context, Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { guard } from '$lib/server/hono/middleware/auth';
import path from 'node:path';
import { uploadImage } from '$lib/server/hono/helpers/storage';
import {
	ACCOUNT_EMAL,
	ACCOUNT_ID,
	AI_PRODUCT_BUCKET_NAME,
	AI_PRODUCT_KV_NAMESPACE_ID,
	WORKER_API_KEY
} from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';
import { KV } from '$lib/kv';
import { PUBLIC_AI_AGGREGATOR_WORKER_API_URL } from '$env/static/public';
import type { Bindings } from '..';
import { supabase } from '$lib/supabaseClient';
import { type Database } from '$lib/database.types';

const router = new Hono<{ Bindings: Bindings }>();

router.get('/products', async (c: Context) => {
	const page = Number(c.req.query('page')) || 0;
	const page_size = 98;
	const start = page === 0 ? 0 : page_size * page + 1;
	const end = start + page_size;

	try {
		const { data, count } = await supabase
			.from('products')
			.select('id, name, icon_url, url, description, categories (id, name)', { count: 'exact' })
			.eq('status_type', 'active')
			.order('created_at', { ascending: false })
			.limit(page_size)
			.range(start, end);

		return c.json({
			data: data,
			hasNextPage: count ? count > end : false
		});

	} catch (err: any) {
		throw new HTTPException(400, { message: err });
	}
});

router.get('/products/categories/:id', async (c: Context) => {
	const categoryId = c.req.param('id') || undefined;
	if (!categoryId) {
		throw new HTTPException(400, { message: 'category Id is required' });
	}

	try {
		const { data } = await supabase
			.from('products')
			.select('id, name, icon_url, url, description, categories (id, name)')
			.limit(1000)
			.eq('category_id', Number(categoryId))
			.eq('status_type', 'active')
			.order('created_at', { ascending: false });

		return c.json({
			data: data
		});
	} catch (err: any) {
		throw new HTTPException(400, { message: err });
	}
});

router.post('/products', guard(), async (c) => {
	const r = await c.req.parseBody();
	const user = await c.get('user');
	// upload to bucket
	const name = r['name'] as string;
	const iconImageFile = r['iconImage'] as File;
	const iconImageFileExt = path.extname(iconImageFile.name);

	const websiteImageFile = r['websiteImage'] as File;
	const websiteImageFileExt = path.extname(websiteImageFile.name);

	console.log('uploading file', name);
	try {
		// upload icon
		const iconUploadRes = await uploadImage(
			iconImageFile,
			`${name}-icon`,
			iconImageFileExt,
			AI_PRODUCT_BUCKET_NAME,
			'images'
		);

		if (iconUploadRes.status && iconUploadRes.message) {
			return c.json({
				status: 400,
				message: iconUploadRes.message
			});
		}

		// upload website image
		const websiteImageUploadRes = await uploadImage(
			websiteImageFile,
			name,
			websiteImageFileExt,
			AI_PRODUCT_BUCKET_NAME,
			'images'
		);

		if (websiteImageUploadRes.status && websiteImageUploadRes.message) {
			return c.json({
				status: 400,
				message: websiteImageUploadRes.message
			});
		}

		// push to db
		const id = uuidv4();
		const payload = {
			id,
			icon_url: iconUploadRes.key,
			website_image_url: websiteImageUploadRes.key,
			url: r['websiteUrl'] as string,
			name: r['name'] as string,
			description: r['description'] as string,
			meta: {
				pricing: JSON.parse(r['pricing'] as string)
			},
			subcategory: JSON.parse(r['subcategories'] as string),
			category_id: Number(r['category']),
			status_type: 'draft' as Database['public']['Enums']['status_type'],
			owner: user.id
		};

		await supabase.from('products').insert(payload);

		// push to kv
		const kv = new KV(WORKER_API_KEY, ACCOUNT_EMAL, ACCOUNT_ID);
		await kv.write(AI_PRODUCT_KV_NAMESPACE_ID, id, payload);
	} catch (err) {
		console.log(err);
	}

	return c.json({
		message: 'ok'
	});
});

// // NEW Search Method without Vector DB
router.get('/products/search', async (c: Context) => {
	const query = c.req.query('query') || '';
	if (!query) {
		throw new HTTPException(400, { message: 'query is required' });
	}

	try {
		// get from vector database
		const res = await fetch(
			`${PUBLIC_VECTOR_WORKER_API_URL}/api/v1/vector/search?q=${encodeURIComponent(query)}`
		);

		if (res.status !== 200) {
			console.log(await res.text());
			throw new HTTPException(400, { message: 'Internal Server Error' });
		}
		
		const data: { ids: string[] } = await res.json();
		if (!data || !data.ids || !data.ids.length) {
			return c.json({
				data: []
			});
		}

		const { data: productData } = await supabase
			.from('products')
			.select('id, name, icon_url, url, description, categories (id, name)')
			.in('id', data.ids)
			.order('created_at', { ascending: false })
			.limit(1000);

		return c.json({
			data: productData
		});
	} catch (err: any) {
		throw new HTTPException(400, { message: err });
	}
});

router.get('/products/my-tools', guard(), async (c: Context) => {
	const user = c.get('user');
	try {
		const { data } = await supabase
			.from('products')
			.select(
				'id, name, icon_url, website_image_url, url, description, meta, subcategory, status_type, categories (id, name)'
			)
			.eq('owner', user.id)
			.order('created_at', { ascending: false });

		return c.json({
			data: data || null
		});
	} catch (error: any) {
		throw new HTTPException(400, { message: error.message });
	}
});

router.get('/products/secret-sitemap', async (c: Context) => {
	const version = Number(c.req.query('version')) || 1;
	const page_size = 10000;
	const start = version === 1 ? 0 : page_size * (version - 1);
	const end = start + page_size;

	try {
		const { data } = await supabase
			.from('products')
			.select('id, name, last_refreshed_at')
			.range(start, end)
			.limit(page_size);

		return c.json({
			data: data
		});
	} catch (err: any) {
		throw new HTTPException(400, { message: err });
	}
});

// // IMPORTANT, this must put at the end
router.get('/products/:id', async (c: Context) => {
	const id = c.req.param('id');
	if (!id) {
		throw new HTTPException(400, { message: 'id is required' });
	}

	try {
		const { data } = await supabase
			.from('products')
			.select(
				'id, name, icon_url, website_image_url, url, description, meta, subcategory, categories (id, name)'
			)
			.eq('id', id)
			.single();

		return c.json({
			data: data || null
		});
	} catch (error: any) {
		throw new HTTPException(400, { message: error.message });
	}
});

export { router };
