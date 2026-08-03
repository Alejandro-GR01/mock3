CREATE TYPE "public"."plan" AS ENUM('free', 'pro');--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"key_hash" varchar(255) NOT NULL,
	"key_prefix" varchar(10) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255),
	"path" varchar(255) NOT NULL,
	"methods" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mocks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "request_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"mock_id" uuid NOT NULL,
	"method" varchar(10) NOT NULL,
	"ip_address" varchar(45),
	"user_agent" varchar(500),
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"email" varchar(255),
	"plan" "plan" DEFAULT 'free' NOT NULL,
	"max_slots" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mocks" ADD CONSTRAINT "mocks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_logs" ADD CONSTRAINT "request_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_logs" ADD CONSTRAINT "request_logs_mock_id_mocks_id_fk" FOREIGN KEY ("mock_id") REFERENCES "public"."mocks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_request_logs_user_time" ON "request_logs" USING btree ("user_id","timestamp");