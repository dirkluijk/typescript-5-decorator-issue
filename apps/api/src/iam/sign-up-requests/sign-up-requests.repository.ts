import { inject, injectable } from "@needle-di/core";
import { RedisService } from "../../databases/redis/redis.service";
import {
  type SignUpRequestDto,
  signUpRequestDto,
} from "./dtos/sign-up-request.dto";

@injectable()
export class SignUpRequestsRepository {
  private prefix = "sign-up-requests";

  constructor(private redis = inject(RedisService)) {}

  async findOneByEmail(email: string) {
    const data = await this.redis.get({
      prefix: this.prefix,
      key: email.toLowerCase(),
    });
    if (!data) return null;
    return signUpRequestDto.parse({
      email,
      ...JSON.parse(data),
    });
  }

  async create(data: SignUpRequestDto, expiry: number) {
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

  delete(email: string) {
    return this.redis.delete({ prefix: this.prefix, key: email.toLowerCase() });
  }
}
