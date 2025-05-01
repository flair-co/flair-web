import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

import {AuthMethodType} from '@/types/auth-method';
import {User} from '@/types/user';
import {HttpError, api} from '@/utils/api';

export const useDisconnectOauthMethod = () => {
  const queryClient = useQueryClient();

  const {mutateAsync: disconnectOauthMethod, isPending} = useMutation<
    Response,
    HttpError,
    AuthMethodType
  >({
    mutationFn: async (methodType) => {
      return await api.delete(`/auth/methods/${methodType}`);
    },

    onSuccess: (_, methodType) => {
      toast.success(`${methodType} connection successfully removed.`);

      queryClient.setQueryData<User>(['currentUser'], (currentUser) => {
        if (!currentUser) return undefined;
        const updatedAuthMethods =
          currentUser.authMethods?.filter((method) => method.type !== methodType) ?? [];
        return {...currentUser, authMethods: updatedAuthMethods};
      });
    },
    onError: (error, methodType) => {
      if (error.status === 404) {
        toast.error(`Failed to disconnect ${methodType.toUpperCase()} sign-in method.`, {
          description: `The ${methodType.toUpperCase()} connection was not found.`,
        });
      } else {
        toast.error(`Failed to disconnect ${methodType.toUpperCase()} sign-in method.`, {
          description: 'Please try again.',
        });
      }
    },
  });

  return {disconnectOauthMethod, isPending};
};
