import {Link} from '@tanstack/react-router';

import {CurrencyAmount} from '@/components/shared/currency-amount';
import {DynamicBankIcon} from '@/components/shared/dynamic-bank-icon';
import {Card} from '@/components/ui/card';
import {Account} from '@/types/account';

type AccountCardProps = {
  account: Account;
};

export function AccountCard({account}: AccountCardProps) {
  return (
    <Link to='/accounts/$accountId' params={{accountId: account.id}}>
      <Card className='flex items-center justify-between p-4 hover:bg-accent'>
        <div className='flex items-center'>
          <div className='rounded-md bg-muted p-2'>
            <DynamicBankIcon bank={account.bank} className='w-7' />
          </div>
          <div className='ml-4 flex flex-col'>
            <p>
              {account.bank}{' '}
              {account.alias && <span className='text-muted-foreground'>({account.alias})</span>}
            </p>
            <p className='font-mono'>
              <CurrencyAmount amount={account.balance} currency={account.currency} />
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
