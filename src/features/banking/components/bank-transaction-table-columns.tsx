import {ColumnDef, HeaderContext} from '@tanstack/react-table';
import {format, parseISO} from 'date-fns';
import {ArrowDown, ArrowDownUp, ArrowUp} from 'lucide-react';

import {CurrencyAmount} from '@/components/shared/currency-amount';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';

import {
  BankTransaction,
  BankTransactionDirection,
  BankTransactionSortField,
} from '../types/bank-transaction';

function SortIcon({direction}: {direction: false | 'asc' | 'desc'}) {
  if (direction === 'asc') return <ArrowUp className='h-4 w-4 text-secondary-foreground' />;
  if (direction === 'desc') return <ArrowDown className='h-4 w-4 text-secondary-foreground' />;
  return <ArrowDownUp className='text-muted-foreground' />;
}

function SortButton({
  column,
  children,
}: {
  column: HeaderContext<BankTransaction, unknown>['column'];
  children: React.ReactNode;
}) {
  const direction = column.getIsSorted();
  return (
    <Button
      variant='ghost'
      onClick={() => {
        if (direction === 'desc') column.toggleSorting(false);
        else if (direction === 'asc') column.clearSorting();
        else column.toggleSorting(true);
      }}
      className='flex h-12 w-full justify-start px-3'
    >
      {children}
      <SortIcon direction={direction} />
    </Button>
  );
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? value : format(date, 'MMM d, yyyy');
}

export const bankTransactionTableColumns: ColumnDef<BankTransaction>[] = [
  {
    accessorKey: BankTransactionSortField.BOOKING_DATE,
    header: ({column}) => <SortButton column={column}>Booking date</SortButton>,
    cell: ({row}) => <p>{formatDate(row.original.bookingDate)}</p>,
  },
  {
    id: 'valueDate',
    header: () => <p className='px-3'>Value date</p>,
    cell: ({row}) => <p>{formatDate(row.original.valueDate)}</p>,
  },
  {
    id: 'description',
    header: () => <p className='px-3'>Description</p>,
    cell: ({row}) => (
      <div className='max-w-[14rem] lg:max-w-[24rem] xl:max-w-[36rem]'>
        <p className='overflow-hidden text-ellipsis whitespace-nowrap'>
          {row.original.description || row.original.counterpartyName || 'Transaction'}
        </p>
        {row.original.counterpartyName && row.original.description && (
          <p className='overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground'>
            {row.original.counterpartyName}
          </p>
        )}
      </div>
    ),
  },
  {
    id: 'transactionType',
    header: () => <p className='px-3'>Type</p>,
    cell: ({row}) => (
      <Badge variant='outline'>{formatTransactionType(row.original.transactionType)}</Badge>
    ),
  },
  {
    id: 'source',
    header: () => <p className='px-3'>Source</p>,
    cell: ({row}) => (
      <div className='max-w-[12rem]'>
        <p className='overflow-hidden text-ellipsis whitespace-nowrap'>{row.original.bankName}</p>
        <p className='overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground'>
          {row.original.externalAccountAlias || row.original.externalAccountName || 'Account'}
        </p>
      </div>
    ),
  },
  {
    id: 'status',
    header: () => <p className='px-3'>Status</p>,
    cell: ({row}) => <Badge variant='outline'>{row.original.transactionStatus || 'Unknown'}</Badge>,
  },
  {
    accessorKey: BankTransactionSortField.AMOUNT,
    header: ({column}) => <SortButton column={column}>Amount</SortButton>,
    cell: ({row}) => (
      <div className='text-right'>
        <CurrencyAmount amount={Number(row.original.amount)} currency={row.original.currency} />
        <p className='text-xs text-muted-foreground'>{formatDirection(row.original.direction)}</p>
      </div>
    ),
  },
];

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
