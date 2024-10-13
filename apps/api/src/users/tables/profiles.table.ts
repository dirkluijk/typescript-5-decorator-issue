import { pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../../lib/utils/table.js";
import { relations } from "drizzle-orm";
import { accountsTable } from "./accounts.table.js";

export const profilesTable = pgTable("profiles", {
  id: text("id").primaryKey().references(() => accountsTable.id),
  avatar: text("avatar"),
  ...timestamps,
});

export const profilesTableRelations = relations(profilesTable, ({ one }) => ({
  account: one(accountsTable, {
    fields: [profilesTable.id],
    references: [accountsTable.id],
  }),
}));
