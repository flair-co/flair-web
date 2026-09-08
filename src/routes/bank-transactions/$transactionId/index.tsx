import {createFileRoute, redirect} from '@tanstack/react-router';

export const Route = createFileRoute('/bank-transactions/$transactionId/')({
  beforeLoad: ({params}) => {
    throw redirect({
      to: '/bank-transactions',
      search: {transactionId: params.transactionId},
      replace: true,
    });
  },
});
