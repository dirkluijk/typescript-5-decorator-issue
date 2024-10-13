import { inject, injectable } from "@needle-di/core";
import { RedisService } from "../../databases/redis/redis.service";
import { signUpRequestDto, } from "./dtos/sign-up-request.dto";
@injectable()
export class SignUpRequestsRepository {
    redis;
    prefix = "sign-up-requests";
    constructor(redis = inject(RedisService)) {
        this.redis = redis;
    }
    async findOneByEmail(email) {
        const data = await this.redis.get({
            prefix: this.prefix,
            key: email.toLowerCase(),
        });
        if (!data)
            return null;
        return signUpRequestDto.parse({
            email,
            ...JSON.parse(data),
        });
    }
    async create(data, expiry) {
        await this.redis.setWithExpiry({
            prefix: this.prefix,
            key: data.email.toLowerCase(),
            value: JSON.stringify({
                hashedCode: data.hashedCode,
                hashedPassword: data.hashedPassword,
            }),
            expiry,
        });
    }
    delete(email) {
        return this.redis.delete({ prefix: this.prefix, key: email.toLowerCase() });
    }
}
