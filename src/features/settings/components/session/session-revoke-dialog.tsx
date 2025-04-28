import {Loader, Trash2} from 'lucide-react';
import {useState} from 'react';

import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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

import {useRevokeSession} from '../../api/use-revoke-session';
import {Session} from '../../types/session';
import {SessionCard} from './session-card';

type SessionRevokeDialogProps = {
  session: Session;
};

export function SessionRevokeDialog({session}: SessionRevokeDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isOpen, setIsOpen] = useState(false);

  const {revokeSession, isPending} = useRevokeSession();

  const handleRevoke = async () => {
    await revokeSession({id: session.id});
    setIsOpen(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='w-full text-foreground sm:w-fit' size='sm'>
            <Trash2 />
            Revoke
          </Button>
        </DialogTrigger>
        <DialogContent aria-describedby='Revoke session' className='max-w-[33rem]'>
          <DialogHeader>
            <DialogTitle>Revoke session</DialogTitle>
            <DialogDescription className='pt-2'>
              Are you sure you want to revoke this session?
            </DialogDescription>
          </DialogHeader>
          <SessionCard session={session} hideRevokeButton forceStackedLayout />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' type='button' className='w-full'>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type='submit'
              disabled={isPending}
              className='w-full text-foreground'
              variant='destructive'
              onClick={handleRevoke}
            >
              {isPending ? (
                <>
                  <span>Revoking session...</span>
                  <Loader className='ml-2 h-4 w-4 animate-slow-spin' />
                </>
              ) : (
                <span>Revoke session</span>
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
        <Button variant='outline' className='w-full text-foreground sm:w-fit' size='sm'>
          <Trash2 />
          Revoke
        </Button>
      </DrawerTrigger>
      <DrawerContent aria-describedby='Revoke session'>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Revoke session</DrawerTitle>
          <DrawerDescription className='pt-2'>
            Are you sure you want to revoke this session?
          </DrawerDescription>
        </DrawerHeader>
        <div className='px-4'>
          <SessionCard session={session} hideRevokeButton forceStackedLayout />
        </div>
        <DrawerFooter className='pt-4'>
          <Button
            type='submit'
            disabled={isPending}
            className='w-full text-foreground'
            variant='destructive'
            onClick={handleRevoke}
          >
            {isPending ? (
              <>
                <span>Revoking session...</span>
                <Loader className='ml-2 h-4 w-4 animate-slow-spin' />
              </>
            ) : (
              <span>Revoke session</span>
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
