import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate, useRouter} from '@tanstack/react-router';
import {toast} from 'sonner';

import {User} from '@/types/user';
import {HttpError, api} from '@/utils/api';

import {SignUpDto} from '../types/signup.dto';

export const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const router = useRouter();

  const {mutate: signUp, isPending} = useMutation<User, HttpError, SignUpDto>({
    mutationFn: async (signUpDto: SignUpDto) => {
      const response = await api.post('/auth/signup', JSON.stringify(signUpDto));
      const user = (await response.json()) as User;
      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['currentUser'], user);
      router.update({context: {isAuthenticated: true, currentUser: user}});
      return navigate({to: '/home'});
    },
    onError: (error) => {
      if (error.status === 400) {
        return toast.error('Validation failed', {
          description: 'Please check your input and try again.',
        });
      }
      if (error.status === 409) {
        throw error;
      }
    },
    retry: false,
  });
  return {signUp, isPending};
};
