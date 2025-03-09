import {z} from 'zod';

export const emailVerifySchema = z.object({
  email: z.string().email().min(1).max(255),
  token: z.string().uuid(),
});

export type EmailVerifyDto = z.infer<typeof emailVerifySchema>;
