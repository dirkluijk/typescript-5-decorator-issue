import { inject, injectable } from "@needle-di/core";
import { DrizzleService } from "../databases/postgres/drizzle.service";
import { takeFirst, takeFirstOrThrow } from "../lib/utils/repository";
import { eq } from "drizzle-orm";
import { NotFound } from "../lib/utils/exceptions";
import { accountsTable } from "./tables/accounts.table";
@injectable()
export class AccountsRepository {
    drizzle;
    constructor(drizzle = inject(DrizzleService)) {
        this.drizzle = drizzle;
    }
    findOneById(id, db = this.drizzle.db) {
        return db.select().from(accountsTable).where(eq(accountsTable.id, id)).then(takeFirst);
    }
    findOneByEmail(email, db = this.drizzle.db) {
        return db.select().from(accountsTable).where(eq(accountsTable.email, email))
            .then(takeFirst);
    }
    async findOneByIdOrThrow(id, db = this.drizzle.db) {
        const user = await this.findOneById(id, db);
        if (!user)
            throw NotFound("User not found");
        return user;
    }
    create(data, db = this.drizzle.db) {
        return db.insert(accountsTable).values(data).returning().then(takeFirstOrThrow);
    }
}
