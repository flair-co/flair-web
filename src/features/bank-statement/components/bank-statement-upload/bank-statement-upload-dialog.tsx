import {Upload} from 'lucide-react';

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
import {useMediaQuery} from '@/hooks/use-media-query';

import {BankStatementUploadInput} from './bank-statement-upload';

export function BankStatementUploadDialog() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const title = 'Upload Statement';

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Upload className='h-4 w-4' />
            {title}
          </Button>
        </DialogTrigger>
        <DialogContent className='mx-10'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <BankStatementUploadInput />
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline' className='mt-4 w-full'>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return <BankStatementUploadInput  />;
}
