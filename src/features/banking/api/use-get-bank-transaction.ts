import {useQuery} from '@tanstack/react-query';

import {api} from '@/utils/api';

import {BankTransaction} from '../types/bank-transaction';

export const useGetBankTransaction = (id: BankTransaction['id']) => {
  const {
    data: transaction,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery<BankTransaction>({
    queryKey: ['bank-transaction', id],
    queryFn: async () => {
      return await api.get<BankTransaction>(`/bank-transactions/${id}`);
    },
    retry: false,
  });

  return {transaction, isPending, isError, error, refetch};
};
