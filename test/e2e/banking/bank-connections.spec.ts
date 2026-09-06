import {expect, test} from '@playwright/test';

import {PW_CHANGE_USER_AUTH_FILE, VERIFIED_USER_AUTH_FILE} from '../../constants/auth.constants';

test.describe('bank connections', () => {
  test.use({storageState: VERIFIED_USER_AUTH_FILE});

  test('shows seeded connection data and callback success feedback', async ({page}) => {
    await page.goto('/bank-connections?result=connected');

    await expect(page.getByText('ABN AMRO', {exact: true})).toBeVisible();
    await expect(page.getByText('Daily spending', {exact: true})).toBeVisible();
    await expect(page.getByText('available · primary')).toBeVisible();
    await expect(page.getByText('Provider purchase')).toBeVisible();
    await expect(page.getByText('Bank connected')).toBeVisible();
    await expect(page).toHaveURL(/\/bank-connections$/);
  });
});

test.describe('bank connections without connected data', () => {
  test.use({storageState: PW_CHANGE_USER_AUTH_FILE});

  test('shows the connect prompt for an account without connections', async ({page}) => {
    await page.goto('/bank-connections');

    await expect(page.getByRole('heading', {name: 'No banks connected'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Connect ABN AMRO'}).first()).toBeVisible();
  });
});
