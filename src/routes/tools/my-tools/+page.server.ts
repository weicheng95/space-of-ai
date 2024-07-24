import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const fetchMyProducts = async () => {
		const result = await fetch('/api/v1/products/my-tools');
		const data: any = await result.json();
		return data && data.data ? data.data : [];
	};

	return {
		products: fetchMyProducts()
	};
};

export const actions: Actions = {
	// search: async ({ request, locals: { supabase } }) => {
	// 	const form = await superValidate(request, zod(searchFormSchema));
	// 	if (!form.valid) {
	// 		return fail(400, {
	// 			form
	// 		});
	// 	}
	// 	const { query } = form.data;
	// 	const { data, error } = await supabase
	// 		.from('products')
	// 		.select('id, name, icon_url, url, description, categories (id, name)')
	// 		.textSearch('fts', `${query.split(' ').join(' | ')}`)
	// 		.limit(3000);
	// 	if (error) {
	// 		console.log(error);
	// 		return fail(500, {
	// 			query
	// 		});
	// 	}
	// 	return {
	// 		form,
	// 		products: data
	// 	};
	// }
};
