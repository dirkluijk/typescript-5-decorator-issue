import { inject, injectable } from "@needle-di/core";
import type { CreateUserDto } from "./dtos/create-user.dto.js";
import { AccountsRepository } from "./accounts.repository.js";
import { ProfilesRepository } from "./profiles.repository.js";
import { DrizzleService } from "../databases/postgres/drizzle.service.js";

@injectable()
export class UsersService {
  constructor(
    private accountRepository = inject(AccountsRepository),
    private profilesRepository = inject(ProfilesRepository),
    private drizzle = inject(DrizzleService),
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.drizzle.db.transaction(async (trx) => {
      const account = await this.accountRepository.create(createUserDto, trx);
      const profile = await this.profilesRepository.create(
        { id: account.id },
        trx,
      );
      return { account, profile };
    });
  }
}
