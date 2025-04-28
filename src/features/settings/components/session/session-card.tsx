import {format, formatDistanceToNow} from 'date-fns';
import {Monitor, Smartphone, Tablet, TvMinimal} from 'lucide-react';

import {Card} from '@/components/ui/card';
import {Session} from '@/features/settings/types/session';

import {LogOutDialog} from './log-out-dialog';
import {SessionRevokeDialog} from './session-revoke-dialog';

type SessionCardProps = {
  session: Session;
  hideRevokeButton?: boolean;
};

export function SessionCard({session, hideRevokeButton = false}: SessionCardProps) {
  const lastSeenAt = format(session.lastSeenAt, 'MMM d, yyyy HH:mm');
  const lastSeenAtRelative = formatDistanceToNow(lastSeenAt, {addSuffix: true});

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
    <Card className='group bg-sidebar transition-colors hover:bg-accent/50'>
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
                <div className='mt-1 flex flex-wrap items-center gap-x-2 gap-y-1'>
                  <div className='flex items-center gap-1.5'>
                    <span className='block h-2 w-2 rounded-full bg-success'></span>
                    <span className='font-medium text-success'>Current session</span>
                  </div>
                  {session.clientLocation && session.clientLocation !== 'Unknown' && (
                    <span className='flex items-center gap-1'>
                      <span>·</span>
                      <span>{session.clientLocation}</span>
                    </span>
                  )}
                </div>
              ) : (
                <div className='mt-1' title={`${lastSeenAt}`}>
                  {`Last seen ${lastSeenAtRelative}`}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='invisible flex-shrink-0 opacity-0 transition-opacity duration-150 ease-in-out group-hover:visible group-hover:opacity-100'>
          {session.isCurrent && <LogOutDialog />}
          {!(hideRevokeButton || session.isCurrent) && <SessionRevokeDialog session={session} />}
        </div>
      </div>
    </Card>
  );
}
