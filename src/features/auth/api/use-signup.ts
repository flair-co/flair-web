import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {toast} from 'sonner';

import {User} from '@/types/user';
import {HttpError, api} from '@/utils/api';

import {SignUpDto} from '../types/signup.dto';

export const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {mutate: signUp, isPending} = useMutation<void, HttpError, SignUpDto>({
    mutationFn: async (signUpDto: SignUpDto) => {
      const response = await api.post('/auth/signup', JSON.stringify(signUpDto));
      const user = (await response.json()) as User;
      await queryClient.setQueryData(['currentUser'], user);
      return navigate({to: '/home'});
    },
    onError: (error) => {
      if (error.status === 400) {
        toast.error('Validation failed.', {
          description: 'Please check your input and try again.',
        });
      }
      if (error.status === 409) {
        throw error;
      }
      toast.error('There was a problem with your request.', {
        description: 'Your account could not be created. Please try again.',
      });
    },
  });
  return {signUp, isPending};
};
