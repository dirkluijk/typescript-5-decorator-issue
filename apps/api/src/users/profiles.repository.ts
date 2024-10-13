import { inject, injectable } from "@needle-di/core";
import { DrizzleService } from "../databases/postgres/drizzle.service.js";
import { profilesTable } from "./tables/profiles.table.js";
import { eq, InferInsertModel } from "drizzle-orm";
import { takeFirst } from "../lib/utils/repository.js";

type Create = Pick<InferInsertModel<typeof profilesTable>, "id">;

@injectable()
export class ProfilesRepository {
  constructor(private drizzle = inject(DrizzleService)) {}

  findOneById(id: string, db = this.drizzle.db) {
    return db.select().from(profilesTable).where(
      eq(profilesTable.id, id),
    ).then(takeFirst);
  }

  create(data: Create, db = this.drizzle.db) {
    return db.insert(profilesTable).values(data).returning();
  }
}
