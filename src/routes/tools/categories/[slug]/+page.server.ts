import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const slug = params.slug;
	const [categoryId, categoryName] = slug.split('-');

	if (!categoryId || !Number(categoryId)) {
		throw error(400, { message: 'Invalid' });
	}

	const getProducts = async () => {
		try {
			const res = await fetch(`/api/v1/products/categories/${categoryId}`);
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
		products: await getProducts(),
		category: {
			id: categoryId,
			name: categoryName
		}
	};
};
