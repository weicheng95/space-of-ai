// routes/login/google/callback/+server.ts
import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { google, initLucia } from '$lib/auth';
import type { RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	const storedState = event.cookies.get('state') ?? null;
	const storedCodeVerifier = event.cookies.get('code_verifier') ?? null;

	console.log(code, state, storedState, storedCodeVerifier);
	if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const { lucia } = initLucia(supabase);
		console.log('got lucia');
		const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
		console.log('got tokens');
		const googleUserResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
				'User-Agent': 'spaceofai'
			}
		});
		console.log('got googleuserresponse');
		console.log(googleUserResponse.status, googleUserResponse.statusText);

		if (googleUserResponse.status !== 200) {
			console.log(await googleUserResponse.text());
			// invalid code
			return new Response(null, {
				status: 400
			});
		}

		const googleUser: googleUser = await googleUserResponse.json();
		const { data: existingAccount } = await supabase
			.from('oauth_account')
			.select("*")
			.eq('provider_id', 'google')
			.eq('provider_user_id', googleUser.id)
			.single();

		if (existingAccount) {
			const session = await lucia.createSession(existingAccount.user_id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			console.log('add new users');
			const userId = generateId(15);
			const randomId = generateId(15);
			// Replace this with your own DB client.

			// cannot use transaction here because cloudflare will fuck 9 me
			await supabase.from('user').insert({
				id: userId,
				username: googleUser.name,
				image: googleUser.picture
			});

			await supabase.from('oauth_account').insert({
				id: randomId,
				provider_id: 'google',
				provider_user_id: googleUser.id,
				user_id: userId
			});
	
			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		console.log(e);
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			const { message, description } = e;
			// invalid code
			return new Response(
				JSON.stringify({
					message,
					description
				}),
				{
					status: 400
				}
			);
		}
		return new Response(null, {
			status: 500
		});
	}
}

interface googleUser {
	id: string;
	name: string;
	given_name: string;
	family_name: string;
	picture?: string;
	email: string;
	email_verified: true;
	locale: string;
}
