import { inject, injectable } from "@needle-di/core";
import { SignUpRequestsRepository } from "./sign-up-requests.repository.ts";
import type { PasswordSignUpDto } from "../dtos/password-sign-up.dto.ts";
import { VerificationCodesService } from "../verification-codes.service";
import { HashingService } from "../hashing.service";

@injectable()
export class SignUpRequestsService {
  constructor(
    private signUpRequestsRepository = inject(SignUpRequestsRepository),
    private hashingService = inject(HashingService),
    private tokensService = inject(VerificationCodesService),
  ) {}

  burnRequest(email: string) {
    this.signUpRequestsRepository.delete(email);
  }

  async findValidRequest(email: string, code: string) {
    // Find the request by email
    const results = await this.signUpRequestsRepository.findOneByEmail(email);
    if (!results) return null;

    // Verify the code
    const isValid = await this.tokensService.verify({
      verificationCode: code,
      hashedVerificationCode: results.hashedCode,
    });
    if (!isValid) return null;

    // Return valid request
    return results;
  }

  async create(data: PasswordSignUpDto) {
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
