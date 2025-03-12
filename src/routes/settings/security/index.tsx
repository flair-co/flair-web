import {createFileRoute} from '@tanstack/react-router';
import {PencilLine, Trash2} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {useCurrentUser} from '@/hooks/use-current-user';

export const Route = createFileRoute('/settings/security/')({
  component: SettingsSecurityIndex,
});

function SettingsSecurityIndex() {
  const {currentUser} = useCurrentUser({skipFetch: true});

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your account&apos;s security settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className='mb-6 bg-muted' />
        <div className='mt-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-medium'>Password</h2>
            </div>
            <Button variant='outline'>
              <PencilLine />
              Change password
            </Button>
          </div>
        </div>
        <Separator className='my-6 bg-muted' />
        <div className='mt-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='mb-1 text-lg font-medium'>Delete account</h2>
              <p className='text-sm text-muted-foreground'>
                Deleting your account cannot be undone. Please be certain.
              </p>
            </div>
            <Button variant='destructive' className='text-foreground'>
              <Trash2 />
              Delete account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
