import {useMutation, useQueryClient} from '@tanstack/react-query';

import {HttpError, api} from '@/utils/api';

export const useDeleteBankConnection = () => {
  const queryClient = useQueryClient();

  const {mutateAsync: deleteBankConnection, isPending} = useMutation<void, HttpError, string>({
    mutationFn: async (connectionId) => {
      await api.delete<void>(`/bank-connections/${connectionId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['bank-connections']});
    },
    retry: false,
  });

  return {deleteBankConnection, isPending};
};
