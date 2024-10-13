import { inject, injectable } from "@needle-di/core";
import { SignUpRequestsRepository } from "./sign-up-requests.repository";
import { VerificationCodesService } from "../verification-codes.service";
import { HashingService } from "../hashing.service";
@injectable()
export class SignUpRequestsService {
    signUpRequestsRepository;
    hashingService;
    tokensService;
    constructor(signUpRequestsRepository = inject(SignUpRequestsRepository), hashingService = inject(HashingService), tokensService = inject(VerificationCodesService)) {
        this.signUpRequestsRepository = signUpRequestsRepository;
        this.hashingService = hashingService;
        this.tokensService = tokensService;
    }
    burnRequest(email) {
        this.signUpRequestsRepository.delete(email);
    }
    async findValidRequest(email, code) {
        // Find the request by email
        const results = await this.signUpRequestsRepository.findOneByEmail(email);
        if (!results)
            return null;
        // Verify the code
        const isValid = await this.tokensService.verify({
            verificationCode: code,
            hashedVerificationCode: results.hashedCode,
        });
        if (!isValid)
            return null;
        // Return valid request
        return results;
    }
    async create(data) {
        // delete any existing requests
        this.burnRequest(data.email);
        // generate a new token
        const { verificationCode, hashedVerificationCode } = await this
            .tokensService
            .generateWithHash();
        const hashedPassword = await this.hashingService.hash(data.password);
        // create a new request
        await this.signUpRequestsRepository.create({
            email: data.email,
            hashedCode: hashedVerificationCode,
            hashedPassword,
        }, 60 * 15);
        return { verificationCode };
    }
}
