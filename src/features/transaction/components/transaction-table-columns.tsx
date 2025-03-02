import {ColumnDef} from '@tanstack/react-table';
import {format} from 'date-fns';
import {ArrowUpDown} from 'lucide-react';

import {CategoryBadge} from '@/components/shared/category-badge';
import {Button} from '@/components/ui/button';
import {Transaction} from '@/types/transaction';
import {cn} from '@/utils/cn';

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
    header: ({column}) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex h-12 w-full justify-start px-3'
        >
          Started at
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({row}) => {
      return <p>{format(new Date(row.original.startedAt), 'dd/MM/yyyy')}</p>;
    },
  },
  {
    accessorKey: 'description',
    header: () => {
      return <p className='px-3'>Description</p>;
    },
    cell: ({row}) => {
      return (
        <p className='max-w-[6rem] overflow-hidden text-ellipsis whitespace-nowrap xl:max-w-[22rem] 2xl:max-w-[38rem]'>
          {row.original.description}
        </p>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({column}) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex h-12 w-full justify-end px-3'
        >
          Amount
          <ArrowUpDown className='mx-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({row}) => {
      return (
        <p className={cn('px-2 py-1 text-right', row.original.amount > 0 && 'text-success')}>
          {row.original.amount}
        </p>
      );
    },
  },
];
