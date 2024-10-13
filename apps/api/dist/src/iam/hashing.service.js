import { hash, verify } from "argon2";
import { injectable } from "@needle-di/core";
@injectable()
export class HashingService {
    hash(data) {
        return hash(data);
    }
    compare(data, encrypted) {
        return verify(encrypted, data);
    }
}
