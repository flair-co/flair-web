import {useQuery} from '@tanstack/react-query';
import {toast} from 'sonner';

import {Transaction} from '@/types/transaction';
import {api} from '@/utils/api';

export const useGetTransaction = (id: Transaction['id']) => {
  const {
    data: transaction,
    isPending,
    isError,
  } = useQuery<Transaction>({
    queryKey: ['transaction', id],
    queryFn: async () => {
      const response = await api.get(`/transactions/${id}`);
      return response.json();
    },
  });

  if (isError) {
    toast.error('There was a problem with your request.', {
      description: 'Your transaction could not be loaded. Please try again.',
    });
  }
  return {transaction, isPending};
};
