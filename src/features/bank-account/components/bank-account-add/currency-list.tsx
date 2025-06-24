import {useMemo} from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import {currencyCodes} from '../../constants/currency-codes';

type CurrencyListProps = {
  setOpen: (open: boolean) => void;
  setSelectedCurrency: (currency: string | null) => void;
};

export function CurrencyList({setOpen, setSelectedCurrency}: CurrencyListProps) {
  const placeholder = useMemo(() => `Search ${currencyCodes.length} supported currencies...`, []);

  return (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No supported currencies found.</CommandEmpty>
        <CommandGroup>
          {currencyCodes.map((currency) => (
            <CommandItem
              key={currency}
              value={currency}
              onSelect={() => {
                setSelectedCurrency(currency);
                setOpen(false);
              }}
            >
              {currency}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
