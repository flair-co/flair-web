import {Link} from '@tanstack/react-router';

import {DynamicBankIcon} from '@/components/shared/dynamic-bank-icon';
import {Transaction} from '@/types/transaction';

type TransactionAccountLinkProps = {
  transaction: Transaction;
};

export function TransactionAccountLink({transaction}: TransactionAccountLinkProps) {
  return (
    <Link
      className='flex items-center underline-offset-4 hover:underline'
      to={'/accounts/$accountId'}
      params={{accountId: transaction.account.id}}
    >
      <div className='mr-1 rounded-md bg-muted p-1'>
        <DynamicBankIcon bank={transaction.account.bank} className='h-3 w-3' />
      </div>
      {transaction.account.bank}
      {transaction.account.alias && (
        <span className='text-muted-foreground'>({transaction.account.alias})</span>
      )}
    </Link>
  );
}
