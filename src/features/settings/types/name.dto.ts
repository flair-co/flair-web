import {z} from 'zod';

export const nameDtoSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter your name.')
    .max(255, 'Name must be less than 256 characters.'),
});

export type NameDto = z.infer<typeof nameDtoSchema>;
