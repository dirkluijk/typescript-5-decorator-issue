import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase, } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { SessionsRepository } from "./sessions.repository";
import { createSessionDto } from "./dtos/session.dto";
import { inject, injectable } from "@needle-di/core";
import { BadRequest } from "../../lib/utils/exceptions";
@injectable()
export class SessionsService {
    sessionsRepository;
    constructor(sessionsRepository = inject(SessionsRepository)) {
        this.sessionsRepository = sessionsRepository;
    }
    generateSessionToken() {
        const bytes = new Uint8Array(20);
        crypto.getRandomValues(bytes);
        const token = encodeBase32LowerCaseNoPadding(bytes);
        return token;
    }
    createSession(token, userId) {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const session = createSessionDto.parse({
            id: sessionId,
            userId,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        });
        this.sessionsRepository.create(session);
        return session;
    }
    async validateSessionToken(sessionId) {
        const item = await this.sessionsRepository.findOneById(sessionId);
        if (item === null) {
            throw BadRequest("Invalid session token");
        }
        const result = JSON.parse(item);
        const session = createSessionDto.parse({
            id: result.id,
            userId: result.user_id,
            expiresAt: new Date(result.expires_at * 1000),
        });
        if (Date.now() >= session.expiresAt.getTime()) {
            await this.sessionsRepository.delete(sessionId);
            throw BadRequest("Session expired");
        }
        if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
            session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
            await this.sessionsRepository.create({
                id: session.id,
                userId: session.userId,
                expiresAt: session.expiresAt,
            });
        }
        return session;
    }
    async invalidateSession(sessionId) {
        await this.sessionsRepository.delete(sessionId);
    }
}
