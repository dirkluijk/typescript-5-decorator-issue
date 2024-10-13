import { inject, injectable } from "@needle-di/core";
import { AccountsRepository } from "../users/accounts.repository";
import { HashingService } from "./hashing.service";
import { BadRequest } from "../lib/utils/exceptions";
import { UsersService } from "../users/users.service";
import { MailerService } from "../mail/mailer.service";
import { WelcomeEmail } from "../mail/templates/welcome.template";
import { SessionsService } from "./sessions/sessions.service";
import { SignUpRequestsService } from "./sign-up-requests/sign-up-requests.service";
import { LoginVerificationEmail } from "../mail/templates/login-verification.template";
@injectable()
export class IamService {
    accountRepository;
    sessionsService;
    usersService;
    signUpRequestsService;
    hashingService;
    mailerService;
    constructor(accountRepository = inject(AccountsRepository), sessionsService = inject(SessionsService), usersService = inject(UsersService), signUpRequestsService = inject(SignUpRequestsService), hashingService = inject(HashingService), mailerService = inject(MailerService)) {
        this.accountRepository = accountRepository;
        this.sessionsService = sessionsService;
        this.usersService = usersService;
        this.signUpRequestsService = signUpRequestsService;
        this.hashingService = hashingService;
        this.mailerService = mailerService;
    }
    async requestSignUp(passwordSignupDto) {
        const { email, password } = passwordSignupDto;
        const existingEmail = await this.accountRepository.findOneByEmail(email);
        if (existingEmail)
            throw BadRequest("Email already exists");
        const { verificationCode } = await this.signUpRequestsService.create({
            email,
            password,
        });
        this.mailerService.send({
            to: email,
            template: new LoginVerificationEmail(verificationCode),
        });
    }
    async verifySignUp(passwordSignUpVerifyDto) {
        const { email, code } = passwordSignUpVerifyDto;
        // Find the valid request by email and code
        const validSignUpRequest = await this.signUpRequestsService
            .findValidRequest(email, code);
        // If no request is found, throw an error
        if (!validSignUpRequest)
            throw BadRequest("Invalid verification code");
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
    async signIn(passwordSignInDto) {
        const { email, password } = passwordSignInDto;
        // Find the account by email
        const account = await this.accountRepository.findOneByEmail(email);
        if (!account)
            throw BadRequest("Invalid credentials");
        // Compare the password from the request with the hashed password from the database
        const isValid = await this.hashingService.compare(password, account.hashedPassword);
        if (!isValid)
            throw BadRequest("Invalid credentials");
        // Create a new session
        const sessionToken = this.sessionsService.generateSessionToken();
        const session = this.sessionsService.createSession(sessionToken, account.id);
        // Return session to be set as a cookie
        return session;
    }
}
