import {zodResolver} from '@hookform/resolvers/zod';
import {Eye, EyeOff, Loader} from 'lucide-react';
import {useState} from 'react';
import {useForm} from 'react-hook-form';

import {Button} from '@/components/ui/button';
import {DialogClose, DialogFooter} from '@/components/ui/dialog';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {useMediaQuery} from '@/hooks/use-media-query';
import {cn} from '@/utils/cn';

import {useChangePassword} from '../api/use-change-password';
import {PasswordChangeDto, passwordChangeDtoSchema} from '../types/password-change.dto';

type PasswordChangeFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function PasswordChangeForm({setOpen}: PasswordChangeFormProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const form = useForm<PasswordChangeDto>({
    resolver: zodResolver(passwordChangeDtoSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const {changePassword, isPending} = useChangePassword();

  async function onSubmit(formData: PasswordChangeDto) {
    await changePassword(formData, {
      onError: (error) => {
        if (error.status === 401) {
          form.setError(
            'currentPassword',
            {message: 'Invalid current password.'},
            {shouldFocus: true},
          );
        }
      },
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
            name='currentPassword'
            render={({field, fieldState}) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <div className='flex'>
                    <Input
                      {...field}
                      id='current-password'
                      type={isPasswordVisible ? 'text' : 'password'}
                      autoCapitalize='none'
                      autoComplete='current-password'
                      autoCorrect='off'
                      disabled={isPending}
                      className={cn(
                        'z-10',
                        field.value && 'rounded-r-none border-r-0',
                        fieldState.error && 'border-destructive',
                      )}
                    />
                    {field.value && (
                      <TooltipProvider delayDuration={500}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                              variant='outline'
                              type='button'
                              className={cn(
                                'rounded-l-none border-l-0',
                                fieldState.error && 'border-destructive',
                              )}
                              disabled={isPending}
                            >
                              {isPasswordVisible ? (
                                <EyeOff className='w-4 text-muted-foreground' />
                              ) : (
                                <Eye className='w-4 text-muted-foreground' />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isPasswordVisible ? 'Hide password' : 'Show password'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='newPassword'
            render={({field, fieldState}) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <div className='flex'>
                    <Input
                      {...field}
                      id='new-password'
                      type={isPasswordVisible ? 'text' : 'password'}
                      autoCapitalize='none'
                      autoComplete='new-password'
                      autoCorrect='off'
                      disabled={isPending}
                      className={cn(
                        'z-10',
                        field.value && 'rounded-r-none border-r-0',
                        fieldState.error && 'border-destructive',
                      )}
                    />
                    {field.value && (
                      <TooltipProvider delayDuration={500}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                              variant='outline'
                              type='button'
                              className={cn(
                                'rounded-l-none border-l-0',
                                fieldState.error && 'border-destructive',
                              )}
                              disabled={isPending}
                            >
                              {isPasswordVisible ? (
                                <EyeOff className='w-4 text-muted-foreground' />
                              ) : (
                                <Eye className='w-4 text-muted-foreground' />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isPasswordVisible ? 'Hide password' : 'Show password'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmNewPassword'
            render={({field, fieldState}) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <div className='flex'>
                    <Input
                      {...field}
                      id='confirm-new-password'
                      type={isPasswordVisible ? 'text' : 'password'}
                      autoCapitalize='none'
                      autoComplete='new-password'
                      autoCorrect='off'
                      disabled={isPending}
                      className={cn(
                        'z-10',
                        field.value && 'rounded-r-none border-r-0',
                        fieldState.error && 'border-destructive',
                      )}
                    />
                    {field.value && (
                      <TooltipProvider delayDuration={500}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                              variant='outline'
                              type='button'
                              className={cn(
                                'rounded-l-none border-l-0',
                                fieldState.error && 'border-destructive',
                              )}
                              disabled={isPending}
                            >
                              {isPasswordVisible ? (
                                <EyeOff className='w-4 text-muted-foreground' />
                              ) : (
                                <Eye className='w-4 text-muted-foreground' />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isPasswordVisible ? 'Hide password' : 'Show password'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='mt-4 flex w-full gap-4'>
            {isDesktop && (
              <DialogFooter className='w-full'>
                <DialogClose asChild>
                  <Button variant='outline' type='button' className='w-full'>
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            )}
            <Button type='submit' disabled={isPending} className='w-full'>
              {isPending ? (
                <>
                  <span>Changing password...</span>
                  <Loader className='ml-2 h-4 w-4 animate-slow-spin' />
                </>
              ) : (
                <span>Change password</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
