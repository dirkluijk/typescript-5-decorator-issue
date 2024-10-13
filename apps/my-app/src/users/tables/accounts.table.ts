import { pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { citext, timestamps } from "../../lib/utils/table.ts";
import { profilesTable } from "./profiles.table.ts";

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  email: citext("email").notNull(),
  hashedPassword: text("hashed_password").notNull(),
  ...timestamps,
});

export const accountsTableRelations = relations(accountsTable, ({ one }) => ({
  profile: one(profilesTable, {
    fields: [accountsTable.id],
    references: [profilesTable.id],
  }),
}));
