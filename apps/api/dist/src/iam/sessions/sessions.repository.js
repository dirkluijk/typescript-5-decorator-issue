import { inject, injectable } from "@needle-di/core";
import { RedisService } from "../../databases/redis/redis.service";
@injectable()
export class SessionsRepository {
    redis;
    prefix = "session";
    constructor(redis = inject(RedisService)) {
        this.redis = redis;
    }
    findOneById(id) {
        return this.redis.get({ prefix: this.prefix, key: id });
    }
    delete(id) {
        return this.redis.delete({ prefix: this.prefix, key: id });
    }
    create(createSessionDto) {
        return this.redis.setWithExpiry({
            prefix: this.prefix,
            key: createSessionDto.id,
            value: JSON.stringify({
                id: createSessionDto.id,
                user_id: createSessionDto.userId,
            }),
            expiry: Math.floor(+createSessionDto.expiresAt / 1000),
        });
    }
}
