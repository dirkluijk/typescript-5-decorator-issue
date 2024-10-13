import { inject, injectable } from "@needle-di/core";
import { RedisService } from "../../databases/redis/redis.service";
import { createSessionDto } from "./dtos/session.dto.ts";

@injectable()
export class SessionsRepository {
  private readonly prefix = "session";
  constructor(private redis = inject(RedisService)) {}

  findOneById(id: string) {
    return this.redis.get({ prefix: this.prefix, key: id });
  }

  delete(id: string) {
    return this.redis.delete({ prefix: this.prefix, key: id });
  }

  create(createSessionDto: createSessionDto) {
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
