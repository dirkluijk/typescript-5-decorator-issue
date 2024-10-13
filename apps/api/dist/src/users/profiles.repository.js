import { inject, injectable } from "@needle-di/core";
import { DrizzleService } from "../databases/postgres/drizzle.service";
import { profilesTable } from "./tables/profiles.table";
import { eq } from "drizzle-orm";
import { takeFirst } from "../lib/utils/repository";
@injectable()
export class ProfilesRepository {
    drizzle;
    constructor(drizzle = inject(DrizzleService)) {
        this.drizzle = drizzle;
    }
    findOneById(id, db = this.drizzle.db) {
        return db.select().from(profilesTable).where(eq(profilesTable.id, id)).then(takeFirst);
    }
    create(data, db = this.drizzle.db) {
        return db.insert(profilesTable).values(data).returning();
    }
}
