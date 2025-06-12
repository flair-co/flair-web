import {faker} from '@faker-js/faker';
import {expect, test} from '@playwright/test';
import {AccountSettingsPage} from 'test/pages/account-settings.page';
import {HomePage} from 'test/pages/home.page';
import {LoginPage} from 'test/pages/login.page';
import {
  UNVERIFIED_ACCOUNT_EMAIL,
  VERIFIED_ACCOUNT_EMAIL,
  VERIFIED_ACCOUNT_PASSWORD,
} from 'test/utils/seed.constants';

test.describe('Account Settings: Email change', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let accountSettingsPage: AccountSettingsPage;

  test.beforeEach(async ({page}) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    accountSettingsPage = new AccountSettingsPage(page);

    await loginPage.login(VERIFIED_ACCOUNT_EMAIL, VERIFIED_ACCOUNT_PASSWORD);
    await homePage.expectToBeOnPage();
    await accountSettingsPage.navigate();
    await accountSettingsPage.changeEmailButton.click();
  });

  test('should show error for email already in use', async () => {
    await accountSettingsPage.checkEmailAvailability(UNVERIFIED_ACCOUNT_EMAIL);
    await expect(accountSettingsPage.emailAlreadyInUseError).toBeVisible();
  });

  test('should show error when new email is the same as the current one', async () => {
    await accountSettingsPage.checkEmailAvailability(VERIFIED_ACCOUNT_EMAIL);
    await expect(accountSettingsPage.sameEmailError).toBeVisible();
  });

  test('should show error for invalid email format', async () => {
    await accountSettingsPage.checkEmailAvailability('not-an-email');
    await expect(accountSettingsPage.invalidEmailError).toBeVisible();
  });

  test('should allow navigating back to step 1 from step 2', async () => {
    const newEmail = faker.internet.email();
    await accountSettingsPage.checkEmailAvailability(newEmail);

    await expect(accountSettingsPage.getStep2DescriptionLocator(newEmail)).toBeVisible();
    await accountSettingsPage.backButton.click();

    await expect(accountSettingsPage.emailChangeStep1Description).toBeVisible();
    await expect(accountSettingsPage.newEmailInput).toBeEmpty();
  });
});
