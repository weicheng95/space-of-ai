CREATE INDEX ON products (status_type);

CREATE INDEX ON products (created_at DESC) STORING (name, url, icon_url, description, category_id);

CREATE INDEX ON drizzle.__drizzle_migrations (created_at DESC) STORING (hash);

DROP INDEX products @category_idx;

CREATE INDEX ON products (category_id) STORING (name, url, icon_url, description);