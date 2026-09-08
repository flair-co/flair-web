import {Link, useNavigate} from '@tanstack/react-router';
import {SortingState, flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table';
import {RefreshCw, Search, SearchX} from 'lucide-react';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';

import {EmptyState} from '@/components/shared/layout/app-empty-state';
import {LoadingBar} from '@/components/shared/loading-bar';
import {Pagination} from '@/components/shared/pagination';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Skeleton} from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {PaginationParams} from '@/types/pagination';
import {cn} from '@/utils/cn';

import {
  BankTransaction,
  BankTransactionFilterParams,
  BankTransactionSortField,
  BankTransactionSortOrder,
  BankTransactionSortParams,
  DEFAULT_BANK_TRANSACTION_SORT,
} from '../types/bank-transaction';
import {BankTransactionAccountFilter} from './bank-transaction-account-filter';
import {BankTransactionDateFilter} from './bank-transaction-date-filter';
import {bankTransactionTableColumns} from './bank-transaction-table-columns';

type BankTransactionTableProps = {
  transactions: BankTransaction[];
  totalTransactions: number;
  isPending: boolean;
  isPlaceholderData: boolean;
  pagination: PaginationParams;
  setPagination: Dispatch<SetStateAction<PaginationParams>>;
  filters: BankTransactionFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<BankTransactionFilterParams>>;
  sort: BankTransactionSortParams;
  setSort: React.Dispatch<React.SetStateAction<BankTransactionSortParams>>;
  isError: boolean;
  onRetry: () => void;
};

export function BankTransactionTable({
  transactions,
  totalTransactions,
  isPending,
  isPlaceholderData,
  pagination,
  setPagination,
  filters,
  setFilters,
  sort,
  setSort,
  isError,
  onRetry,
}: BankTransactionTableProps) {
  const navigate = useNavigate({from: '/bank-transactions/'});
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const isFilteringApplied =
    !!filters.bookingDate || (filters.bankAccountIds?.length ?? 0) > 0 || !!filters.search?.trim();

  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    const search = searchInput.trim() || undefined;
    if (search === filters.search) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void navigate({search: (prev) => ({...prev, search, pageIndex: 0})});
      setFilters((previousFilters) => ({...previousFilters, search}));
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [filters.search, navigate, searchInput, setFilters]);

  const handleSortingChange = (
    updaterOrValue: SortingState | ((prev: SortingState) => SortingState),
  ) => {
    const currentSorting: SortingState = sort
      ? [{id: sort.by, desc: sort.order === BankTransactionSortOrder.DESC}]
      : [];
    const updatedSorting =
      typeof updaterOrValue === 'function' ? updaterOrValue(currentSorting) : updaterOrValue;
    const firstSort = updatedSorting[0];
    const nextSort =
      firstSort && isBankTransactionSortField(firstSort.id)
        ? {
            by: firstSort.id,
            order: firstSort.desc ? BankTransactionSortOrder.DESC : BankTransactionSortOrder.ASC,
          }
        : DEFAULT_BANK_TRANSACTION_SORT;

    void navigate({search: (prev) => ({...prev, sort: nextSort, pageIndex: 0})});
    setSort(nextSort);
  };

  const table = useReactTable({
    data: transactions,
    columns: bankTransactionTableColumns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    state: {
      pagination,
      sorting: sort ? [{id: sort.by, desc: sort.order === BankTransactionSortOrder.DESC}] : [],
    },
    rowCount: totalTransactions,
    onSortingChange: handleSortingChange,
  });

  const clearFilters = () => {
    void navigate({
      search: (prev) => ({
        ...prev,
        bookingDate: undefined,
        bankAccountIds: undefined,
        search: undefined,
        pageIndex: 0,
      }),
    });
    setFilters({bookingDate: undefined, bankAccountIds: [], search: undefined});
  };

  if (isPending) {
    return <Skeleton className='h-[22rem] w-full rounded-lg bg-card' />;
  }

  if (isError) {
    return (
      <EmptyState
        icon={RefreshCw}
        title='Could not load bank transactions'
        description='The transaction service did not respond. Try again in a moment.'
      >
        <Button variant='outline' onClick={onRetry}>
          Try again
        </Button>
      </EmptyState>
    );
  }

  const isEmptyState = totalTransactions === 0 && !isPlaceholderData && !isFilteringApplied;
  if (isEmptyState) {
    return (
      <EmptyState
        icon={Search}
        title='No bank transactions found'
        description='Synchronize a bank connection to make its transactions appear here.'
      />
    );
  }

  return (
    <>
      <div className='mb-5 flex flex-wrap items-center gap-3'>
        <div className='relative min-w-[14rem] flex-1 md:max-w-sm'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder='Search transactions...'
            aria-label='Search transactions'
            className='h-10 pl-9 sm:h-8'
            data-testid='bank-transactions-search'
          />
        </div>
        <BankTransactionDateFilter filters={filters} setFilters={setFilters} />
        <BankTransactionAccountFilter filters={filters} setFilters={setFilters} />
        {isFilteringApplied && (
          <Button variant='secondary' size='sm' className='h-10 sm:h-8' onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>
      <div className='relative mb-10'>
        <LoadingBar isPending={isPlaceholderData} />
        <Table
          data-testid='bank-transactions-table'
          aria-label='Bank transactions'
          className='max-md:block max-md:w-full'
        >
          <TableCaption className='sr-only'>
            Bank transaction records. Select a transaction description to view its full details.
          </TableCaption>
          <TableHeader className='max-md:sr-only'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortDirection = header.column.getIsSorted();

                  return (
                    <TableHead
                      key={header.id}
                      className='p-0'
                      aria-sort={
                        sortDirection === 'asc'
                          ? 'ascending'
                          : sortDirection === 'desc'
                            ? 'descending'
                            : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className='max-md:block max-md:p-2'>
            {totalTransactions === 0 && isFilteringApplied ? (
              <TableRow>
                <TableCell
                  colSpan={bankTransactionTableColumns.length}
                  className='h-24 text-center'
                >
                  <div className='my-4 flex flex-col items-center gap-4'>
                    <SearchX className='h-12 w-12 text-muted-foreground' />
                    <div>
                      <p className='mb-2 text-base'>No bank transactions found</p>
                      <p className='text-muted-foreground'>
                        The applied filters did not match any transactions.
                      </p>
                    </div>
                    <Button variant='outline' onClick={clearFilters}>
                      Clear filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => {
                const transactionLabel = getTransactionLabel(row.original);

                return (
                  <TableRow
                    key={row.id}
                    className='cursor-pointer focus-within:bg-accent hover:bg-card max-md:mb-2 max-md:grid max-md:grid-cols-[minmax(0,1fr)_auto] max-md:gap-x-4 max-md:gap-y-1 max-md:rounded-lg max-md:border max-md:bg-card max-md:p-3'
                    data-testid={`bank-transaction-row-${row.original.id}`}
                    onClick={(event) => {
                      if (event.target instanceof Element && event.target.closest('a,button')) {
                        return;
                      }

                      void navigate({
                        to: '/bank-transactions/$transactionId',
                        params: {transactionId: row.original.id},
                      });
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isDescriptionCell = cell.column.id === 'description';

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            'p-3',
                            cell.column.id === 'bookingDate' &&
                              'max-md:order-1 max-md:block max-md:border-0 max-md:p-0',
                            cell.column.id === 'amount' &&
                              'max-md:order-2 max-md:block max-md:justify-self-end max-md:border-0 max-md:p-0',
                            isDescriptionCell &&
                              'max-md:order-3 max-md:col-span-2 max-md:block max-md:border-0 max-md:p-0',
                            cell.column.id === 'valueDate' &&
                              'max-md:order-4 max-md:block max-md:border-0 max-md:p-0 max-md:text-xs max-md:text-muted-foreground',
                            cell.column.id === 'transactionType' &&
                              'max-md:order-5 max-md:block max-md:justify-self-end max-md:border-0 max-md:p-0',
                            cell.column.id === 'source' &&
                              'max-md:order-6 max-md:col-span-2 max-md:block max-md:border-0 max-md:p-0',
                          )}
                        >
                          {isDescriptionCell ? (
                            <Link
                              to='/bank-transactions/$transactionId'
                              params={{transactionId: row.original.id}}
                              aria-label={`View ${transactionLabel} transaction details`}
                              className='block rounded-sm focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                              onClick={(event) => event.stopPropagation()}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Link>
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {totalTransactions > 0 && (
          <Pagination
            totalItems={totalTransactions}
            pagination={pagination}
            setPagination={setPagination}
            navigateOptions={{from: '/bank-transactions/'}}
          />
        )}
      </div>
    </>
  );
}

function getTransactionLabel(transaction: BankTransaction) {
  return transaction.description || transaction.counterpartyName || 'bank transaction';
}

function isBankTransactionSortField(value: string): value is BankTransactionSortField {
  return Object.values(BankTransactionSortField).includes(value as BankTransactionSortField);
}
