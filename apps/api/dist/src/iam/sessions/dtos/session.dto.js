import { z } from "zod";
export const createSessionDto = z.object({
    id: z.string(),
    userId: z.string(),
    expiresAt: z.date(),
});
