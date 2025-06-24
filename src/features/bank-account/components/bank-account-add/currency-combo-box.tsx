import {VisuallyHidden} from '@radix-ui/react-visually-hidden';
import {ChevronDown} from 'lucide-react';
import {useState} from 'react';

import {Button} from '@/components/ui/button';
import {Drawer, DrawerContent, DrawerTitle, DrawerTrigger} from '@/components/ui/drawer';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {useMediaQuery} from '@/hooks/use-media-query';
import {cn} from '@/utils/cn';

import {CurrencyList} from './currency-list';

type CurrencyComboBoxProps = {
  onChange: (currency: string) => void;
  isPending?: boolean;
  error?: boolean;
};

export function CurrencyComboBox({onChange, isPending, error}: CurrencyComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>('EUR');

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleSetSelectedCurrency = (currency: string | null) => {
    setSelectedCurrency(currency);
    if (currency) {
      onChange(currency);
    }
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            disabled={isPending}
            className={cn('justify-start px-3', error && 'border-destructive')}
          >
            <div className='flex w-full items-center justify-between'>
              {selectedCurrency ? <p>{selectedCurrency}</p> : <p>Select a currency</p>}
              <ChevronDown className='h-4 w-4 text-muted-foreground' />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
          <CurrencyList
            setOpen={setOpen}
            setSelectedCurrency={handleSetSelectedCurrency}
            selectedCurrency={selectedCurrency}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <VisuallyHidden>
        <DrawerTitle>Select a currency</DrawerTitle>
      </VisuallyHidden>
      <DrawerTrigger asChild>
        <Button variant='outline' disabled={isPending} className='justify-start'>
          {selectedCurrency ? <>{selectedCurrency}</> : <>Select a currency</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mt-4 border-t'>
          <CurrencyList
            setOpen={setOpen}
            setSelectedCurrency={handleSetSelectedCurrency}
            selectedCurrency={selectedCurrency}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
