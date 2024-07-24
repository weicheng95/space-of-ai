import { PUBLIC_ENVIRONEMT, PUBLIC_GTM_ID, PUBLIC_VERSION } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { initLucia } from '$lib/auth';
import { supabase } from '$lib/supabaseClient';

const htmlHandle: Handle = async ({ event, resolve }) => {
	return await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html
				.replace(/%environment%/g, PUBLIC_ENVIRONEMT)
				.replace(/%gtmid%/g, PUBLIC_GTM_ID)
				.replace(/%version%/g, PUBLIC_VERSION);
		}
	});
	//
};

// const supabaseHandle: Handle = async ({ event, resolve }) => {
// 	event.locals.supabase = createServerClient(PRIVATE_SUPABASE_URL, PRIVATE_SUPABASE_ANON_KEY, {
// 		cookies: {
// 			get: (key) => event.cookies.get(key),
// 			/**
// 			 * Note: You have to add the `path` variable to the
// 			 * set and remove method due to sveltekit's cookie API
// 			 * requiring this to be set, setting the path to an empty string
// 			 * will replicate previous/standard behaviour (https://kit.svelte.dev/docs/types#public-types-cookies)
// 			 */
// 			set: (key, value, options) => {
// 				event.cookies.set(key, value, { ...options, path: '/' });
// 			},
// 			remove: (key, options) => {
// 				event.cookies.delete(key, { ...options, path: '/' });
// 			}
// 		}
// 	});

/**
 * a little helper that is written for convenience so that instead
 * of calling `const { data: { session } } = await supabase.auth.getSession()`
 * you just call this `await getSession()`
 */
// event.locals.getSession = async () => {
// 	let session: Session | null = null;

// 	const { data: getUserData } = await event.locals.supabase.auth.getUser();
// 	if (getUserData.user == null) {
// 		session = null;
// 		return session;
// 	}

// 	const userSession = await event.locals.supabase.auth.getSession();
// 	session = userSession.data.session;

// 	return session;
// };

// return resolve(event, {
// 	filterSerializedResponseHeaders(name) {
// 		return name === 'content-range' || name.startsWith('x-');
// 	}
// });
// };

// const apiHandle: Handle = async ({ event, resolve }) => {
// 	// const url = new URL(event.request.url);
// 	// if (url.pathname.startsWith('/api')) {
// 	// 	return await app.fetch(event.request, event.platform?.env);
// 	// }
// 	return await resolve(event);
// };

const authHandle: Handle = async ({ event, resolve }) => {
	const { lucia } = initLucia(supabase);
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle = sequence(htmlHandle, authHandle);
