import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

import {HttpError, api} from '@/utils/api';

import {PasswordSetDto} from '../types/passsword-set.dto';

export const useSetPassword = () => {
  const queryClient = useQueryClient();

  const {mutateAsync: setPassword, isPending} = useMutation<Response, HttpError, PasswordSetDto>({
    mutationFn: async (dto: PasswordSetDto) => {
      return await api.post('/auth/set-password', JSON.stringify(dto));
    },
    onSuccess: async () => {
      toast.success('Password set.');
      await queryClient.invalidateQueries({queryKey: ['currentUser']});
    },
    onError: (error: HttpError) => {
      if (error.status === 409) {
        toast.error('A password has already been set for this account.');
      } else {
        toast.error('Failed to set password.', {description: 'Please try again.'});
      }
    },
  });

  return {setPassword, isPending};
};
