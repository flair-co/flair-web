import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {useTheme} from '@/hooks/use-theme';
import {Theme, themes} from '@/providers/theme.provider';
import {cn} from '@/utils/cn';

export function ThemeSwitcher() {
  const {theme, setTheme} = useTheme();

  return (
    <RadioGroup
      defaultValue='light'
      className='flex gap-5'
      value={theme}
      onValueChange={(value: Theme) => setTheme(value)}
    >
      {themes.map((themeValue) => (
        <div key={themeValue} className='relative'>
          <label htmlFor={themeValue} className='cursor-pointer'>
            <div
              className={cn(
                'flex w-fit flex-col rounded-b-lg rounded-t-lg border hover:border-primary',
                theme === themeValue && 'border-primary',
              )}
            >
              {themeValue === 'system' ? (
                <div className='relative'>
                  <div
                    className='relative overflow-hidden rounded-t-lg bg-background p-3'
                    data-theme-preview='light'
                  >
                    <div>
                      <div className='flex gap-3'>
                        <div className='min-h-3 min-w-10 rounded-md bg-muted'></div>
                        <div className='min-h-3 min-w-10 rounded-md bg-muted'></div>
                      </div>
                      <div className='mt-3 min-h-14 w-40 rounded-md bg-muted pt-2'>
                        <div className='flex h-4 min-w-6 items-center bg-secondary'>
                          <div className='ml-1 h-2 w-fit min-w-10 rounded-md bg-primary'></div>
                        </div>
                      </div>
                    </div>
                    <div
                      data-theme-preview='dark'
                      className='absolute inset-0 flex flex-col bg-background p-3'
                      style={{
                        clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 100% 0)',
                        zIndex: 10,
                      }}
                    >
                      <div className='flex gap-3'>
                        <div className='min-h-3 min-w-10 rounded-md bg-muted'></div>
                        <div className='min-h-3 min-w-10 rounded-md bg-muted'></div>
                      </div>
                      <div className='mt-3 min-h-14 w-40 rounded-md bg-muted pt-2'>
                        <div className='flex h-4 min-w-6 items-center bg-secondary'>
                          <div className='ml-1 h-2 w-fit min-w-10 rounded-md bg-primary'></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className='pointer-events-none absolute inset-0'
                      style={{
                        background:
                          'linear-gradient(to bottom right, transparent calc(100% - 1px), var(--border) calc(100%), transparent calc(100% + 1px))',
                        zIndex: 20,
                      }}
                    ></div>
                  </div>
                  <div
                    className='relative flex items-center space-x-2 px-3 py-2'
                    style={{zIndex: 30}}
                  >
                    <RadioGroupItem value='system' id='system' className='peer' />
                    <p className='capitalize'>system</p>
                  </div>
                </div>
              ) : (
                <div data-theme-preview={themeValue}>
                  <div className='flex flex-col rounded-t-lg border-b bg-background p-3'>
                    <div className='flex gap-3'>
                      <div className='min-h-3 min-w-10 rounded-md bg-muted'></div>
                      <div className='min-h-3 min-w-10 rounded-md bg-muted'></div>
                    </div>
                    <div className='mt-3 min-h-14 w-40 rounded-md bg-muted pt-2'>
                      <div className='flex h-4 min-w-6 items-center bg-secondary'>
                        <div className='ml-1 h-2 w-fit min-w-10 rounded-md bg-primary'></div>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2 px-3 py-2'>
                    <RadioGroupItem value={themeValue} id={themeValue} className='peer' />
                    <p className='capitalize'>{themeValue}</p>
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>
      ))}
    </RadioGroup>
  );
}
