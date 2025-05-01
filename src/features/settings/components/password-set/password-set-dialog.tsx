import {DialogDescription} from '@radix-ui/react-dialog';
import {useState} from 'react';

import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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

import {PasswordSetForm} from './password-set-form';

export function PasswordSetDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const title = 'Set password';
  const description =
    'Setting a password enables login using your email and password combination, alongside any connected accounts.';

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant='ghost'>{title}</Button>
        </DialogTrigger>
        <DialogContent className='w-[26rem]' aria-describedby={title}>
          <DialogHeader>
            <DialogTitle className='mb-1'> {title}</DialogTitle>
            <DialogDescription className='text-sm text-muted-foreground'>
              {description}
            </DialogDescription>
          </DialogHeader>
          <PasswordSetForm setOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant='ghost'>{title}</Button>
      </DrawerTrigger>
      <DrawerContent aria-describedby={title}>
        <DrawerHeader className='text-left'>
          <DrawerTitle className='mb-1'> {title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <PasswordSetForm setOpen={setIsOpen} />
        <DrawerFooter className='pt-4'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
