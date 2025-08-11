CREATE TABLE "automations" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" varchar(255) NOT NULL,
	"installation_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"event_type" varchar(64),
	"name" varchar(512),
	"source_repo" varchar(255) NOT NULL,
	"source_branch" varchar(255) NOT NULL,
	"target_repo" varchar(255),
	"target_branch" varchar(255),
	"active" boolean DEFAULT false NOT NULL,
	"description" varchar(512),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "github_installations" (
	"installation_id" varchar(255) PRIMARY KEY NOT NULL,
	"account_slug" varchar(255),
	"installed_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"installed_by_user_id" varchar(255) NOT NULL,
	"installed_on_org_id" varchar(255) NOT NULL,
	"installed_on_type" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"clerk_org_id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"clerk_user_id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "automations" ADD CONSTRAINT "automations_org_id_organizations_clerk_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("clerk_org_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automations" ADD CONSTRAINT "automations_installation_id_github_installations_installation_id_fk" FOREIGN KEY ("installation_id") REFERENCES "public"."github_installations"("installation_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automations" ADD CONSTRAINT "automations_user_id_users_clerk_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("clerk_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_installations" ADD CONSTRAINT "github_installations_installed_by_user_id_users_clerk_user_id_fk" FOREIGN KEY ("installed_by_user_id") REFERENCES "public"."users"("clerk_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_installations" ADD CONSTRAINT "github_installations_installed_on_org_id_organizations_clerk_org_id_fk" FOREIGN KEY ("installed_on_org_id") REFERENCES "public"."organizations"("clerk_org_id") ON DELETE no action ON UPDATE no action;