import { sql } from 'drizzle-orm';
import {
	pgTable,
	serial,
	text,
	json,
	uuid,
	timestamp,
	index,
	unique,
	integer
} from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
	id: integer('id').primaryKey(),
	created_at: timestamp('created_at').defaultNow(),
	name: text('name')
});

export const products = pgTable(
	'products',
	{
		id: uuid('id')
			.default(sql`uuid_v4()::UUID`)
			.primaryKey(),
		created_at: timestamp('created_at').defaultNow(),
		name: text('name'),
		url: text('url'),
		website_image_url: text('website_image_url'),
		icon_url: text('icon_url'),
		meta: json('meta'),
		description: text('description'),
		subcategory: json('subcategory'),
		last_refreshed_at: timestamp('last_refreshed_at').defaultNow(),
		status_type: text('status_type').default('active'),
		owner: text('owner'),
		category_id: integer('category_id').references(() => categories.id)
	},
	(table) => {
		return {
			categoryIdx: index('category_idx').on(table.category_id)
		};
	}
);

export const userTable = pgTable('user', {
	id: text('id').notNull().primaryKey(),
	username: text('username').unique(),
	image: text('image')
});

export const sessionTable = pgTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at').notNull()
});

export const oauthAccountTable = pgTable(
	'oauth_account',
	{
		id: integer('id').notNull().primaryKey(),
		provider_id: text('provider_id'),
		provider_user_id: text('provider_user_id').notNull(),
		user_id: text('user_id')
			.notNull()
			.references(() => userTable.id)
	},
	(t) => ({
		unq: unique().on(t.id, t.provider_id)
	})
);

export const productRankingTabe = pgTable(
	'product_ranking',
	{
		id: integer('id').notNull().primaryKey(),
		created_at: timestamp('created_at').defaultNow(),
		product_id: uuid('product_id')
			.notNull()
			.references(() => products.id),
		rank: integer('rank').notNull()
	},
	(table) => {
		return {
			productIdx: index('product_idx').on(table.product_id)
		};
	}
);
