import {KeyRound} from 'lucide-react';

import Google from '@/assets/icons/google';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {AuthMethodType} from '@/types/auth-method';
import {User} from '@/types/user';

import {PasswordChangeDialog} from '../password-change/password-change-dialog';
import {PasswordSetDialog} from '../password-set/password-set-dialog';

type SignInMethodsProps = {
  currentUser: User;
};

export function SignInMethods({currentUser}: SignInMethodsProps) {
  const hasLocalAuth = currentUser.authMethods?.some(
    (method) => method.type === AuthMethodType.LOCAL,
  );

  const hasGoogleAuth = currentUser.authMethods?.some(
    (method) => method.type === AuthMethodType.GOOGLE,
  );

  const handleConnectGoogle = () => {
    window.location.href = '/api/auth/google';
  };

  const handleDisconnectGoogle = () => {
    console.warn('Disconnect Google functionality not implemented yet.');
  };

  return (
    <div className='mt-8'>
      <div className='mb-4'>
        <h2 className='mb-1 text-lg font-medium'>Sign-in methods</h2>
        <p className='mr-8 text-sm text-muted-foreground'>
          The different ways you access your account.
        </p>
      </div>
      <div className='space-y-4 rounded-lg border bg-card p-4'>
        <div className='flex flex-row items-start justify-between gap-4 sm:items-center'>
          <div className='flex items-center gap-4'>
            <KeyRound className='h-5 w-5 flex-shrink-0 text-muted-foreground' />
            <div>
              <p className='font-medium'>Password</p>
              <p className='text-xs text-muted-foreground'>
                {hasLocalAuth ? 'Log in using your email and password.' : 'Password not set.'}
              </p>
            </div>
          </div>
          {hasLocalAuth ? <PasswordChangeDialog /> : <PasswordSetDialog />}
        </div>
        <Separator className='bg-border' />
        <div className='flex flex-row items-center justify-between gap-4 sm:items-center'>
          <div className='flex items-center gap-4'>
            <Google className='h-5 w-5 flex-shrink-0 fill-muted-foreground' />
            <div>
              <p className='font-medium'>Google</p>
              <p className='text-xs text-muted-foreground'>
                {hasGoogleAuth
                  ? `Connected (${currentUser.email})`
                  : 'Not connected. Sign in faster.'}
              </p>
            </div>
          </div>
          {hasGoogleAuth ? (
            <Button variant='ghost' size='sm' onClick={handleDisconnectGoogle}>
              Disconnect
            </Button>
          ) : (
            <Button variant='ghost' size='sm' onClick={handleConnectGoogle}>
              Connect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
