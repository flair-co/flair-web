import {z} from 'zod';

import {Bank} from '@/types/bank';

import {currencyCodes} from '../constants/currency-codes';

export const bankAccountCreateDtoSchema = z.object({
  alias: z.string().max(50, 'Alias must be less than 50 characters.').optional(),
  bank: z.nativeEnum(Bank, {message: 'Please select a bank.'}),
  currency: z.enum(currencyCodes as [string, ...string[]], {
    message: 'Please select a valid currency.',
  }),
});

export type BankAccountCreateDto = z.infer<typeof bankAccountCreateDtoSchema>;
