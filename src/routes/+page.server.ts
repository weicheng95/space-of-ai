import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { searchFormSchema } from './home/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { initLucia } from '$lib/auth';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ url, fetch, locals }) => {
	const fetchTop100Products = async () => {
		const result = await fetch('/api/v1/products');
		const data: any = await result.json();
		return data || null;
	};

	const fetchCategories = async () => {
		const result = await fetch('/api/v1/categories');
		const data: any = await result.json();
		return data?.data || null;
	};

	return {
		user: locals?.user,
		products: fetchTop100Products(),
		categories: fetchCategories(),
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
	},
	logout: async ({ locals, cookies }) => {
		console.log('logoutloooooo');

		if (!locals.session) {
			return fail(401);
		}

		const { lucia } = initLucia(supabase);
		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/');
	}
};
