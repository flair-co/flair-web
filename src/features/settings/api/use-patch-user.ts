import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

import {User} from '@/types/user';
import {HttpError, api} from '@/utils/api';

import {NameDto} from '../types/name.dto';

export const usePatchUser = () => {
  const queryClient = useQueryClient();

  const {mutateAsync, isPending} = useMutation<User, HttpError, NameDto>({
    mutationFn: async (dto) => {
      const response = await api.patch('/users/me', JSON.stringify(dto));
      return response.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['currentUser'], updatedUser);
    },
  });

  const patchUser = (dto: NameDto) => {
    return toast.promise(mutateAsync(dto), {
      loading: 'Saving name...',
      success: 'Name saved.',
      error: 'Your name could not be saved. Please try again',
    });
  };

  return {patchUser, isPending};
};
