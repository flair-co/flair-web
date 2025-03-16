import {useMutation} from '@tanstack/react-query';

import {EmailVerifyDto} from '@/features/auth/types/email-verify.dto';
import {HttpError, api} from '@/utils/api';

export const useChangeEmailVerify = () => {
  const {mutateAsync: changeEmailVerify, isPending} = useMutation<void, HttpError, EmailVerifyDto>({
    mutationFn: async (dto) => {
      const response = await api.post('/auth/change-email/verify', JSON.stringify(dto));
      return response.json();
    },
  });

  return {changeEmailVerify, isPending};
};
