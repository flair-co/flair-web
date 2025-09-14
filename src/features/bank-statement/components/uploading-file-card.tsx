import {useQueryClient} from '@tanstack/react-query';
import {AlertCircle, CheckCircle2, Loader, X} from 'lucide-react';
import {useEffect} from 'react';

import {Button} from '@/components/ui/button';
import {Progress} from '@/components/ui/progress';
import {useUploads} from '@/hooks/use-uploads';
import {UploadingFile} from '@/providers/uploads.provider';

import {useGetUploadStatus} from '../api/use-get-upload-status';

type UploadingFileCardProps = {
  uploadingFile: UploadingFile;
  onDismiss: (jobId: string) => void;
};

export function UploadingFileCard({uploadingFile, onDismiss}: UploadingFileCardProps) {
  const {updateUploadingFileStatus} = useUploads();
  const {
    data: job,
    isError,
    error,
  } = useGetUploadStatus(uploadingFile.bankAccountId, uploadingFile.jobId);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (uploadingFile.status !== 'processing') return;

    const isJobDone = job?.status === 'completed' || job?.status === 'failed';
    const isJobNotFound = isError && error.status === 404;

    if (isJobDone || isJobNotFound) {
      void queryClient.invalidateQueries({queryKey: ['bank-statements']});
      const hasFailed = job?.status === 'failed' || (isError && !isJobNotFound);
      updateUploadingFileStatus(uploadingFile.jobId, hasFailed ? 'failed' : 'completed');
    }
  }, [
    job,
    isError,
    error,
    uploadingFile.jobId,
    uploadingFile.status,
    queryClient,
    updateUploadingFileStatus,
  ]);

  const getStatusInfo = () => {
    switch (uploadingFile.status) {
      case 'completed':
        return {
          icon: <CheckCircle2 className='h-5 w-5 text-green-500' />,
          message: 'Completed',
          progress: 100,
        };
      case 'failed':
        return {
          icon: <AlertCircle className='h-5 w-5 text-destructive' />,
          message: job?.failedReason || 'An error occurred',
          progress: job?.progress || 0,
        };
      case 'processing':
      default:
        return {
          icon: <Loader className='h-5 w-5 animate-slow-spin text-muted-foreground' />,
          message: `Processing... ${job?.progress || 0}%`,
          progress: job?.progress || 0,
        };
    }
  };

  const {icon, message, progress} = getStatusInfo();
  const isFinished = uploadingFile.status === 'completed' || uploadingFile.status === 'failed';

  return (
    <div className='flex items-center space-x-3'>
      <div className='flex-shrink-0'>{icon}</div>
      <div className='w-full overflow-hidden'>
        <p className='truncate text-sm font-medium'>{uploadingFile.file.name}</p>
        <p className='text-xs text-muted-foreground'>{message}</p>
        {uploadingFile.status === 'processing' && (
          <Progress value={progress} className='mt-1 h-1.5' />
        )}
      </div>
      <div className='flex-shrink-0'>
        {isFinished && (
          <Button
            size='icon'
            variant='ghost'
            className='h-6 w-6 p-4'
            onClick={() => onDismiss(uploadingFile.jobId)}
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
}
