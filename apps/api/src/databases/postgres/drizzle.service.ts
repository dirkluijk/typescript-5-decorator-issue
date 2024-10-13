import Pool from "pg-pool";
import * as drizzleSchema from "./drizzle-schema.js";
import { inject, injectable } from "@needle-di/core";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { ConfigService } from "../../lib/configs/config.service.js";

@injectable()
export class DrizzleService {
  public db: NodePgDatabase<typeof drizzleSchema>;
  constructor(private configService = inject(ConfigService)) {
    this.db = drizzle(
      new Pool({
        connectionString: this.configService.envs.DATABASE_URL,
      }),
    );
  }
}
