import {Page} from '@playwright/test';

export async function mockCurrentAccount(page: Page) {
  await page.route('http://localhost:3000/accounts/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'account-1',
        name: 'Verified Account',
        email: 'verified@test.com',
        isEmailVerified: true,
      }),
    });
  });
}
