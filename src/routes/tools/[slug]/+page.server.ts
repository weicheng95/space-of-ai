import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { validate as uuidValidate } from 'uuid';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

	const result = uuidRegex.exec(params.slug);

	if (!result || !result[0] || !uuidValidate(result[0])) {
		throw error(400, { message: 'Invalid' });
	}

	const getProductDetail = async () => {
		try {
			const res = await fetch(`/api/v1/products/${result[0]}`);
			if (res.status === 200) {
				const { data }: any = await res.json();
				return data;
			}
		} catch (err) {
			console.log(err);
			return error(500, { message: 'Internal Server Error' });
		}
	};

	return {
		product: await getProductDetail()
	};
};
