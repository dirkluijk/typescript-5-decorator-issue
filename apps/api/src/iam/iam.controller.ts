import { inject, injectable } from "@needle-di/core";
import { Controller } from "../lib/interfaces/controller.interface";
import { zValidator } from "@hono/zod-validator";
import { passwordSignUpDto } from "./dtos/password-sign-up.dto";
import { IamService } from "./iam.service";
import { setCookie } from "hono/cookie";
import { passwordSignUpVerifyDto } from "./dtos/password-sign-up-verify.dto";

@injectable()
export class IamController extends Controller {
  constructor(
    private authenticationService = inject(IamService),
  ) {
    super();
  }

  routes() {
    return this.controller
      .post(
        "/sign-up/request",
        zValidator("json", passwordSignUpDto),
        async (c) => {
          await this.authenticationService.requestSignUp(c.req.valid("json"));
          return c.json({ message: "welcome" });
        },
      )
      .post(
        "/sign-up/verify",
        zValidator("json", passwordSignUpVerifyDto),
        async (c) => {
          await this.authenticationService.verifySignUp(c.req.valid("json"));
          return c.json({ message: "welcome" });
        },
      )
      .post("/sign-in", zValidator("json", passwordSignUpDto), async (c) => {
        const session = await this.authenticationService.signIn(
          c.req.valid("json"),
        );
        setCookie(c, "session", session.id, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          expires: session.expiresAt,
        });
        return c.json({ message: "success" });
      });
  }
}
