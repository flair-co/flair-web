import {Link, Outlet, createFileRoute, useMatchRoute} from '@tanstack/react-router';
import {Shield, SunMoon, User} from 'lucide-react';

import {AppBody} from '@/components/shared/layout/app-body';
import {AppHeader} from '@/components/shared/layout/app-header';
import {Button} from '@/components/ui/button';
import {SettingsBreadcrumb} from '@/features/settings/components/settings-breadcrumb';
import {cn} from '@/utils/cn';

export const Route = createFileRoute('/settings')({
  component: SettingsIndex,
});

const navItems = [
  {label: 'Account', route: '/settings/account', icon: User},
  {label: 'Security', route: '/settings/security', icon: Shield},
  {label: 'Theme', route: '/settings/theme', icon: SunMoon},
];

function SettingsIndex() {
  const matchRoute = useMatchRoute();

  return (
    <>
      <AppHeader>
        <SettingsBreadcrumb route='/account' />
      </AppHeader>
      <AppBody>
        <div className='mt-4 flex gap-4'>
          <div className='flex flex-col items-start gap-1'>
            {navItems.map((item) => {
              const isActive = matchRoute({to: item.route, fuzzy: true}) as boolean;
              return (
                <Button
                  key={item.label}
                  className='h-fit w-32 p-3'
                  variant='ghost'
                  size='lg'
                  asChild
                >
                  <Link
                    to={item.route}
                    className={cn(
                      'flex items-center !justify-start',
                      isActive && 'bg-sidebar-accent',
                    )}
                  >
                    <item.icon />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>
          <div className='w-full'>
            <Outlet />
          </div>
        </div>
      </AppBody>
    </>
  );
}
