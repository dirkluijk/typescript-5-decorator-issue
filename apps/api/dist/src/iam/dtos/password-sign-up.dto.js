import { z } from "zod";
export const passwordSignUpDto = z.object({
    email: z.string().email(),
    password: z.string().min(1).max(100),
});
