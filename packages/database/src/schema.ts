import {
  boolean as boolean_,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  clerkUserId: varchar("clerk_user_id", { length: 255 }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const organizations = pgTable("organizations", {
  clerkOrgId: varchar("clerk_org_id", { length: 255 }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const githubInstallations = pgTable("github_installations", {
  installationId: varchar("installation_id", { length: 255 }).primaryKey(),
  accountSlug: varchar("account_slug", { length: 255 }),
  installedAt: timestamp("installed_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  installedByUserId: varchar("installed_by_user_id", { length: 255 })
    .notNull()
    .references(() => users.clerkUserId),
  installedOnOrgId: varchar("installed_on_org_id", { length: 255 })
    .notNull()
    .references(() => organizations.clerkOrgId),
  installedOnType: varchar("installed_on_type", { length: 32 }).notNull(),
});

export const automations = pgTable("automations", {
  id: varchar("id", { length: 32 }).primaryKey(), // Ahora es string
  orgId: varchar("org_id", { length: 255 })
    .notNull()
    .references(() => organizations.clerkOrgId),
  installationId: varchar("installation_id", { length: 255 })
    .notNull()
    .references(() => githubInstallations.installationId),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.clerkUserId),
  eventType: varchar("event_type", { length: 64 }).default("push"), // e.g., "push", "pull_request"
  name: varchar("name", { length: 512 }),
  sourceRepo: varchar("source_repo", { length: 255 }).notNull(),
  sourceBranch: varchar("source_branch", { length: 255 }).default("main"),
  targetRepo: varchar("target_repo", { length: 255 }),
  targetBranch: varchar("target_branch", { length: 255 }).default("main"),
  targetFolder: varchar("target_folder", { length: 255 }).default("docs"),
  active: boolean_("active").notNull().default(false),
  // conditions: jsonb("conditions"), // Optional JSON field for conditions advanced
  description: varchar("description", { length: 512 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const automationPrs = pgTable("automation_prs", {
  id: serial("id").primaryKey(),
  sourceRepo: text("source_repo").notNull(),
  sourceBranch: text("source_branch").notNull(),
  targetRepo: text("target_repo").notNull(),
  targetBranch: text("target_branch").notNull(),
  commitUrl: text("commit_url"),
  prUrl: text("pr_url"),
  prTitle: text("pr_title"),
  prDescription: text("pr_description"),
  status: varchar("status", { length: 32 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  automationId: varchar("automation_id", { length: 32 })
    .references(() => automations.id)
    .notNull(),
});
