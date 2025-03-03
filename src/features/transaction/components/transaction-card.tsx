import {format} from 'date-fns';

import {CurrencyAmount} from '@/components/shared/currency-amount';
import {DynamicBankIcon} from '@/components/shared/dynamic-bank-icon';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {Transaction} from '@/types/transaction';

import {TransactionCategoryCombobox} from './transaction-category-combobox';

type TransactionCard = {
  transaction: Transaction;
};
export function TransactionCard({transaction}: TransactionCard) {
  console.log(transaction);
  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle>Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex gap-4'>
            <div className='flex h-fit w-fit rounded-md bg-muted p-2'>
              <DynamicBankIcon bank={transaction.account.bank} className='h-7 w-7' />
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Account</p>
              <p>
                {transaction.account.bank}
                {transaction.account.alias && (
                  <span className='text-muted-foreground'> ({transaction.account.alias})</span>
                )}
              </p>
            </div>
          </div>
          <div className='text-right'>
            <p className='text-sm text-muted-foreground'>Amount</p>
            <p className='text-2xl'>
              <CurrencyAmount amount={transaction.amount} currency={transaction.currency} />
            </p>
          </div>
        </div>
        <Separator className='my-4' />
        <div>
          <p className='mb-2 text-muted-foreground'>Category</p>
          <TransactionCategoryCombobox transaction={transaction} />
        </div>
        <Card className='mt-4 p-6 text-base'>
          <div className='relative flex'>
            {/* Timeline */}
            <div className='mb-[1.75rem] mt-2 flex flex-col items-center'>
              {/* From Dot */}
              <div className='mb-1 h-2 w-2 rounded-full bg-muted-foreground'></div>
              {/* Line */}
              <div className='w-px flex-1 bg-muted'></div>
              {/* To Dot */}
              <div className='mt-1 h-2 w-2 rounded-full bg-success'></div>
            </div>

            {/* Content */}
            <div className='ml-4 flex-1'>
              {/* From Section */}
              <div className='mb-6 flex justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>From</p>
                  <p>{transaction.account.bank}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Started at</p>
                  <p className='whitespace-nowrap font-mono'>
                    {format(transaction.startedAt, 'MMM d, yyyy, HH:mm')}
                  </p>
                </div>
              </div>

              {/* To Section */}
              <div className='flex justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>To</p>
                  <p className='truncate whitespace-nowrap'>{transaction.description}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Completed at</p>
                  <p className='whitespace-nowrap font-mono'>
                    {format(transaction.completedAt, 'MMM d, yyyy, HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
}
