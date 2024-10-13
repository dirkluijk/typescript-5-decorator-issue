import { inject, injectable } from "@needle-di/core";
import type { Mailer, SendProps } from "./interfaces/mailer.interface";
import { ConfigService } from "../lib/configs/config.service";
import { DevMailerService } from "./dev-mailer.service";
import { ProdMailerService } from "./prod-mailer.service";

@injectable()
export class MailerService implements Mailer {
  private mailer: Mailer
  constructor(
    private configs = inject(ConfigService),
    private prodMailer = inject(ProdMailerService),
    private devMailer = inject(DevMailerService),
  ) {
    this.mailer = this.configs.envs.IS_PRODUCTION ? this.prodMailer : this.devMailer;
  }

  async send(data: SendProps) {
    await this.mailer.send(data);
  }
}
