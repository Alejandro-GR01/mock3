-- Partial unique indexes: only active mocks enforce uniqueness
-- Soft-deleted mocks (is_active=false) are excluded, so names/paths can be reused after deletion

CREATE UNIQUE INDEX "uq_mock_name_active" ON "mocks" ("user_id", "name") WHERE "is_active" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_mock_path_active" ON "mocks" ("user_id", "path") WHERE "is_active" = true;
