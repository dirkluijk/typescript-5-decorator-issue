import { inject, injectable } from "@needle-di/core";
import { ConfigService } from "./lib/configs/config.service.js";
import { ApplicationController } from "./application.controller.js";
import { serve } from "@hono/node-server";

@injectable()
export class ApplicationModule {
  constructor(
    private applicationController = inject(ApplicationController),
    private configService = inject(ConfigService),
  ) {}

  start() {
    serve({
      port: this.configService.envs.PORT,
      fetch: this.applicationController.registerControllers().fetch,
    });
    this.onApplicationStartup();

    // application shutdown
    process.on("SIGINT", this.onApplicationShutdown);
    process.on("SIGTERM", this.onApplicationShutdown);

    // Boom - science, bitch.
    console.log(`Listening on port ${this.configService.envs.PORT}`);
  }

  private onApplicationStartup() {
    console.log("Starting...");
    // validate configs
    this.configService.validateEnvs();
  }

  private onApplicationShutdown() {
    console.log("Shutting down...");
    process.exit();
  }
}
