import { z } from "zod";
export const passwordSignUpVerifyDto = z.object({
    email: z.string().email(),
    code: z.string().length(6),
});
