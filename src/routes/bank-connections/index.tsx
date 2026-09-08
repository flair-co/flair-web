import {createFileRoute, useNavigate} from '@tanstack/react-router';
import {zodValidator} from '@tanstack/zod-adapter';
import {useEffect, useRef} from 'react';
import {toast} from 'sonner';
import {z} from 'zod';

import {AppBodyLayout} from '@/components/shared/layout/app-body';
import {AppHeaderLayout} from '@/components/shared/layout/app-header-layout';
import {LoadingBar} from '@/components/shared/loading-bar';
import {useGetAllBankConnections} from '@/features/banking/api/use-get-all-bank-connections';
import {BankConnectionList} from '@/features/banking/components/bank-connection-list';
import {BankTransactionDetailsDialog} from '@/features/banking/components/bank-transaction-details-dialog';
import {handleAuthenticatedRedirect} from '@/utils/handle-redirect';

const searchSchema = z.object({
  result: z.enum(['connected', 'cancelled', 'error']).optional(),
  transactionId: z.string().optional(),
});

export const Route = createFileRoute('/bank-connections/')({
  component: BankConnectionsIndex,
  validateSearch: zodValidator(searchSchema),
  beforeLoad: ({context}) => {
    handleAuthenticatedRedirect(context);
  },
});

function BankConnectionsIndex() {
  const navigate = useNavigate();
  const {result, transactionId} = Route.useSearch();
  const transactionTriggerRef = useRef<HTMLButtonElement | null>(null);
  const {bankConnections, isPending, isError, refetch} = useGetAllBankConnections();

  useEffect(() => {
    if (!result) return;

    if (result === 'connected') {
      toast.success('Bank connection added', {id: 'bank-connection-success'});
    } else if (result === 'cancelled') {
      toast.info('Bank connection cancelled', {id: 'bank-connection-cancelled'});
    } else {
      toast.error('Bank connection failed', {
        description: 'No bank account data was changed. Please try again.',
        id: 'bank-connection-error',
      });
    }

    void navigate({to: '/bank-connections', search: {}});
  }, [navigate, result]);

  const openTransaction = (selectedTransactionId: string, trigger: HTMLButtonElement) => {
    transactionTriggerRef.current = trigger;
    void navigate({
      to: '/bank-connections',
      search: (prev) => ({...prev, transactionId: selectedTransactionId}),
    });
  };

  const closeTransaction = (open: boolean) => {
    if (open) return;

    const trigger = transactionTriggerRef.current;
    transactionTriggerRef.current = null;
    void navigate({
      to: '/bank-connections',
      replace: true,
      search: (prev) => ({...prev, transactionId: undefined}),
    }).then(() => {
      if (trigger?.isConnected) trigger.focus();
    });
  };

  return (
    <>
      <LoadingBar isPending={isPending} />
      <AppHeaderLayout>
        <span className='text-sm font-medium'>Bank connections</span>
      </AppHeaderLayout>
      <AppBodyLayout className='max-md:my-6'>
        <BankConnectionList
          bankConnections={bankConnections || []}
          isPending={isPending}
          isError={isError}
          onRetry={() => void refetch()}
          onTransactionSelect={openTransaction}
        />
      </AppBodyLayout>
      <BankTransactionDetailsDialog
        transactionId={transactionId ?? ''}
        open={Boolean(transactionId)}
        onOpenChange={closeTransaction}
      />
    </>
  );
}
