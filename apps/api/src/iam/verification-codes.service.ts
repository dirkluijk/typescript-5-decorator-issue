import { inject, injectable } from "@needle-di/core";
import { generateRandomString } from "@oslojs/crypto/random";
import { HashingService } from "./hashing.service.js";
import { random } from "../lib/utils/helpers.js";

@injectable()
export class VerificationCodesService {
  constructor(private hashingService = inject(HashingService)) {}

  async generateWithHash() {
    const verificationCode = this.generate();
    const hashedVerificationCode = await this.hashingService.hash(
      verificationCode,
    );
    return { verificationCode, hashedVerificationCode };
  }

  verify(args: { verificationCode: string; hashedVerificationCode: string }) {
    return this.hashingService.compare(
      args.verificationCode,
      args.hashedVerificationCode,
    );
  }

  private generate() {
    const alphabet = "23456789ACDEFGHJKLMNPQRSTUVWXYZ"; // alphabet with removed look-alike characters (0, 1, O, I)
    return generateRandomString(random, alphabet, 6);
  }
}
