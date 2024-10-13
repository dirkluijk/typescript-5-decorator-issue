import { inject, injectable } from '@needle-di/core';
import { ConfigService } from './lib/configs/config.service';
import { ApplicationController } from './application.controller';
import { serve } from '@hono/node-server';

@injectable()
export class ApplicationModule {
  applicationController;
  configService;
  constructor(
    applicationController = inject(ApplicationController),
    configService = inject(ConfigService)
  ) {
    this.applicationController = applicationController;
    this.configService = configService;
  }
  start() {
    serve({
      port: this.configService.envs.PORT,
      fetch: this.applicationController.registerControllers().fetch
    });
    this.onApplicationStartup();
    // application shutdown
    process.on('SIGINT', this.onApplicationShutdown);
    process.on('SIGTERM', this.onApplicationShutdown);
    // Boom - science, bitch.
    console.log(`Listening on port ${this.configService.envs.PORT}`);
  }
  onApplicationStartup() {
    console.log('Starting...');
    // validate configs
    this.configService.validateEnvs();
  }
  onApplicationShutdown() {
    console.log('Shutting down...');
    process.exit();
  }
}
