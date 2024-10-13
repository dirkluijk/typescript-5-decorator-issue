import { inject, injectable } from "@needle-di/core";
import { UsersController } from "./users/users.controller";
import { IamController } from "./iam/iam.controller";
import { RootController } from "./lib/interfaces/controller.interface";

@injectable()
export class ApplicationController extends RootController {
  constructor(
    private usersController = inject(UsersController),
    private iamController = inject(IamController),
  ) {
    super();
  }

  routes() {
    return this.controller.get("/", (c) => {
      return c.json({ message: "Hello World!" });
    });
  }

  registerControllers() {
    return this.controller
      .route("/", this.routes())
      .route("/iam", this.iamController.routes())
      .route("/users", this.usersController.routes());
  }
}
