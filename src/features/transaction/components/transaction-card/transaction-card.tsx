import {format} from 'date-fns';

import {CopyToClipboardButton} from '@/components/shared/copy-to-clipboard-button';
import {CurrencyAmount} from '@/components/shared/currency-amount';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Transaction} from '@/types/transaction';

import {TransactionAccountLink} from './transaction-account-link';
import {TransactionCategoryCombobox} from './transaction-category-combobox';

type TransactionCardProps = {
  transaction: Transaction;
};

export function TransactionCard({transaction}: TransactionCardProps) {
  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle>Transaction</CardTitle>
        <CardDescription className='font-mono'>
          #{transaction.id} <CopyToClipboardButton value={transaction.id} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex gap-20'>
          <div>
            <p className='mb-1 text-sm text-muted-foreground'>Amount</p>
            <p className='text-3xl'>
              <CurrencyAmount amount={transaction.amount} currency={transaction.currency} />
            </p>
          </div>
          <div>
            <p className='mb-1 text-sm text-muted-foreground'>Category</p>
            <TransactionCategoryCombobox transaction={transaction} />
          </div>
        </div>
        <Card className='mt-4 p-6 text-base'>
          <div className='relative flex'>
            <div className='mb-[1.75rem] mt-2 flex flex-col items-center'>
              <div className='mb-1 h-2 w-2 rounded-full bg-muted-foreground'></div>
              <div className='w-px flex-1 bg-muted'></div>
              <div className='mt-1 h-2 w-2 rounded-full bg-success'></div>
            </div>
            <div className='ml-4 flex-1'>
              <div className='mb-6 flex justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>From</p>
                  {transaction.amount > 0 ? (
                    <>{transaction.description}</>
                  ) : (
                    <TransactionAccountLink transaction={transaction} />
                  )}
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Started at</p>
                  <p className='whitespace-nowrap font-mono'>
                    {format(transaction.startedAt, 'MMM d, yyyy, HH:mm')}
                  </p>
                </div>
              </div>
              <div className='flex justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>To</p>
                  {transaction.amount > 0 ? (
                    <TransactionAccountLink transaction={transaction} />
                  ) : (
                    <>{transaction.description}</>
                  )}
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
