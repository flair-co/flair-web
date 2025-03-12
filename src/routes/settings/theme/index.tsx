import {createFileRoute} from '@tanstack/react-router';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {ThemeSwitcher} from '@/features/settings/components/theme-switcher';

export const Route = createFileRoute('/settings/theme/')({
  component: SettingsThemeIndex,
});

function SettingsThemeIndex() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>Choose the appearance of the application.</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className='mb-6 bg-muted' />
        <ThemeSwitcher />
      </CardContent>
    </Card>
  );
}
