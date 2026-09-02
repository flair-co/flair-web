import {format, parseISO} from 'date-fns';

import {CopyToClipboardButton} from '@/components/shared/copy-to-clipboard-button';
import {CurrencyAmount} from '@/components/shared/currency-amount';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';

import {BankTransaction, BankTransactionDirection} from '../types/bank-transaction';

type BankTransactionCardProps = {
  transaction?: BankTransaction;
  isPending: boolean;
};

export function BankTransactionCard({transaction, isPending}: BankTransactionCardProps) {
  if (!transaction || isPending) {
    return <Skeleton className='mt-4 h-[28rem] w-full rounded-lg bg-card' />;
  }

  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle>Bank transaction</CardTitle>
        <CardDescription className='font-mono'>
          #{transaction.id} <CopyToClipboardButton value={transaction.id} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap items-start justify-between gap-6'>
          <div>
            <p className='mb-1 text-sm text-muted-foreground'>Amount</p>
            <p className='text-3xl'>
              <CurrencyAmount amount={Number(transaction.amount)} currency={transaction.currency} />
            </p>
            <p className='mt-1 text-sm text-muted-foreground'>
              {formatDirection(transaction.direction)}
            </p>
          </div>
          <div className='flex flex-col items-end gap-2'>
            <Badge variant='outline'>{transaction.transactionStatus || 'Unknown status'}</Badge>
            <p className='text-sm text-muted-foreground'>{transaction.currency}</p>
          </div>
        </div>

        <div className='mt-6 grid gap-5 rounded-md border p-5 sm:grid-cols-2 lg:grid-cols-3'>
          <Detail label='Transaction date' value={formatDate(transaction.transactionDate)} />
          <Detail label='Booking date' value={formatDate(transaction.bookingDate)} />
          <Detail label='Value date' value={formatDate(transaction.valueDate)} />
          <Detail
            label='Transaction type'
            value={formatTransactionType(transaction.transactionType)}
          />
          <Detail label='Direction' value={formatDirection(transaction.direction)} />
          <Detail label='Bank' value={`${transaction.bankName} (${transaction.bankCountry})`} />
          <Detail
            label='Account'
            value={transaction.externalAccountAlias || transaction.externalAccountName || 'Account'}
          />
          <Detail label='Counterparty' value={transaction.counterpartyName || '—'} />
          <Detail label='Merchant category code' value={transaction.merchantCategoryCode || '—'} />
          <Detail
            label='Provider classification'
            value={transaction.providerTransactionDescription || '—'}
          />
          <Detail
            label='Balance after transaction'
            value={formatAmount(transaction.balanceAfterAmount, transaction.balanceAfterCurrency)}
          />
          <Detail
            label='Instructed amount'
            value={formatAmount(transaction.instructedAmount, transaction.instructedCurrency)}
          />
          <Detail label='Exchange rate' value={formatExchangeRate(transaction)} />
          <Detail
            label='Payment reference'
            value={formatReference(transaction.referenceNumber, transaction.referenceNumberScheme)}
          />
        </div>

        <div className='mt-5 space-y-4'>
          <Detail label='Description' value={transaction.description || '—'} />
          <Detail label='Remittance information' value={transaction.remittanceInformation || '—'} />
        </div>
      </CardContent>
    </Card>
  );
}

function formatTransactionType(value: string | null) {
  if (!value) return 'Other';
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatDirection(value: BankTransactionDirection) {
  if (value === BankTransactionDirection.INCOME) return 'Income';
  if (value === BankTransactionDirection.EXPENSE) return 'Expense';
  return 'Unknown direction';
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

function Detail({label, value}: {label: string; value: string}) {
  return (
    <div>
      <p className='mb-1 text-sm text-muted-foreground'>{label}</p>
      <p className='whitespace-pre-wrap break-words'>{value}</p>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? value : format(date, 'MMM d, yyyy');
}
