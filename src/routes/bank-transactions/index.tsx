import {createFileRoute} from '@tanstack/react-router';
import {zodValidator} from '@tanstack/zod-adapter';

import {AppBodyLayout} from '@/components/shared/layout/app-body';
import {AppHeaderLayout} from '@/components/shared/layout/app-header-layout';
import {LoadingBar} from '@/components/shared/loading-bar';
import {useGetBankTransactions} from '@/features/banking/api/use-get-bank-transactions';
import {BankTransactionBreadcrumb} from '@/features/banking/components/bank-transaction-breadcrumb';
import {BankTransactionTable} from '@/features/banking/components/bank-transaction-table';
import {bankTransactionSearchParamsSchema} from '@/features/banking/types/bank-transaction';
import {handleAuthenticatedRedirect} from '@/utils/handle-redirect';

export const Route = createFileRoute('/bank-transactions/')({
  component: BankTransactionsIndex,
  validateSearch: zodValidator(bankTransactionSearchParamsSchema),
  beforeLoad: ({context}) => {
    handleAuthenticatedRedirect(context);
  },
});

function BankTransactionsIndex() {
  const searchParams = Route.useSearch();
  const {
    data,
    isPending,
    isPlaceholderData,
    isError,
    refetch,
    pagination,
    setPagination,
    filters,
    setFilters,
    sort,
    setSort,
  } = useGetBankTransactions(searchParams);
  const totalTransactions = data?.total ?? 0;
  const transactionCountLabel = totalTransactions === 1 ? 'transaction' : 'transactions';
  const resultSummary = isPending
    ? 'Loading synchronized records...'
    : isError
      ? 'Transaction data is unavailable right now'
      : `${totalTransactions} ${transactionCountLabel}`;

  return (
    <>
      <LoadingBar isPending={isPending} />
      <AppHeaderLayout>
        <BankTransactionBreadcrumb />
      </AppHeaderLayout>
      <AppBodyLayout>
        <div className='space-y-6'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>Bank transactions</h1>
            <p className='mt-1 text-sm text-muted-foreground'>{resultSummary}</p>
          </div>
          <BankTransactionTable
            transactions={data?.transactions || []}
            totalTransactions={totalTransactions}
            isPending={isPending}
            isPlaceholderData={isPlaceholderData}
            pagination={pagination}
            setPagination={setPagination}
            filters={filters}
            setFilters={setFilters}
            sort={sort}
            setSort={setSort}
            isError={isError}
            onRetry={() => void refetch()}
          />
        </div>
      </AppBodyLayout>
    </>
  );
}
