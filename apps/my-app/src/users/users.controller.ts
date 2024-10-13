import { inject, injectable } from "@needle-di/core";
import { UsersService } from "./users.service";
import { Controller } from "../lib/interfaces/controller.interface";

@injectable()
export class UsersController extends Controller {
  constructor(private usersService = inject(UsersService)) {
    super()
  }

  routes() {
    return this.controller.get('/', c => {
      return c.json({ message: 'Hello World' })
    })
  }
}