import {createFileRoute} from '@tanstack/react-router';
import {PencilLine, ShieldCheck, ShieldX} from 'lucide-react';

import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {NameChangeForm} from '@/features/settings/components/name-change-form';
import {useCurrentUser} from '@/hooks/use-current-user';

export const Route = createFileRoute('/settings/account/')({
  component: SettingsAccountIndex,
});

function SettingsAccountIndex() {
  const {currentUser} = useCurrentUser({skipFetch: true});

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your account&apos;s settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className='mb-6 bg-muted' />
        <div>
          <h2 className='mb-1 text-lg font-medium'>Name</h2>
          <div className='w-fit'>
            <NameChangeForm currentName={currentUser.name} />
          </div>
        </div>
        <Separator className='my-6 bg-muted' />
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='mb-1 text-lg font-medium'>Email address</h2>
            <p className='text-sm text-muted-foreground'>
              Your email is used to log in to your account.
            </p>
          </div>
          <div className='flex items-center gap-10'>
            <div className='text-right'>
              <p className='mb-1'>{currentUser.email}</p>
              <div className='flex items-center justify-end text-success'>
                {currentUser.isEmailVerified ? (
                  <Badge className='h-fit whitespace-nowrap bg-success-foreground hover:bg-success-foreground'>
                    <ShieldCheck className='mr-1 h-4 w-4' />
                    Verified
                  </Badge>
                ) : (
                  <Badge className='h-fit whitespace-nowrap bg-warning-foreground hover:bg-warning-foreground'>
                    <ShieldX className='mr-1 h-4 w-4' />
                    Unverified
                  </Badge>
                )}
              </div>
            </div>
            <Button variant='outline'>
              <PencilLine />
              Change email
            </Button>
          </div>
        </div>
        {!currentUser.isEmailVerified && (
          <Alert className='mt-6 border-warning bg-warning-foreground'>
            <ShieldX className='h-5 w-5' />
            <AlertTitle>Your email is not verified</AlertTitle>
            <AlertDescription className='flex flex-col'>
              <span className='text-muted-foreground'>
                Verify your email to unlock all features and ensure your account&apos;s security.
              </span>
              <Button className='mt-2 w-fit' variant='default'>
                Send verification link
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
