import { inject, injectable } from "@needle-di/core";
import { generateRandomString } from "@oslojs/crypto/random";
import { HashingService } from "./hashing.service";
import { random } from "../lib/utils/helpers";
@injectable()
export class VerificationCodesService {
    hashingService;
    constructor(hashingService = inject(HashingService)) {
        this.hashingService = hashingService;
    }
    async generateWithHash() {
        const verificationCode = this.generate();
        const hashedVerificationCode = await this.hashingService.hash(verificationCode);
        return { verificationCode, hashedVerificationCode };
    }
    verify(args) {
        return this.hashingService.compare(args.verificationCode, args.hashedVerificationCode);
    }
    generate() {
        const alphabet = "23456789ACDEFGHJKLMNPQRSTUVWXYZ"; // alphabet with removed look-alike characters (0, 1, O, I)
        return generateRandomString(random, alphabet, 6);
    }
}
