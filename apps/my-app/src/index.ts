import 'dotenv/config'
import { Container } from "@needle-di/core";
import { ApplicationModule } from "./application.module.js";

function bootstrap() {
  const container = new Container();
  const app = container.get(ApplicationModule);
  app.start();
}

bootstrap();
