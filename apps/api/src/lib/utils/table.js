import { customType, timestamp } from "drizzle-orm/pg-core";
export const citext = customType({
    dataType() {
        return "citext";
    },
});
export const cuid2 = customType({
    dataType() {
        return "text";
    },
});
export const timestamps = {
    createdAt: timestamp("created_at", {
        mode: "date",
        withTimezone: true,
    })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", {
        mode: "date",
        withTimezone: true,
    })
        .notNull()
        .defaultNow(),
};
