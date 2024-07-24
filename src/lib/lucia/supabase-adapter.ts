import type { Database } from '$lib/database.types';
import type { Adapter, DatabaseSession, DatabaseUser, UserId } from 'lucia';
import type { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseJSDBAdapter implements Adapter {
	private supabase: SupabaseClient<Database>;

	constructor(supabase: SupabaseClient<Database>) {
		this.supabase = supabase;
	}

	public async deleteSession(sessionId: string): Promise<void> {
		await this.supabase.from('session').delete().eq('id', sessionId);
	}

	public async deleteUserSessions(userId: UserId): Promise<void> {
		await this.supabase.from('session').delete().eq('user_id', userId);
	}

	public async getSessionAndUser(
		sessionId: string
	): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
		const { data } = await this.supabase
			.from('session')
			.select('*, user(id, username, image)')
			.eq('id', sessionId)
			.single();

		if (!data) return [null, null];
		return [transformIntoDatabaseSession(data), transformIntoDatabaseUser(data.user)];
	}

	public async getUserSessions(userId: UserId): Promise<DatabaseSession[]> {
		const { data } = await this.supabase.from('session').select('*').eq('user_id', userId);

		if (!data) return [];
		return data.map((val) => {
			return transformIntoDatabaseSession(val);
		});
	}

	public async setSession(session: DatabaseSession): Promise<void> {
		await this.supabase.from('session').insert({
			id: session.id,
			user_id: session.userId,
			expires_at: session.expiresAt as any,
			...session.attributes
		});
	}

	public async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
		await this.supabase
			.from('session')
			.update({ expires_at: expiresAt.getTime().toString() })
			.eq('id', sessionId);
	}

	public async deleteExpiredSessions(): Promise<void> {
		await this.supabase.from('session').delete().gte('expires_at', new Date().getTime().toString());
	}
}

function transformIntoDatabaseSession(raw: any): DatabaseSession {
	const { id, user_id, expires_at, ...attributes } = raw;
	return {
		userId: user_id,
		id,
		expiresAt: new Date(expires_at),
		attributes
	};
}

function transformIntoDatabaseUser(raw: any): DatabaseUser {
	const { id, ...attributes } = raw;
	return {
		id,
		attributes
	};
}
