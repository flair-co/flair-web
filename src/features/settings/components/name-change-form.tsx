import {zodResolver} from '@hookform/resolvers/zod';
import {Loader} from 'lucide-react';
import {useForm} from 'react-hook-form';

import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {User} from '@/types/user';
import {cn} from '@/utils/cn';

import {usePatchUser} from '../api/use-patch-user';
import {NameDto, nameDtoSchema} from '../types/name.dto';

type NameChangeFormProps = {
  currentName: User['name'];
};

export function NameChangeForm({currentName}: NameChangeFormProps) {
  const {patchUser, isPending} = usePatchUser();

  const form = useForm<NameDto>({
    resolver: zodResolver(nameDtoSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {name: currentName},
  });

  function onSubmit(formData: NameDto) {
    patchUser(formData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className='flex gap-2'>
        <FormField
          control={form.control}
          name='name'
          render={({field, fieldState}) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  id='name'
                  placeholder='Username'
                  type='text'
                  autoCapitalize='none'
                  autoComplete='name'
                  autoCorrect='off'
                  disabled={isPending}
                  className={cn(fieldState.error && 'border-destructive')}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className='mr-10'>
                This is your display name. It can be your real name or an alias.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isPending} className='w-fit'>
          {isPending ? (
            <>
              <span>Saving...</span>
              <Loader className='ml-2 h-4 w-4 animate-slow-spin' />
            </>
          ) : (
            <span>Save</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
