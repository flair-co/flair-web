import {format, formatDistanceToNow} from 'date-fns';
import {Monitor, Smartphone, Tablet, TvMinimal} from 'lucide-react';

import {Card} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Session} from '@/features/settings/types/session';

import {LogOutDialog} from './log-out-dialog';
import {SessionRevokeDialog} from './session-revoke-dialog';

type SessionCardProps = {
  session: Session;
  hideRevokeButton?: boolean;
};

export function SessionCard({session, hideRevokeButton = false}: SessionCardProps) {
  const createdAtAbsolute = format(session.lastSeenAt, 'MMM d, yyyy HH:mm');
  const lastSeenAtAbsolute = format(session.lastSeenAt, 'MMM d, yyyy HH:mm');
  const lastSeenAtRelative = formatDistanceToNow(lastSeenAtAbsolute, {addSuffix: true});

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className='h-6 w-6 sm:h-8 sm:w-8' />;
      case 'tablet':
        return <Tablet className='h-6 w-6 sm:h-8 sm:w-8' />;
      case 'console':
      case 'smarttv':
      case 'wearable':
      case 'xr':
      case 'embedded':
        return <TvMinimal className='h-6 w-6 sm:h-8 sm:w-8' />;
      case 'desktop':
      default:
        return <Monitor className='h-6 w-6 sm:h-8 sm:w-8' />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className='group cursor-pointer bg-sidebar transition-colors hover:bg-accent/50'>
          <div className='flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center'>
            <div className='flex min-w-0 flex-grow items-center gap-4'>
              <div className='flex-shrink-0 text-muted-foreground'>
                {getDeviceIcon(session.deviceType)}
              </div>
              <div className='min-w-0 flex-grow'>
                <p className='truncate text-sm font-medium' title={session.userAgent}>
                  {session.clientDescription}
                </p>
                <div className='text-xs text-muted-foreground'>
                  {session.isCurrent ? (
                    <div className='mt-1 flex gap-1.5'>
                      <div className='flex items-center gap-1.5'>
                        <span className='block h-2 w-2 rounded-full bg-green-500'></span>
                        <span className='font-medium text-green-600'>Current session</span>
                      </div>
                      <span>·</span>
                      <span>{session.clientLocation}</span>
                    </div>
                  ) : (
                    <div className='mt-1 flex gap-1.5' title={lastSeenAtAbsolute}>
                      <span>{`Last seen ${lastSeenAtRelative}`}</span> <span>·</span>{' '}
                      <span>{session.clientLocation}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className='invisible flex-shrink-0 opacity-0 transition-opacity duration-150 ease-in-out group-hover:visible group-hover:opacity-100'
              onClick={(e) => e.stopPropagation()}
            >
              {session.isCurrent && <LogOutDialog />}
              {!(hideRevokeButton || session.isCurrent) && (
                <SessionRevokeDialog session={session} />
              )}
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[28rem]'>
        <DialogHeader>
          <DialogTitle>{session.clientDescription}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4 text-sm'>
          <div className='flex items-center justify-between border-b pb-4'>
            <span className='text-muted-foreground'>IP Address</span>
            <span className='font-mono'>{session.ip || 'N/A'}</span>
          </div>

          <div className='flex items-center justify-between border-b pb-4'>
            <span className='text-muted-foreground'>Location</span>
            <span>{session.clientLocation}</span>
          </div>

          <div className='flex items-center justify-between border-b pb-4'>
            <span className='text-muted-foreground'>Signed in at</span>
            <span>{createdAtAbsolute}</span>
          </div>

          <div className='flex flex-col gap-1'>
            <span className='mb-1 text-muted-foreground'>User agent</span>
            <span className='break-words rounded bg-muted/50 p-2 font-mono text-xs'>
              {session.userAgent || 'N/A'}
            </span>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            {session.isCurrent ? (
              <LogOutDialog triggerVariant='destructive' />
            ) : (
              <SessionRevokeDialog session={session} triggerVariant='destructive' />
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
