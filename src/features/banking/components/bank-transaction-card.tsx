import {Link} from '@tanstack/react-router';
import {FileQuestion, RefreshCw} from 'lucide-react';

import {CopyToClipboardButton} from '@/components/shared/copy-to-clipboard-button';
import {CurrencyAmount} from '@/components/shared/currency-amount';
import {EmptyState} from '@/components/shared/layout/app-empty-state';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {cn} from '@/utils/cn';

import {BankTransaction} from '../types/bank-transaction';
import {
  formatBankTransactionDate,
  formatBankTransactionDirection,
  formatBankTransactionType,
} from '../utils/formatters';

type BankTransactionCardProps = {
  transaction?: BankTransaction;
  isPending: boolean;
  isError: boolean;
  isNotFound: boolean;
  onRetry: () => void;
};

export function BankTransactionCard({
  transaction,
  isPending,
  isError,
  isNotFound,
  onRetry,
}: BankTransactionCardProps) {
  if (isPending) {
    return (
      <div role='status' aria-label='Loading bank transaction'>
        <Skeleton className='mt-4 h-[28rem] w-full rounded-lg bg-card' />
      </div>
    );
  }

  if (isError || !transaction) {
    if (isNotFound) {
      return (
        <EmptyState
          icon={FileQuestion}
          title='Transaction not found'
          description='This transaction may have been removed or the link may be out of date.'
        >
          <Button asChild variant='outline'>
            <Link to='/bank-transactions'>Back to bank transactions</Link>
          </Button>
        </EmptyState>
      );
    }

    return (
      <EmptyState
        icon={RefreshCw}
        title='Could not load bank transaction'
        description='The transaction service did not respond. Try again in a moment.'
      >
        <Button variant='outline' onClick={onRetry}>
          Try again
        </Button>
      </EmptyState>
    );
  }

  const transactionTitle = transaction.description || transaction.counterpartyName || 'Transaction';

  return (
    <Card data-testid='bank-transaction-card' className='mt-4 overflow-hidden'>
      <CardHeader className='gap-5 border-b px-5 py-5 sm:p-6'>
        <div className='min-w-0'>
          <h1 className='break-words text-2xl font-semibold leading-tight tracking-tight'>
            {transactionTitle}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>Bank transaction</p>
          <div className='mt-2 flex min-w-0 items-center gap-2'>
            <code
              className='min-w-0 truncate text-sm text-muted-foreground'
              title={`Transaction ID ${transaction.id}`}
            >
              #{transaction.id}
            </code>
            <CopyToClipboardButton value={transaction.id} label='Copy transaction ID' />
          </div>
        </div>

        <div className='flex items-end justify-between gap-4'>
          <div>
            <p className='text-sm text-muted-foreground'>Amount</p>
            <p className='mt-1 text-3xl font-medium tracking-tight'>
              <CurrencyAmount amount={Number(transaction.amount)} currency={transaction.currency} />
            </p>
            <p className='mt-1 text-sm text-muted-foreground'>
              {formatBankTransactionDirection(transaction.direction)}
            </p>
          </div>
          <div className='flex flex-col items-end gap-1'>
            <p className='text-sm text-muted-foreground'>Status</p>
            <Badge variant='outline'>{transaction.transactionStatus || 'Unknown status'}</Badge>
            <p className='text-sm text-muted-foreground'>{transaction.currency}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-8 px-5 py-5 sm:p-6'>
        <section
          aria-labelledby='transaction-details-heading'
          data-testid='bank-transaction-details'
        >
          <h2 id='transaction-details-heading' className='text-lg font-semibold tracking-tight'>
            Transaction details
          </h2>
          <div className='mt-5 grid gap-6 lg:grid-cols-2 lg:gap-8'>
            <DetailGroup id='transaction-dates-heading' title='Dates'>
              <Detail
                label='Transaction date'
                value={formatBankTransactionDate(transaction.transactionDate)}
              />
              <Detail
                label='Booking date'
                value={formatBankTransactionDate(transaction.bookingDate)}
              />
              <Detail label='Value date' value={formatBankTransactionDate(transaction.valueDate)} />
            </DetailGroup>

            <DetailGroup id='transaction-account-heading' title='Account'>
              <Detail
                label='Bank account'
                value={
                  transaction.bankAccountAlias || transaction.bankAccountName || 'Bank account'
                }
              />
              <Detail label='Bank' value={`${transaction.bankName} (${transaction.bankCountry})`} />
              <Detail label='Counterparty' value={transaction.counterpartyName || '—'} />
            </DetailGroup>

            <DetailGroup id='transaction-classification-heading' title='Classification'>
              <Detail
                label='Transaction type'
                value={formatBankTransactionType(transaction.transactionType)}
              />
              <Detail
                label='Direction'
                value={formatBankTransactionDirection(transaction.direction)}
              />
              <Detail
                label='Merchant category code'
                value={transaction.merchantCategoryCode || '—'}
              />
              <Detail
                label='Provider classification'
                value={transaction.providerTransactionDescription || '—'}
              />
            </DetailGroup>

            <DetailGroup id='transaction-settlement-heading' title='Settlement'>
              <Detail
                label='Balance after transaction'
                value={formatAmount(
                  transaction.balanceAfterAmount,
                  transaction.balanceAfterCurrency,
                )}
              />
              <Detail
                label='Instructed amount'
                value={formatAmount(transaction.instructedAmount, transaction.instructedCurrency)}
              />
              <Detail
                label='Exchange rate'
                value={formatExchangeRate(transaction)}
                className='col-span-2'
              />
            </DetailGroup>

            <DetailGroup id='transaction-reference-heading' title='Reference'>
              <Detail
                label='Payment reference'
                value={formatReference(
                  transaction.referenceNumber,
                  transaction.referenceNumberScheme,
                )}
                className='col-span-2'
              />
            </DetailGroup>
          </div>
        </section>

        <section aria-labelledby='transaction-notes-heading' className='border-t pt-6'>
          <h2 id='transaction-notes-heading' className='text-lg font-semibold tracking-tight'>
            Notes
          </h2>
          <dl className='mt-4 grid grid-cols-2 gap-x-6 gap-y-4'>
            <Detail label='Description' value={transaction.description || '—'} />
            <Detail
              label='Remittance information'
              value={transaction.remittanceInformation || '—'}
            />
          </dl>
        </section>
      </CardContent>
    </Card>
  );
}

function DetailGroup({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className='min-w-0'>
      <h3 id={id} className='text-sm font-semibold'>
        {title}
      </h3>
      <dl className='mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:gap-y-4'>{children}</dl>
    </section>
  );
}

function formatAmount(amount: string | null, currency: string | null) {
  if (!amount || !currency) return '—';
  const numericAmount = Number(amount);
  return Number.isFinite(numericAmount)
    ? `${numericAmount.toFixed(2)} ${currency}`
    : `${amount} ${currency}`;
}

function formatExchangeRate(transaction: BankTransaction) {
  if (!transaction.exchangeRate) return '—';
  const unitCurrency = transaction.exchangeRateUnitCurrency
    ? ` ${transaction.exchangeRateUnitCurrency}`
    : '';
  const rateType = transaction.exchangeRateType ? ` (${transaction.exchangeRateType})` : '';
  return `${transaction.exchangeRate}${unitCurrency}${rateType}`;
}

function formatReference(referenceNumber: string | null, referenceNumberScheme: string | null) {
  if (!referenceNumber) return '—';
  return referenceNumberScheme ? `${referenceNumber} (${referenceNumberScheme})` : referenceNumber;
}

function Detail({label, value, className}: {label: string; value: string; className?: string}) {
  return (
    <div className={cn('min-w-0', className)}>
      <dt className='text-xs font-medium text-muted-foreground'>{label}</dt>
      <dd className='mt-1 break-words text-sm sm:text-base'>{value}</dd>
    </div>
  );
}
