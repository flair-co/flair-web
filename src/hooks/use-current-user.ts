import {useQuery, useQueryClient} from '@tanstack/react-query';

import {User} from '@/types/user';
import {HttpError, api} from '@/utils/api';

export const useCurrentUser = ({skipFetch = false} = {}) => {
  const queryClient = useQueryClient();
  const cachedUser = queryClient.getQueryData<User>(['currentUser']);

  const {
    data: currentUser,
    isPending,
    error,
  } = useQuery<User, HttpError>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await api.get('/users/me');
      return response.json();
    },
    enabled: !skipFetch || !cachedUser,
    retry: false,
  });

  const isAuthenticated = !isPending && !!currentUser && !error;

  return {currentUser, isPending, isAuthenticated};
};
