import { z } from "zod";

export const passwordSignInDto = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export type PasswordSignInDto = z.infer<typeof passwordSignInDto>;
