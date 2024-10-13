import { injectable } from "@needle-di/core";
import { z } from "zod";
const envSchema = z.object({
    DATABASE_URL: z.string(),
    REDIS_URL: z.string(),
    IS_PRODUCTION: z.number({ coerce: true }),
    PORT: z.number({ coerce: true }),
});
@injectable()
export class ConfigService {
    envs;
    constructor() {
        this.envs = this.parse();
    }
    parse() {
        return envSchema.parse(process.env);
    }
    validateEnvs() {
        try {
            return envSchema.parse(process.env);
        }
        catch (err) {
            if (err instanceof z.ZodError) {
                const { fieldErrors } = err.flatten();
                const errorMessage = Object.entries(fieldErrors)
                    .map(([field, errors]) => errors ? `${field}: ${errors.join(", ")}` : field)
                    .join("\n  ");
                throw new Error(`Missing environment variables:\n  ${errorMessage}`);
            }
        }
    }
}
