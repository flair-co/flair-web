import {ColumnDef} from '@tanstack/react-table';
import {format} from 'date-fns';

import {CategoryBadge} from '@/components/shared/category-badge';
import {CurrencyAmount} from '@/components/shared/currency-amount';
import {SortButton} from '@/components/shared/sort-button';
import {Transaction} from '@/types/transaction';

export const transactionsTableColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'category',
    header: () => {
      return <p className='px-3'>Category</p>;
    },
    cell: ({row}) => {
      return <CategoryBadge category={row.original.category} />;
    },
  },
  {
    accessorKey: 'startedAt',
    header: ({column}) => <SortButton column={column}>Started at</SortButton>,
    cell: ({row}) => {
      return <p>{format(new Date(row.original.startedAt), 'MMM d, yyyy')}</p>;
    },
  },
  {
    accessorKey: 'description',
    header: () => {
      return <p className='px-3'>Description</p>;
    },
    cell: ({row}) => {
      return (
        <p className='max-w-[6rem] overflow-hidden text-ellipsis whitespace-nowrap lg:max-w-[20rem] xl:max-w-[36rem] 2xl:max-w-[50rem]'>
          {row.original.description}
        </p>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({column}) => (
      <SortButton column={column} className='justify-end' iconPosition='before'>
        Amount
      </SortButton>
    ),
    cell: ({row}) => {
      return (
        <p className='text-right'>
          <CurrencyAmount amount={row.original.amount} currency={row.original.currency} />
        </p>
      );
    },
  },
];
