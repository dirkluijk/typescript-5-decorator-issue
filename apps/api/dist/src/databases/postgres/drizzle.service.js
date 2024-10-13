import Pool from "pg-pool";
import { inject, injectable } from "@needle-di/core";
import { drizzle } from "drizzle-orm/node-postgres";
import { ConfigService } from "../../lib/configs/config.service";
@injectable()
export class DrizzleService {
    configService;
    db;
    constructor(configService = inject(ConfigService)) {
        this.configService = configService;
        this.db = drizzle(new Pool({
            connectionString: this.configService.envs.DATABASE_URL,
        }));
    }
}
