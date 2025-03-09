import {Link, createFileRoute} from '@tanstack/react-router';
import {Loader, MailWarning} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {useVerifyEmail} from '@/features/auth/api/use-verify-email';
import {EmailVerifyDto} from '@/features/auth/types/email-verify.dto';

export const Route = createFileRoute('/verify')({
  component: VerifyIndex,
});

function VerifyIndex() {
  const searchParams = Route.useSearch();
  const {isPending, error} = useVerifyEmail(searchParams as EmailVerifyDto);

  if (isPending) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center gap-4 bg-background'>
        <Loader className='h-12 w-12 animate-spin' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center gap-4 bg-background'>
        <div className='flex flex-col gap-8'>
          <div className='flex items-center gap-4'>
            <MailWarning className='h-14 w-14 text-muted-foreground' />
            <div>
              <h1 className='mb-1 text-2xl'>Your email could not be verified</h1>
              <p className='text-muted-foreground'>
                The verification link is invalid or has expired.
              </p>
            </div>
          </div>
          <Button size='lg' asChild>
            <Link to='/home'>Back home</Link>
          </Button>
        </div>
      </div>
    );
  }
}
