import {CheckIcon, ClipboardIcon} from 'lucide-react';
import * as React from 'react';

import {cn} from '@/utils/cn';

import {Button} from '../ui/button';

type CopyToClipboardButtonProps = {
  value: string;
  label?: string;
};

export function CopyToClipboardButton({value, label = 'Copy'}: CopyToClipboardButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);
  const accessibleLabel = hasCopied ? `${label} copied` : label;

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  const handleCopyToClipboard = (value: string) => {
    void navigator.clipboard.writeText(value);
    setHasCopied(true);
  };

  return (
    <>
      <Button
        size='icon'
        variant='outline'
        className={cn(
          'relative z-10 h-11 w-11 shrink-0 text-foreground hover:bg-accent sm:h-10 sm:w-10 [&_svg]:h-3 [&_svg]:w-3',
        )}
        aria-label={accessibleLabel}
        onClick={() => {
          handleCopyToClipboard(value);
        }}
      >
        <span className='sr-only'>{accessibleLabel}</span>
        {hasCopied ? <CheckIcon className='text-success' /> : <ClipboardIcon />}
      </Button>
      <span className='sr-only' aria-live='polite' data-testid='copy-status'>
        {hasCopied ? accessibleLabel : ''}
      </span>
    </>
  );
}
