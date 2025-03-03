import React from 'react';

import Wallet from '@/components/shared/illustrations/wallet';
import {Skeleton} from '@/components/ui/skeleton';
import {Account} from '@/types/account';

import {AccountAddDialog} from './account-add/account-add-dialog';
import {AccountCard} from './account-card';

type AccountListProps = {
  accounts: Account[];
  isPending: boolean;
};

export function AccountList({accounts, isPending}: AccountListProps) {
  if (isPending) {
    return <Skeleton className='mt-[5.5rem] h-[5.1rem] w-full rounded-lg bg-card' />;
  }

  if (!isPending && accounts.length === 0) {
    return (
      <div className='mt-8 flex flex-col items-center'>
        <Wallet className='h-60' />
        <div className='mb-4 flex flex-col items-center text-base'>
          <p className='mb-2 text-2xl'>No accounts</p>
          <p className='text-muted-foreground'>You do not have any accounts yet.</p>
        </div>
        <AccountAddDialog />
      </div>
    );
  }

  return (
    <>
      <div className='mt-4 flex flex-col gap-3'>
        {accounts?.map((account) => (
          <React.Fragment key={account.id}>
            <AccountCard account={account} />
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
