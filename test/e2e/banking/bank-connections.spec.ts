import {expect, test} from '@playwright/test';

import {VERIFIED_USER_AUTH_FILE} from '../../constants/auth.constants';

test.use({storageState: VERIFIED_USER_AUTH_FILE});

test.describe('bank connections', () => {
  test('shows seeded connected accounts and callback success feedback', async ({page}) => {
    await page.goto('/bank-connections?result=connected');

    await expect(page.getByText('ABN AMRO', {exact: true})).toBeVisible();
    await expect(page.getByText('Daily spending', {exact: true})).toBeVisible();
    await expect(page.getByText('Bank connected')).toBeVisible();
    await expect(page).toHaveURL(/\/bank-connections$/);
  });

  test('does not overflow horizontally on a narrow viewport', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.goto('/bank-connections');

    await expect(page.getByText('ABN AMRO', {exact: true})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      await page.evaluate(() => window.innerWidth),
    );
  });

  test('displays the seeded bank data preview', async ({page}) => {
    await page.goto('/bank-connections');

    await expect(page.getByText('available · primary')).toBeVisible();
    await expect(page.getByText('Provider purchase')).toBeVisible();
  });
});
