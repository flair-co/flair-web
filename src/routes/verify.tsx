import {zodResolver} from '@hookform/resolvers/zod';
import {createFileRoute, redirect} from '@tanstack/react-router';
import {zodValidator} from '@tanstack/zod-adapter';
import {REGEXP_ONLY_DIGITS} from 'input-otp';
import {Loader, Mail} from 'lucide-react';
import {useCallback, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Form, FormControl, FormField, FormItem, FormMessage} from '@/components/ui/form';
import {InputOTP, InputOTPGroup, InputOTPSlot} from '@/components/ui/input-otp';
import {useResendVerificationEmail} from '@/features/auth/api/use-resend-verification-email';
import {useVerifyEmail} from '@/features/auth/api/use-verify-email';
import {
  EmailVerifyDto,
  emailVerifySchema,
  searchParamsSchema,
} from '@/features/auth/types/email-verify.dto';
import {useCurrentUser} from '@/hooks/use-current-user';

export const Route = createFileRoute('/verify')({
  component: VerifyIndex,
  validateSearch: zodValidator(searchParamsSchema),
  beforeLoad: ({context}) => {
    if (context.isAuthenticated && context.isEmailVerified) {
      toast.info('Your email has already been verified.');
      throw redirect({to: '/home'});
    }
  },
});

function VerifyIndex() {
  const {code} = Route.useSearch();
  const {currentUser} = useCurrentUser({skipFetch: true});
  const {verifyEmail, isPending: isVerifying} = useVerifyEmail();
  const {resendVerificationEmail, isPending: isResending} = useResendVerificationEmail();

  const form = useForm<EmailVerifyDto>({
    resolver: zodResolver(emailVerifySchema),
    mode: 'onSubmit',
    defaultValues: {code: String(code || '')},
  });

  const handleVerifyEmail = useCallback(
    async (data: EmailVerifyDto) => {
      await verifyEmail(data, {
        onError: (error) => {
          if (error.status === 400) {
            form.setError(
              'code',
              {message: 'This code is invalid or has expired.'},
              {shouldFocus: true},
            );
          }
        },
      });
    },
    [verifyEmail, form],
  );

  useEffect(() => {
    const verifyEmailWithCode = async () => {
      if (code) {
        await handleVerifyEmail({code: String(code)});
      }
    };

    void verifyEmailWithCode();
  }, [handleVerifyEmail, code]);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center gap-4 bg-background'>
      <Card>
        <CardHeader className='flex items-center'>
          <div className='mb-3 rounded-full bg-muted p-3'>
            <Mail className='h-6 w-6' />
          </div>
          <CardTitle>Please check your email</CardTitle>
          <CardDescription className='flex max-w-[21rem] flex-col items-center pt-2'>
            We&apos;ve sent a verification code to{' '}
            {currentUser?.email ? (
              <span className='text-foreground'>{currentUser.email}</span>
            ) : (
              'your email.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleVerifyEmail)} noValidate>
              <FormField
                control={form.control}
                name='code'
                render={({field}) => (
                  <FormItem className='flex flex-col justify-center'>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        value={String(field.value || '')}
                        pattern={REGEXP_ONLY_DIGITS}
                        disabled={isVerifying}
                      >
                        <InputOTPGroup className='gap-3'>
                          <InputOTPSlot index={0} className='rounded-md' />
                          <InputOTPSlot index={1} className='rounded-md border-l' />
                          <InputOTPSlot index={2} className='rounded-md border-l' />
                          <InputOTPSlot index={3} className='rounded-md border-l' />
                          <InputOTPSlot index={4} className='rounded-md border-l' />
                          <InputOTPSlot index={5} className='rounded-md border-l' />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                disabled={isVerifying || !form.formState.isValid}
                className='mt-4 w-full'
              >
                {isVerifying ? (
                  <>
                    <span>Verifying...</span>
                    <Loader className='h-4 w-4 animate-slow-spin' />
                  </>
                ) : (
                  <span>Verify</span>
                )}
              </Button>
              <Button
                className='mt-4 w-full'
                type='button'
                variant='ghost'
                onClick={() => resendVerificationEmail()}
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <span>Sending...</span>
                    <Loader className='h-4 w-4 animate-slow-spin' />
                  </>
                ) : (
                  <span>Send new code</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
