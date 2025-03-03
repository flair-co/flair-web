import {createFileRoute, redirect} from '@tanstack/react-router';

import {AppBody} from '@/components/shared/layout/app-body';
import {AppHeader} from '@/components/shared/layout/app-header';
import {LoadingBar} from '@/components/shared/loading-bar';
import {useGetTransaction} from '@/features/transaction/api/use-get-transaction';
import {TransactionBreadcrumb} from '@/features/transaction/components/transaction-breadcrumb';
import {TransactionCard} from '@/features/transaction/components/transaction-card';

export const Route = createFileRoute('/transactions/$transactionId/')({
  component: TransactionIndex,
  beforeLoad: ({context}) => {
    if (!context.isAuthenticated) {
      throw redirect({to: '/login'});
    }
  },
});

function TransactionIndex() {
  const {transactionId} = Route.useParams();
  const {transaction, isPending} = useGetTransaction(transactionId);

  return (
    <>
      <LoadingBar isPending={isPending} />
      <AppHeader>
        <TransactionBreadcrumb transaction={transaction} />
      </AppHeader>
      <AppBody>{transaction && <TransactionCard transaction={transaction} />}</AppBody>
    </>
  );
}
