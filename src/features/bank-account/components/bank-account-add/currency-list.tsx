import {Check} from 'lucide-react';
import {useMemo} from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {ScrollArea} from '@/components/ui/scroll-area';
import {cn} from '@/utils/cn';

import {currencyCodes} from '../../constants/currency-codes';

type CurrencyListProps = {
  setOpen: (open: boolean) => void;
  setSelectedCurrency: (currency: string | null) => void;
  selectedCurrency: string | null;
};

export function CurrencyList({setOpen, setSelectedCurrency, selectedCurrency}: CurrencyListProps) {
  const placeholder = useMemo(() => `Search ${currencyCodes.length} supported currencies...`, []);

  return (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandList className='max-h-[250px]'>
        <CommandEmpty>No supported currencies found.</CommandEmpty>
        <ScrollArea onWheel={(e) => e.stopPropagation()}>
          <div className='max-h-[250px]'>
            <CommandGroup>
              {currencyCodes.map((currency) => (
                <CommandItem
                  key={currency}
                  value={currency}
                  className='flex items-center justify-between'
                  onSelect={() => {
                    setSelectedCurrency(currency);
                    setOpen(false);
                  }}
                >
                  <span>{currency}</span>
                  <Check
                    className={cn(
                      'ml-2 h-4 w-4',
                      selectedCurrency === currency ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        </ScrollArea>
      </CommandList>
    </Command>
  );
}
