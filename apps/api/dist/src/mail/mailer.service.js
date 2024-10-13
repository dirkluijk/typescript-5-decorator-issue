import { inject, injectable } from "@needle-di/core";
import { ConfigService } from "../lib/configs/config.service";
import { DevMailerService } from "./dev-mailer.service";
import { ProdMailerService } from "./prod-mailer.service";
@injectable()
export class MailerService {
    configs;
    prodMailer;
    devMailer;
    mailer;
    constructor(configs = inject(ConfigService), prodMailer = inject(ProdMailerService), devMailer = inject(DevMailerService)) {
        this.configs = configs;
        this.prodMailer = prodMailer;
        this.devMailer = devMailer;
        this.mailer = this.configs.envs.IS_PRODUCTION ? this.prodMailer : this.devMailer;
    }
    async send(data) {
        await this.mailer.send(data);
    }
}
