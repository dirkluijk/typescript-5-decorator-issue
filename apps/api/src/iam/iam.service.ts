import { inject, injectable } from "@needle-di/core";
import { AccountsRepository } from "../users/accounts.repository.js";
import type { PasswordSignUpDto } from "./dtos/password-sign-up.dto.js";
import { HashingService } from "./hashing.service.js";
import { BadRequest } from "../lib/utils/exceptions.js";
import { UsersService } from "../users/users.service.js";
import { MailerService } from "../mail/mailer.service.js";
import { WelcomeEmail } from "../mail/templates/welcome.template.js";
import { SessionsService } from "./sessions/sessions.service.js";
import type { PasswordSignUpVerifyDto } from "./dtos/password-sign-up-verify.dto.js";
import { SignUpRequestsService } from "./sign-up-requests/sign-up-requests.service.js";
import { LoginVerificationEmail } from "../mail/templates/login-verification.template.js";

@injectable()
export class IamService {
  constructor(
    private accountRepository = inject(AccountsRepository),
    private sessionsService = inject(SessionsService),
    private usersService = inject(UsersService),
    private signUpRequestsService = inject(SignUpRequestsService),
    private hashingService = inject(HashingService),
    private mailerService = inject(MailerService),
  ) {}

  async requestSignUp(passwordSignupDto: PasswordSignUpDto) {
    const { email, password } = passwordSignupDto;

    const existingEmail = await this.accountRepository.findOneByEmail(email);
    if (existingEmail) throw BadRequest("Email already exists");

    const { verificationCode } = await this.signUpRequestsService.create({
      email,
      password,
    });

    this.mailerService.send({
      to: email,
      template: new LoginVerificationEmail(verificationCode),
    });
  }

  async verifySignUp(passwordSignUpVerifyDto: PasswordSignUpVerifyDto) {
    const { email, code } = passwordSignUpVerifyDto;

    // Find the valid request by email and code
    const validSignUpRequest = await this.signUpRequestsService
      .findValidRequest(
        email,
        code,
      );

    // If no request is found, throw an error
    if (!validSignUpRequest) throw BadRequest("Invalid verification code");

    // Create a new user with the email and hashed password from the request
    await this.usersService.create({
      email,
      hashedPassword: validSignUpRequest.hashedPassword,
    });

    // Burn the request
    this.signUpRequestsService.burnRequest(email);

    // Delete the request from the database
    this.mailerService.send({
      to: validSignUpRequest.email,
      template: new WelcomeEmail(),
    });
  }

  async signIn(passwordSignInDto: PasswordSignUpDto) {
    const { email, password } = passwordSignInDto;

    // Find the account by email
    const account = await this.accountRepository.findOneByEmail(email);
    if (!account) throw BadRequest("Invalid credentials");

    // Compare the password from the request with the hashed password from the database
    const isValid = await this.hashingService.compare(
      password,
      account.hashedPassword,
    );
    if (!isValid) throw BadRequest("Invalid credentials");

    // Create a new session
    const sessionToken = this.sessionsService.generateSessionToken();
    const session = this.sessionsService.createSession(
      sessionToken,
      account.id,
    );
    // Return session to be set as a cookie
    return session;
  }
}
