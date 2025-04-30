import {Skeleton} from '@/components/ui/skeleton';

import {useGetSessions} from '../../api/use-get-sessions';
import {SessionCard} from './session-card';

export function SessionList() {
  const {sessions, isPending} = useGetSessions();

  return (
    <div className='mt-4'>
      <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
        <div>
          <h2 className='mb-1 text-lg font-medium'>Sessions</h2>
          <p className='mr-8 text-sm text-muted-foreground'>Devices logged into your account.</p>
        </div>
      </div>
      <div className='mt-4 space-y-4'>
        {isPending && (
          <>
            <Skeleton className='h-[4.5rem] w-full rounded-lg bg-muted' />
          </>
        )}
        {sessions &&
          sessions.length > 0 &&
          sessions.map((session) => <SessionCard key={session.id} session={session} />)}
      </div>
    </div>
  );
}
