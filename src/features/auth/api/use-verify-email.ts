import {useMutation} from '@tanstack/react-query';
import {useNavigate, useRouteContext} from '@tanstack/react-router';
import {useEffect} from 'react';
import {toast} from 'sonner';

import {HttpError, api} from '@/utils/api';

import {EmailVerifyDto, emailVerifySchema} from '../types/email-verify.dto';

export const useVerifyEmail = (dto: EmailVerifyDto) => {
  const {currentUser} = useRouteContext({from: '/verify'});
  const navigate = useNavigate();

  const {mutate, isPending, error} = useMutation<void, HttpError, EmailVerifyDto>({
    mutationFn: async (dto: EmailVerifyDto) => {
      const validation = emailVerifySchema.safeParse(dto);
      if (!validation.success) {
        throw new HttpError(400, 'Invalid request parameters');
      }

      await api.post('/auth/verify-email', JSON.stringify(dto));
    },
    onSuccess: () => {
      toast.success('Email verified', {
        description: 'Your email has been successfully verified.',
      });

      return navigate({to: '/home'});
    },
    onError: (error) => {
      if (currentUser && currentUser.isEmailVerified) {
        toast.info('Email verified', {
          description: 'Your email has already been verified.',
        });

        return navigate({to: '/home'});
      }
      throw error;
    },
  });

  useEffect(() => {
    dto && mutate(dto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {isPending, error};
};
