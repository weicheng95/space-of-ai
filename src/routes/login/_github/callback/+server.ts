// // routes/login/github/callback/+server.ts
// import { OAuth2RequestError } from 'arctic';
// import { generateId } from 'lucia';
// import { github, initLucia } from '$lib/auth';
// import type { RequestEvent } from '@sveltejs/kit';
// import { userTable } from '$lib/drizzle/schema';
// import { eq } from 'drizzle-orm';

// export async function GET(event: RequestEvent): Promise<Response> {
// 	const code = event.url.searchParams.get('code');
// 	const state = event.url.searchParams.get('state');
// 	const storedState = event.cookies.get('github_oauth_state') ?? null;

// 	console.log(code, state, storedState);
// 	if (!code || !state || !storedState || state !== storedState) {
// 		return new Response(null, {
// 			status: 400
// 		});
// 	}

// 	try {
// 		const { lucia } = initLucia(event.locals.DB_SUPABASE);
// 		console.log('got lucia');
// 		const tokens = await github.validateAuthorizationCode(code);
// 		console.log('got tokens');
// 		const githubUserResponse = await fetch('https://api.github.com/user', {
// 			headers: {
// 				Authorization: `Bearer ${tokens.accessToken}`,
// 				'User-Agent': 'spaceofai'
// 			}
// 		});
// 		console.log('got githubuserresponse');
// 		console.log(githubUserResponse.status, githubUserResponse.statusText);
// 		if (githubUserResponse.status === 200) {
// 			const githubUser: GitHubUser = await githubUserResponse.json();
// 			console.log('got githubuser');
// 			// Replace this with your own DB client.
// 			const existingUser = await event.locals.DB_SUPABASE
// 				.select()
// 				.from(userTable)
// 				.where(eq(userTable.id, githubUser.id.toString()));

// 			if (existingUser && existingUser[0]) {
// 				const session = await lucia.createSession(existingUser[0].id, {});
// 				const sessionCookie = lucia.createSessionCookie(session.id);
// 				event.cookies.set(sessionCookie.name, sessionCookie.value, {
// 					path: '.',
// 					...sessionCookie.attributes
// 				});
// 			} else {
// 				console.log('add new users');
// 				const userId = generateId(15);
// 				// Replace this with your own DB client.
// 				await event.locals.DB_SUPABASE
// 					.insert(userTable)
// 					.values({
// 						id: userId,
// 						// githubId: githubUser.id,
// 						username: githubUser.login
// 					});

// 				const session = await lucia.createSession(userId, {});
// 				const sessionCookie = lucia.createSessionCookie(session.id);
// 				event.cookies.set(sessionCookie.name, sessionCookie.value, {
// 					path: '.',
// 					...sessionCookie.attributes
// 				});
// 			}
// 			return new Response(null, {
// 				status: 302,
// 				headers: {
// 					Location: '/'
// 				}
// 			});
// 		} else {
// 			console.log(await githubUserResponse.text());
// 			// invalid code
// 			return new Response(null, {
// 				status: 400
// 			});
// 		}
// 	} catch (e) {
// 		console.log(e);
// 		// the specific error message depends on the provider
// 		if (e instanceof OAuth2RequestError) {
// 			// invalid code
// 			return new Response(null, {
// 				status: 400
// 			});
// 		}
// 		return new Response(null, {
// 			status: 500
// 		});
// 	}
// }

// interface GitHubUser {
// 	id: number;
// 	login: string;
// }
