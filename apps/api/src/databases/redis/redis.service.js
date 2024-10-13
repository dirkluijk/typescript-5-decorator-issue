import { Redis } from "ioredis";
import { inject, injectable } from "@needle-di/core";
import { ConfigService } from "../../lib/configs/config.service";
@injectable()
export class RedisService {
    configService;
    redis;
    constructor(configService = inject(ConfigService)) {
        this.configService = configService;
        this.redis = new Redis(this.configService.envs.REDIS_URL);
    }
    get(data) {
        return this.redis.get(`${data.prefix}:${data.key}`);
    }
    async set(data) {
        await this.redis.set(`${data.prefix}:${data.key}`, data.value);
    }
    async delete(data) {
        await this.redis.del(`${data.prefix}:${data.key}`);
    }
    async setWithExpiry(data) {
        await this.redis.set(`${data.prefix}:${data.key}`, data.value, "EX", Math.floor(data.expiry));
    }
}
