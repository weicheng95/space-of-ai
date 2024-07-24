import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { GitHub, Google } from 'arctic';
import {
	GOOGLE_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GITHUB_CLIENT_ID,
	GOOGLE_SECRET
} from '$env/static/private';
import { PUBLIC_WEBSITE_URL } from '$env/static/public';
import { SupabaseJSDBAdapter } from './lucia/supabase-adapter';

interface DatabaseUserAttributes {
	image: string;
	username: string;
}

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);
export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_SECRET,
	`${PUBLIC_WEBSITE_URL}/login/google/callback`
);

export const initLucia = (supabase?: any) => {
	const adapter = new SupabaseJSDBAdapter(supabase);
	const lucia = new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				// set to `true` when using HTTPS
				secure: !dev
			}
		},
		getUserAttributes: (attributes) => {
			return {
				// attributes has the type of DatabaseUserAttributes
				image: attributes.image,
				username: attributes.username
			};
		}
	});

	return { lucia };
};

const lucia = initLucia().lucia;

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}
