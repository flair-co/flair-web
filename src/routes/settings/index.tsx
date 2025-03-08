import {createFileRoute, redirect} from '@tanstack/react-router';

import {AppBody} from '@/components/shared/layout/app-body';
import {AppHeader} from '@/components/shared/layout/app-header';
import {SettingsBreadcrumb} from '@/features/settings/settings-breadcrumb';

export const Route = createFileRoute('/settings/')({
  component: SettingsIndex,
  beforeLoad: ({context}) => {
    if (!context.isAuthenticated) {
      throw redirect({to: '/login', search: {redirect: location.href}});
    }
  },
});

function SettingsIndex() {
  return (
    <>
      <AppHeader>
        <SettingsBreadcrumb />
      </AppHeader>
      <AppBody>
        <p>Settings</p>
      </AppBody>
    </>
  );
}
