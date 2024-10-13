import { inject, injectable } from "@needle-di/core";
import { UsersService } from "./users.service";
import { Controller } from "../lib/interfaces/controller.interface";
@injectable()
export class UsersController extends Controller {
    usersService;
    constructor(usersService = inject(UsersService)) {
        super();
        this.usersService = usersService;
    }
    routes() {
        return this.controller.get('/', c => {
            return c.json({ message: 'Hello World' });
        });
    }
}
