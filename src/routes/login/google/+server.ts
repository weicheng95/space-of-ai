// routes/login/github/+server.ts
import { redirect } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';
import { google } from '$lib/auth';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url: URL = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ["openid", "profile", "email"]
	});

	// store state verifier as cookie
	event.cookies.set('state', state, {
		secure: true, // set to false in localhost
		path: '/',
		sameSite: 'lax',
		httpOnly: true,
		maxAge: 60 * 10 // 10 min
	});

	// store code verifier as cookie
	event.cookies.set('code_verifier', codeVerifier, {
		secure: true, // set to false in localhost
		path: '/',
		sameSite: 'lax',
		httpOnly: true,
		maxAge: 60 * 10 // 10 min
	});

	redirect(302, url.toString());
}
