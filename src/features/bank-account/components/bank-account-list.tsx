import {Landmark} from 'lucide-react';

import {Skeleton} from '@/components/ui/skeleton';
import {BankAccount} from '@/types/bank-account';

import {BankAccountAddDialog} from './bank-account-add/bank-account-add-dialog';
import {BankAccountCard} from './bank-account-card';

type BankAccountListProps = {
  bankAccounts: BankAccount[];
  isPending: boolean;
};

export function BankAccountList({bankAccounts, isPending}: BankAccountListProps) {
  if (isPending) {
    return (
      <div className='mt-4 flex flex-col gap-3'>
        <Skeleton className='h-[4.5rem] w-full rounded-lg bg-card' />
        <Skeleton className='h-[4.5rem] w-full rounded-lg bg-card' />
      </div>
    );
  }

  if (!isPending && bankAccounts.length === 0) {
    return (
      <div className='mt-16 flex flex-col items-center text-center'>
        <Landmark className='mb-6 h-12 w-12 text-muted' />
        <h2 className='mb-2 text-2xl font-semibold'>Add your first bank account</h2>
        <p className='mb-6 max-w-sm text-muted-foreground'>
          Create a bank account to upload statements and begin tracking your transactions.
        </p>
        <BankAccountAddDialog />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      {bankAccounts?.map((bankAccount) => (
        <BankAccountCard key={bankAccount.id} bankAccount={bankAccount} />
      ))}
    </div>
  );
}
