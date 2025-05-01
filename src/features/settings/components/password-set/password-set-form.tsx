import {zodResolver} from '@hookform/resolvers/zod';
import {Loader} from 'lucide-react';
import {useForm} from 'react-hook-form';

import {Button} from '@/components/ui/button';
import {DialogClose, DialogFooter} from '@/components/ui/dialog';
import {Form, FormField} from '@/components/ui/form';
import {PasswordInputField} from '@/components/ui/password-input-field';
import {useMediaQuery} from '@/hooks/use-media-query';
import {cn} from '@/utils/cn';

import {useSetPassword} from '../../api/use-set-password';
import {PasswordSetDto, passwordSetDtoSchema} from '../../types/passsword-set.dto';

type PasswordSetFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function PasswordSetForm({setOpen}: PasswordSetFormProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const form = useForm<PasswordSetDto>({
    resolver: zodResolver(passwordSetDtoSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const {setPassword, isPending} = useSetPassword();

  async function onSubmit(formData: PasswordSetDto) {
    console.log(formData);
    await setPassword(formData, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  }

  return (
    <div className={cn(!isDesktop && 'px-4')}>
      <Form {...form}>
        <form
          className={cn('grid items-start gap-4')}
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FormField
            control={form.control}
            name='password'
            render={({field, fieldState}) => (
              <PasswordInputField<PasswordSetDto, 'password'>
                field={field}
                fieldState={fieldState}
                label='New password'
                id='new-password'
                autoComplete='new-password'
                disabled={isPending}
              />
            )}
          />
          <div className='mt-4 flex w-full gap-4'>
            {isDesktop && (
              <DialogFooter className='w-full'>
                <DialogClose asChild>
                  <Button variant='outline' type='button'>
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            )}
            <Button type='submit' disabled={isPending} className={cn(!isDesktop && 'w-full')}>
              {isPending ? (
                <>
                  <span>Setting password...</span>
                  <Loader className='ml-2 h-4 w-4 animate-slow-spin' />
                </>
              ) : (
                <span>Set password</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
