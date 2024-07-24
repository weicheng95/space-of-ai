generate-pg:
	pnpm drizzle-kit generate:pg --schema src/lib/drizzle --out src/lib/drizzle/migrations

migrate-pg:
	npx tsx src/lib/drizzle/index.ts

generate-supabase-type:
	supabase gen types typescript --project-id cgksdnvulpropvqcoovp > database.types.ts
# init-db:
# 	npx wrangler d1 execute ai-aggregator --local --file=./d1/2024032202_init.sql

# generate-schema:
# 	pnpm drizzle-kit generate:sqlite --schema src/lib/drizzle --out src/lib/drizzle/migrations


# apply-migrations:
# 	npx wrangler d1 migrations apply ai-aggregator

# # this is really for fucking remote
# migrate-remote:
# 	npx wrangler d1 migrations apply ai-aggregator

# # this is for local only
# migrate-local:
# 	npx wrangler d1 execute --file ./d1/2024032202_init.sql

debug:
	wrangler pages deployment tail --project-name spaceofai