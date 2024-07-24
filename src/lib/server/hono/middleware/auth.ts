import { initLucia } from '$lib/auth';
import { supabase } from '$lib/supabaseClient';
import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';

export const guard = (): MiddlewareHandler => async (c, next) => {
	const { lucia } = initLucia(supabase);
	const sessionId = getCookie(c, lucia.sessionCookieName);
	if (!sessionId) {
		return c.json(
			{
				message: 'Unauthorized'
			},
			401
		);
	}

	const { session, user } = await lucia.validateSession(sessionId);

	if (!session) {
		return c.json(
			{
				message: 'Unauthorized'
			},
			401
		);
	}

	c.set('user', user);
	await next();
};
