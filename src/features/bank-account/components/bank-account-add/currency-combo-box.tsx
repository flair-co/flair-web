import {ChevronDown} from 'lucide-react';
import {useState} from 'react';

import {Button} from '@/components/ui/button';
import {Drawer, DrawerContent, DrawerTrigger} from '@/components/ui/drawer';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {useMediaQuery} from '@/hooks/use-media-query';
import {cn} from '@/utils/cn';

import {useGetCurrencies} from '../../api/use-get-currencies';
import {Currency} from '../../types/currency';
import {CurrencyDisplay} from './currency-flag';
import {CurrencyList} from './currency-list';

type CurrencyComboBoxProps = {
  onChange: (currency: string) => void;
  isPending?: boolean;
  error?: boolean;
};

export function CurrencyComboBox({onChange, isPending, error}: CurrencyComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>();

  const {currencies, isPending: isCurrenciesPending} = useGetCurrencies();

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleSetSelectedCurrency = (currency: Currency | null) => {
    setSelectedCurrency(currency);
    if (currency) {
      onChange(currency.code);
    }
  };

  const triggerContent = selectedCurrency ? (
    <CurrencyDisplay currency={selectedCurrency} showName={false} />
  ) : (
    <p className='text-muted-foreground'>Select a currency</p>
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            disabled={isPending || isCurrenciesPending}
            className={cn('w-full justify-start px-3', error && 'border-destructive')}
            role='combobox'
            aria-expanded={open}
          >
            <div className='flex w-full items-center justify-between'>
              {triggerContent}
              <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
          <CurrencyList
            currencies={currencies}
            setOpen={setOpen}
            setSelectedCurrency={handleSetSelectedCurrency}
            selectedCurrency={selectedCurrency?.code ?? null}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant='outline'
          disabled={isPending || isCurrenciesPending}
          className='w-full justify-start'
        >
          {triggerContent}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mt-4 border-t'>
          <CurrencyList
            currencies={currencies}
            setOpen={setOpen}
            setSelectedCurrency={handleSetSelectedCurrency}
            selectedCurrency={selectedCurrency?.code ?? null}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
