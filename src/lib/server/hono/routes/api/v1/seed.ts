// import { products } from '$lib/drizzle/schema';
// import { drizzle } from 'drizzle-orm/d1';
// import { Hono } from 'hono';
// import { HTTPException } from 'hono/http-exception';
// import fs from 'fs/promises';

// type Bindings = {
// 	DB: D1Database;
// };

// const router = new Hono<{ Bindings: Bindings }>();

// router.get('/seed-products', async (c) => {
// 	try {
// 		const db = drizzle(c.env.DB);
// 		const data: (typeof products.$inferInsert)[] = [];
// 		const file = await fs.readFile(
// 			'/Users/weichenglau/Documents/personal-project/ai-crawler/result/product1.json',
// 			'utf-8'
// 		);
// 		if (!file) {
// 			throw new Error('File not found');
// 		}

// 		const result = JSON.parse(file);

// 		for (const item of result) {
// 			data.push(item);
// 		}

// 		console.log('Seed products start');
// 		for (let i = 0; i < data.length; i += 10) {
// 			console.log('seeding chunk', i);
// 			const currentChunk = data.slice(i, i + 10);
// 			await db.insert(products).values(currentChunk);
// 		}
// 		console.log('Seed products done');
// 		return c.json({
// 			message: 'ok'
// 		});
// 		// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	} catch (err: any) {
// 		throw new HTTPException(400, { message: err });
// 	}
// });

// export { router };
