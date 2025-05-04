import {zodResolver} from '@hookform/resolvers/zod';
import {Link, createFileRoute} from '@tanstack/react-router';
import {AnimatePresence, motion} from 'framer-motion';
import {useState} from 'react';
import {useForm} from 'react-hook-form';

import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {usePasswordResetRequest} from '@/features/auth/api/use-password-reset-request';
import {AuthLayout} from '@/features/auth/components/auth-layout';
import {switchContentVariants} from '@/features/auth/constants/animations';
import {
  PasswordResetRequestDto,
  passwordResetRequestDtoSchema,
} from '@/features/auth/types/password-reset-request.dto';
import {handleUnauthenticatedRedirect} from '@/utils/handle-redirect';

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordComponent,
  beforeLoad: ({context}) => {
    handleUnauthenticatedRedirect(context);
  },
});

function ResetPasswordComponent() {
  const {requestPasswordReset, isPending, isSuccess, reset} = usePasswordResetRequest();
  const [hasResent, setHasResent] = useState(false);

  const form = useForm<PasswordResetRequestDto>({
    resolver: zodResolver(passwordResetRequestDtoSchema),
  });

  const onSubmit = async (formData: PasswordResetRequestDto) => {
    await requestPasswordReset(formData);
  };

  const handleResend = async () => {
    setHasResent(true);
    await requestPasswordReset(form.getValues());
  };

  const handleTryAgain = () => {
    reset();
    form.reset();
    setHasResent(false);
  };

  return (
    <AuthLayout title={isSuccess ? 'Check your email' : 'Reset password'}>
      <div className='relative flex flex-col'>
        <AnimatePresence initial={false} mode='wait'>
          {isSuccess ? (
            <motion.div
              key='success-view-fade'
              variants={switchContentVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              className='flex w-full flex-col space-y-4 text-sm text-muted-foreground'
            >
              {hasResent ? (
                <p>
                  We&apos;ve resent an email to{' '}
                  <span className='text-foreground'>{form.getValues('email')}</span> with
                  instructions to reset your password.
                </p>
              ) : (
                <p>
                  If <span className='text-foreground'>{form.getValues('email')}</span> matches an
                  email in our system, then we&apos;ve sent you an email with further instructions
                  to reset your password.
                </p>
              )}
              <p>
                If you don&apos;t see the email within 5 minutes, check your spam folder
                {!hasResent && (
                  <>
                    ,{' '}
                    <Button
                      variant='link'
                      onClick={handleResend}
                      className='h-auto bg-transparent p-0 text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      resend
                    </Button>
                  </>
                )}
                , or{' '}
                <Button
                  variant='link'
                  onClick={handleTryAgain}
                  className='h-auto bg-transparent p-0 text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                >
                  use a different email
                </Button>
                .
              </p>
              <p className='px-8 pt-4 text-center text-sm text-muted-foreground'>
                <Link to='/login' className='text-foreground underline-offset-4 hover:underline'>
                  Return to log in
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key='reset-form-view-fade'
              variants={switchContentVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              className='flex w-full flex-col space-y-4'
            >
              <p className='text-sm text-muted-foreground'>
                Enter the email address associated with your account and we&apos;ll send you a link
                to reset your password.
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({field}) => (
                      <FormItem>
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
                  <Button type='submit' className='mt-2 w-full' disabled={isPending}>
                    {isPending ? 'Continuing...' : 'Continue'}
                  </Button>
                </form>
              </Form>
              <p className='px-8 pt-4 text-center text-sm text-muted-foreground'>
                <Link to='/login' className='text-foreground underline-offset-4 hover:underline'>
                  Return to log in
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}
