import {expect, test} from '@playwright/test';
import {VERIFIED_USER_AUTH_FILE} from 'test/constants/auth.constants';

test.use({storageState: VERIFIED_USER_AUTH_FILE});

test.describe('Settings navigation', () => {
  test('keeps the breadcrumb and section navigation aligned with the active page', async ({
    page,
  }) => {
    const routes = [
      {path: 'account', label: 'Account'},
      {path: 'security', label: 'Security'},
      {path: 'appearance', label: 'Appearance'},
    ];

    for (const route of routes) {
      await page.goto(`/settings/${route.path}`);

      await expect(page.getByRole('link', {name: route.label, exact: true}).last()).toHaveAttribute(
        'aria-current',
        'page',
      );
      await expect(
        page.getByRole('link', {name: route.label, exact: true}).first(),
      ).toHaveAttribute('aria-current', 'page');
      await expect(page.getByRole('link', {name: 'Settings', exact: true})).toBeVisible();
      await expect(page.getByRole('link', {name: route.label, exact: true}).first()).toBeVisible();
    }
  });
});
