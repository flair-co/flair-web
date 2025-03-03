import {useCanGoBack, useRouter} from '@tanstack/react-router';
import {ChevronLeft} from 'lucide-react';

import {Button} from '@/components/ui/button';

type AppBodyProps = {
  children: React.ReactNode;
};

export function AppBody({children}: AppBodyProps) {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (
    <div className='mx-auto max-w-[80rem] px-6'>
      {canGoBack && (
        <Button
          variant='link'
          onClick={() => router.history.back()}
          className='-ml-4 mt-4 text-foreground'
        >
          <ChevronLeft />
          Back
        </Button>
      )}
      {children}
    </div>
  );
}
