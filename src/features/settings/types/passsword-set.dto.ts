import {z} from 'zod';

export const passwordSetDtoSchema = z.object({
  password: z
    .string()
    .min(1, 'Please enter your new password.')
    .min(8, 'Too short. Must be at least 8 characters.')
    .max(255, 'Too long. Must be less than 256 characters.'),
});

export type PasswordSetDto = z.infer<typeof passwordSetDtoSchema>;
