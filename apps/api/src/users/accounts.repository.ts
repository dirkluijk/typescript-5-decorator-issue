import { inject, injectable } from "@needle-di/core";
import { DrizzleService } from "../databases/postgres/drizzle.service";
import { takeFirst, takeFirstOrThrow } from "../lib/utils/repository";
import { eq, InferInsertModel } from "drizzle-orm";
import { NotFound } from "../lib/utils/exceptions";
import { accountsTable } from "./tables/accounts.table";

type Create = Pick<
  InferInsertModel<typeof accountsTable>,
  "email" | "hashedPassword"
>;

@injectable()
export class AccountsRepository {
  constructor(
    private drizzle = inject(DrizzleService),
  ) {}

  findOneById(id: string, db = this.drizzle.db) {
    return db.select().from(accountsTable).where(eq(accountsTable.id, id)).then(
      takeFirst,
    );
  }

  findOneByEmail(email: string, db = this.drizzle.db) {
    return db.select().from(accountsTable).where(eq(accountsTable.email, email))
      .then(
        takeFirst,
      );
  }

  async findOneByIdOrThrow(id: string, db = this.drizzle.db) {
    const user = await this.findOneById(id, db);
    if (!user) throw NotFound("User not found");
    return user;
  }

  create(data: Create, db = this.drizzle.db) {
    return db.insert(accountsTable).values(data).returning().then(
      takeFirstOrThrow,
    );
  }
}
