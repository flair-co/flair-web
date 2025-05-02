import {DialogDescription} from '@radix-ui/react-dialog';
import {Loader} from 'lucide-react';
import {useState} from 'react';

import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {useMediaQuery} from '@/hooks/use-media-query';
import {AuthMethodType} from '@/types/auth-method';
import {capitalizeFirstLetter} from '@/utils/string-utils';

import {useDisconnectOauthMethod} from '../../api/use-disconnect-oauth-method';

type DisconnectOAuthDialogProps = {
  methodType: Exclude<AuthMethodType, AuthMethodType.LOCAL>;
};

export function DisconnectOAuthMethodDialog({methodType}: DisconnectOAuthDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const {disconnect, isPending} = useDisconnectOauthMethod();

  const handleDisconnect = async () => {
    await disconnect(methodType);
  };

  const capitalizedMethod = capitalizeFirstLetter(methodType);

  const description = () => {
    return (
      <>
        <p>You will no longer be able to log in to Flair using your {capitalizedMethod} account.</p>
        <p className='mt-2'>
          After disconnecting, you will only be able to sign in using your email and password.
        </p>
      </>
    );
  };

  const title = `Disconnect ${capitalizedMethod} sign-in?`;

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant='ghost'>Disconnect</Button>
        </DialogTrigger>
        <DialogContent aria-describedby={title}>
          <DialogHeader>
            <DialogTitle className='mb-1'> {title}</DialogTitle>
            <DialogDescription className='py-2 text-sm text-muted-foreground'>
              {description()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex gap-2'>
            <DialogClose asChild>
              <Button variant='outline' type='button'>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type='submit'
              variant='destructive'
              disabled={isPending}
              onClick={handleDisconnect}
              className='text-foreground'
            >
              {isPending ? (
                <>
                  <span>Disconnecting...</span>
                  <Loader className='ml-2 h-4 w-4 animate-slow-spin' />
                </>
              ) : (
                <span>Disconnect</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant='ghost'>Disconnect</Button>
      </DrawerTrigger>
      <DrawerContent aria-describedby={title}>
        <DrawerHeader className='text-left'>
          <DrawerTitle className='mb-1'> {title}</DrawerTitle>
          <DrawerDescription className='py-2'>{description()}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            type='submit'
            variant='destructive'
            disabled={isPending}
            className='w-full text-foreground'
            onClick={handleDisconnect}
          >
            {isPending ? (
              <>
                <span>Disconnecting...</span>
                <Loader className='ml-2 h-4 w-4 animate-slow-spin' />
              </>
            ) : (
              <span>Disconnect</span>
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
