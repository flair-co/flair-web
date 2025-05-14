import {faker} from '@faker-js/faker';
import {expect, test} from '@playwright/test';

test.describe('Signup', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/signup');
  });

  test('should successfully create a new account', async ({page}) => {
    const uniqueEmail = faker.internet.email();
    const testName = faker.person.fullName();
    const testPassword = faker.internet.password();

    await page.getByTestId('signup-email').fill(uniqueEmail);
    await page.getByTestId('signup-name').fill(testName);
    await page.getByTestId('signup-password').fill(testPassword);

    await expect(page.getByTestId('signup-email')).toHaveValue(uniqueEmail);
    await expect(page.getByTestId('signup-name')).toHaveValue(testName);
    await expect(page.getByTestId('signup-password')).toHaveValue(testPassword);

    await page.getByTestId('signup-submit').click();

    await expect(page.getByTestId('signup-loading')).toBeVisible();
    await expect(page).toHaveURL(/.*\/verify-email/);
  });
});
