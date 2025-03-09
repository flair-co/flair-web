import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {toast} from 'sonner';

import {User} from '@/types/user';
import {HttpError, api} from '@/utils/api';

import {LogInDto} from '../types/login.dto';

export const useLogIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {mutate: logIn, isPending} = useMutation<void, HttpError, LogInDto>({
    mutationFn: async (logInDto: LogInDto) => {
      const response = await api.post('/auth/login', JSON.stringify(logInDto));
      const user = (await response.json()) as User;
      await queryClient.setQueryData(['currentUser'], user);
      return navigate({to: '/home'});
    },
    onError: (error) => {
      if (error.status === 400) {
        return toast.error('Validation failed.', {
          description: 'Please input a valid email and password.',
        });
      }
      if (error.status === 401) {
        throw error;
      }
      toast.error('There was a problem with your request.', {
        description: 'You could not be logged in. Please try again.',
      });
    },
  });
  return {logIn, isPending};
};
