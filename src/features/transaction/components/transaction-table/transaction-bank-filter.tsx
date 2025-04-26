import {useNavigate} from '@tanstack/react-router';
import {Check, ChevronDown, Landmark} from 'lucide-react';
import * as React from 'react';

import {BankIcon} from '@/components/shared/bank-icon';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Separator} from '@/components/ui/separator';
import {Bank} from '@/types/bank';
import {cn} from '@/utils/cn';

import {TransactionFilterParams} from '../../types/search-params';

type TransactionBankFilterProps = {
  filters: TransactionFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<TransactionFilterParams>>;
};

export function TransactionBankFilter({filters, setFilters}: TransactionBankFilterProps) {
  const navigate = useNavigate({from: '/transactions'});

  const selectedValues = filters.banks || [];

  const handleSelect = async (option: Bank) => {
    const isSelected = selectedValues.includes(option);
    const newSelectedValues = isSelected
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option];

    await navigate({
      search: (prev) => ({
        ...prev,
        banks: newSelectedValues.length === 0 ? undefined : newSelectedValues,
      }),
    });
    setFilters((prev) => ({...prev, banks: newSelectedValues}));
  };

  const handleReset = async () => {
    await navigate({search: (prev) => ({...prev, banks: undefined})});
    setFilters((prev) => ({...prev, banks: []}));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn('h-8', selectedValues.length === 0 ? 'border-dashed' : 'border')}
        >
          <Landmark />
          Bank account
          {selectedValues.length > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge variant='secondary' className='rounded-sm px-1 font-normal lg:hidden'>
                {selectedValues.length}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {selectedValues.length > 3 ? (
                  <Badge variant='secondary' className='rounded-sm px-2 font-normal'>
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  selectedValues.map((bank) => {
                    return (
                      <div
                        className='flex items-center rounded-md bg-accent px-2 py-[1px]'
                        key={bank}
                      >
                        <BankIcon key={bank} bank={bank} className='mr-2 w-4' />
                        {bank}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[165px] p-0' align='start'>
        <Command>
          <ScrollArea className='h-fit'>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {Object.values(Bank).map((bank) => {
                  const isSelected = selectedValues.includes(bank);
                  return (
                    <CommandItem key={bank} onSelect={() => handleSelect(bank)}>
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <Check />
                      </div>
                      <BankIcon key={bank} bank={bank} className='mr-2 w-4' />
                      {bank}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedValues.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem onSelect={handleReset} className='justify-center text-center'>
                      Reset
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
