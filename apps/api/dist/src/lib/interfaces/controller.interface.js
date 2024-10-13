import { createHono } from "../utils/controller";
export class Controller {
    controller;
    constructor() {
        this.controller = createHono();
    }
}
export class RootController extends Controller {
}
