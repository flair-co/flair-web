import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect} from 'react';
import {useForm} from 'react-hook-form';

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
import {NameChangeDto, nameChangeDtoSchema} from '../types/name-change.dto';

type UsernameChangeFormProps = {
  currentUsername: User['name'];
};

export function UsernameChangeForm({currentUsername}: UsernameChangeFormProps) {
  const {patchUser, isPending} = usePatchUser();

  const form = useForm<NameChangeDto>({
    resolver: zodResolver(nameChangeDtoSchema),
    mode: 'onChange',
    defaultValues: {name: currentUsername},
  });

  const watchedName = form.watch('name');

  const handleBlur = async () => {
    const isValid = await form.trigger('name');

    const trimmedWatchedName = watchedName.trim();
    const trimmedCurrentName = currentUsername.trim();
    const hasNameChanged = trimmedWatchedName !== trimmedCurrentName;
    const isValidName = isValid && trimmedWatchedName !== '';

    if (hasNameChanged && isValidName) {
      const trimmedName = {name: form.getValues().name.trim()};
      patchUser(trimmedName);
    }
  };

  useEffect(() => {
    const submissionAttemptFailed =
      form.formState.isSubmitted && !isPending && !form.formState.isSubmitSuccessful;

    if (submissionAttemptFailed) {
      form.reset({name: currentUsername});
    }
  }, [form, currentUsername, isPending]);

  return (
    <Form {...form}>
      <form className='flex flex-col gap-2' noValidate>
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
                  onChange={async (e) => {
                    field.onChange(e);
                    await form.trigger('name');
                  }}
                  onBlur={async () => {
                    field.onBlur();
                    await handleBlur();
                  }}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className='text-xs'>
                {isPending
                  ? 'Saving changes...'
                  : 'This is your display name. It can be your real name or an alias.'}
              </FormDescription>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
