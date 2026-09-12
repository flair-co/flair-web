import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

import {HttpError, api} from '@/utils/api';

import {BankTransaction, BankTransactionCategory} from '../types/bank-transaction';

type UpdateBankTransactionCategoryInput = {
  id: BankTransaction['id'];
  category: BankTransactionCategory;
};

export const useUpdateBankTransactionCategory = () => {
  const queryClient = useQueryClient();
  const {mutateAsync, isPending} = useMutation<
    BankTransaction,
    HttpError,
    UpdateBankTransactionCategoryInput
  >({
    mutationFn: async ({id, category}) => {
      return await api.patch<BankTransaction>(
        `/bank-transactions/${id}/category`,
        JSON.stringify({category}),
      );
    },
    onSuccess: async (updatedTransaction, {id}) => {
      queryClient.setQueryData(['bank-transaction', id], updatedTransaction);
      await queryClient.invalidateQueries({queryKey: ['bank-transactions']});
    },
    retry: false,
  });

  const updateBankTransactionCategory = (input: UpdateBankTransactionCategoryInput) =>
    toast.promise(mutateAsync(input), {
      loading: 'Saving category...',
      success: 'Transaction category saved.',
      error: 'Transaction category could not be saved. Please try again.',
    });

  return {updateBankTransactionCategory, isPending};
};
