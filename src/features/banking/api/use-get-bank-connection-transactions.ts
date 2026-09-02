import {useQuery} from '@tanstack/react-query';

import {ExternalTransactionsResponse} from '@/features/banking/types/bank-connection';
import {api} from '@/utils/api';

export const useGetBankConnectionTransactions = (connectionId: string, enabled: boolean) => {
  const {data, isPending} = useQuery<ExternalTransactionsResponse>({
    queryKey: ['bank-connection-transactions', connectionId],
    queryFn: async () => {
      return await api.get<ExternalTransactionsResponse>(
        `/bank-connections/${connectionId}/transactions?limit=5`,
      );
    },
    enabled,
  });

  return {transactions: data?.transactions ?? [], total: data?.total ?? 0, isPending};
};
