import { inject, injectable } from "@needle-di/core";
import { AccountsRepository } from "./accounts.repository";
import { ProfilesRepository } from "./profiles.repository";
import { DrizzleService } from "../databases/postgres/drizzle.service";
@injectable()
export class UsersService {
    accountRepository;
    profilesRepository;
    drizzle;
    constructor(accountRepository = inject(AccountsRepository), profilesRepository = inject(ProfilesRepository), drizzle = inject(DrizzleService)) {
        this.accountRepository = accountRepository;
        this.profilesRepository = profilesRepository;
        this.drizzle = drizzle;
    }
    create(createUserDto) {
        return this.drizzle.db.transaction(async (trx) => {
            const account = await this.accountRepository.create(createUserDto, trx);
            const profile = await this.profilesRepository.create({ id: account.id }, trx);
            return { account, profile };
        });
    }
}
