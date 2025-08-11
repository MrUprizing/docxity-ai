CREATE TABLE "automation_prs" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_repo" text NOT NULL,
	"source_branch" text NOT NULL,
	"target_repo" text NOT NULL,
	"target_branch" text NOT NULL,
	"commit_url" text NOT NULL,
	"pr_url" text NOT NULL,
	"pr_title" text NOT NULL,
	"pr_description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"automation_id" varchar(32) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "automation_prs" ADD CONSTRAINT "automation_prs_automation_id_automations_id_fk" FOREIGN KEY ("automation_id") REFERENCES "public"."automations"("id") ON DELETE no action ON UPDATE no action;