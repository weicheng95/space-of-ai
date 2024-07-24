import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate, withFiles } from 'sveltekit-superforms';
import { toolFormSchema } from '../schema';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	if (!locals.user) {
		throw redirect(303, '/auth');
	}

	const getCategories = async () => {
		try {
			const result = await fetch('/api/v1/categories');
			const data: any = await result.json();
			return data && data.data ? data.data : [];
		} catch (err) {
			console.log(err);
		}
	};

	return {
		categories: getCategories(),
		form: await superValidate(zod(toolFormSchema))
	};
};

export const actions: Actions = {
	submit: async ({ request, fetch }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(toolFormSchema));

		if (!form.valid) {
			console.log(withFiles({ form }));
			return fail(400, withFiles({ form }));
		}

		const formBody = new FormData();
		formBody.append('name', form.data.name);
		formBody.append('websiteUrl', form.data.websiteUrl);
		formBody.append('description', form.data.description);
		formBody.append('iconImage', form.data.iconImage);
		formBody.append('websiteImage', form.data.websiteImage);
		formBody.append('category', String(form.data.category));
		formBody.append('subcategories', JSON.stringify(form.data.subcategories));
		formBody.append('pricing', JSON.stringify(form.data.pricing));
		const res = await fetch('/api/v1/products', {
			method: 'POST',
			body: formBody
		});

		if (res.status !== 200) {
			return fail(500, {
				message: 'Internal Server Error'
			});
		}

		return message(form, 'success');
	}
};
