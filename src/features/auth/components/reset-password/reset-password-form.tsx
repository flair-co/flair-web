import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';

import {usePasswordResetRequest} from '../../api/use-password-reset-request';
import {
  PasswordResetRequestDto,
  passwordResetRequestDtoSchema,
} from '../../types/password-reset-request.dto';

type ResetPasswordFormProps = {
  onSubmitSuccess: (email: string) => void;
};

export function ResetPasswordForm({onSubmitSuccess}: ResetPasswordFormProps) {
  const {requestPasswordReset, isPending} = usePasswordResetRequest();
  const form = useForm<PasswordResetRequestDto>({
    resolver: zodResolver(passwordResetRequestDtoSchema),
  });

  const onSubmit = async (formData: PasswordResetRequestDto) => {
    await requestPasswordReset(formData, {
      onSuccess: () => {
        onSubmitSuccess(formData.email);
      },
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='email'
          render={({field}) => (
            <FormItem className='mb-2'>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='example@domain.com'
                  {...field}
                  type='email'
                  autoCapitalize='none'
                  autoComplete='email'
                  autoCorrect='off'
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending ? 'Continuing...' : 'Continue'}
        </Button>
      </form>
    </Form>
  );
}
