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

import {Currency} from '../../types/currency';
import {CurrencyDisplay} from './currency-flag';

type CurrencyListProps = {
  currencies: Currency[] | undefined;
  setOpen: (open: boolean) => void;
  setSelectedCurrency: (currency: Currency | null) => void;
  selectedCurrency: string | null;
};

export function CurrencyList({
  currencies,
  setOpen,
  setSelectedCurrency,
  selectedCurrency,
}: CurrencyListProps) {
  const placeholder = useMemo(() => `Search ${currencies?.length} supported currencies...`, []);

  return (
    <Command>
      <CommandInput placeholder={placeholder} disabled={!currencies} />
      <CommandList className='max-h-[250px]'>
        <CommandEmpty>No supported currencies found.</CommandEmpty>
        <ScrollArea onWheel={(e) => e.stopPropagation()}>
          <div className='max-h-[250px]'>
            <CommandGroup>
              {currencies &&
                currencies.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={currency.name}
                    className='mr-2 flex items-center justify-between'
                    onSelect={() => {
                      setSelectedCurrency(currency);
                      setOpen(false);
                    }}
                  >
                    <CurrencyDisplay currency={currency} className='pl-1' />
                    <Check
                      className={cn(
                        'ml-2 h-4 w-4',
                        selectedCurrency === currency.code ? 'opacity-100' : 'opacity-0',
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
