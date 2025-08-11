ALTER TABLE "automation_prs" ALTER COLUMN "commit_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "automation_prs" ALTER COLUMN "pr_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "automation_prs" ALTER COLUMN "pr_title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "automation_prs" ALTER COLUMN "pr_description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "automation_prs" ADD COLUMN "status" varchar(32) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "automation_prs" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;