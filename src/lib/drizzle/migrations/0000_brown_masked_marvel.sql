CREATE TABLE IF NOT EXISTS "categories" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_account" (
	"id" integer PRIMARY KEY NOT NULL,
	"provider_id" text,
	"provider_user_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "oauth_account_id_provider_id_unique" UNIQUE("id","provider_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_ranking" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"product_id" uuid NOT NULL,
	"rank" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT uuid_v4()::UUID NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"name" text,
	"url" text,
	"website_image_url" text,
	"icon_url" text,
	"meta" json,
	"description" text,
	"subcategory" json,
	"last_refreshed_at" timestamp DEFAULT now(),
	"status_type" text DEFAULT 'active',
	"owner" text,
	"category_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text,
	"image" text,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_idx" ON "product_ranking" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "category_idx" ON "products" ("category_id");--> statement-breakpoint

ALTER TABLE "oauth_account" 
ADD CONSTRAINT IF NOT EXISTS "oauth_account_user_id_user_id_fk" 
FOREIGN KEY ("user_id") REFERENCES "user"("id") 
ON DELETE NO ACTION ON UPDATE NO ACTION;
--> statement-breakpoint

ALTER TABLE "product_ranking" 
ADD CONSTRAINT IF NOT EXISTS "product_ranking_product_id_products_id_fk" 
FOREIGN KEY ("product_id") REFERENCES "products"("id")
ON DELETE NO ACTION ON UPDATE NO ACTION;
--> statement-breakpoint

ALTER TABLE "products"
ADD CONSTRAINT IF NOT EXISTS "products_category_id_categories_id_fk"
FOREIGN KEY ("category_id") REFERENCES "categories"("id")
ON DELETE NO ACTION ON UPDATE NO ACTION;
--> statement-breakpoint

ALTER TABLE "session"
ADD CONSTRAINT IF NOT EXISTS "session_user_id_user_id_fk"
FOREIGN KEY ("user_id") REFERENCES "user"("id")
ON DELETE NO ACTION ON UPDATE NO ACTION;
--> statement-breakpoint
