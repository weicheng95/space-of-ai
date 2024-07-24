import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { searchFormSchema } from '../home/schema';

export const load: PageServerLoad = async ({ url, fetch, locals }) => {
	const query = url.searchParams.get('q');
	let productFunc: Promise<any>;

	const fetchTop100Products = async () => {
		const result = await fetch('/api/v1/products');
		const data: any = await result.json();
		return data || null;
	};

	const fetchProducts = async (query: string) => {
		const result = await fetch(`/api/v1/products/search?query=${query}`);
		const data: any = await result.json();
		return data || null;
	};

	const fetchCategories = async () => {
		const result = await fetch('/api/v1/categories');
		const data: any = await result.json();
		return data?.data || null;
	};

	if (query) {
		productFunc = fetchProducts(query);
	} else {
		productFunc = fetchTop100Products();
	}

	return {
		user: locals?.user,
		products: productFunc,
		categories: fetchCategories(),
		searchMode: !!query,
		query: query,
		url: url.origin,
		form: await superValidate(zod(searchFormSchema))
	};
};

export const actions: Actions = {
	search: async ({ request, fetch }) => {
		const form = await superValidate(request, zod(searchFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const { query } = form.data;
		try {
			const res = await fetch(`/api/v1/products/search?query=${query}`);
			const { data }: any = await res.json();
			return {
				form,
				products: data
			};
		} catch (err) {
			console.error(err);
			return fail(500, {
				query
			});
		}
	}
};
