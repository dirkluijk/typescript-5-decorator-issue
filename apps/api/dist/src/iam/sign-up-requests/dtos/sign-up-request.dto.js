import { z } from "zod";
export const signUpRequestDto = z.object({
    email: z.string().email(),
    hashedCode: z.string(),
    hashedPassword: z.string(),
});
