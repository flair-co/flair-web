import {faker} from '@faker-js/faker';
import {test} from '@playwright/test';

import {SignupPage} from './signup.page';

test.describe('Signup', () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({page}) => {
    signupPage = new SignupPage(page);
    await signupPage.navigate();
  });

  test('should successfully create a new account and redirect to verify email page', async () => {
    const email = faker.internet.email();
    const name = faker.person.fullName();
    const password = faker.internet.password();

    await signupPage.fillEmail(email);
    await signupPage.fillName(name);
    await signupPage.fillPassword(password);

    await signupPage.expectFilledValues(email, name, password);

    await signupPage.submit();
    await signupPage.expectRedirectToVerify();
  });

  test('should display error for empty email', async () => {
    await signupPage.emailInput.focus();
    await signupPage.submit();
    await signupPage.expectErrorMessage(signupPage.requiredError);
  });

  test('should display error for empty name', async () => {
    await signupPage.nameInput.focus();
    await signupPage.submit();
    await signupPage.expectErrorMessage(signupPage.requiredError);
  });

  test('should display error for empty password', async () => {
    await signupPage.passwordInput.focus();
    await signupPage.submit();
    await signupPage.expectErrorMessage(signupPage.requiredError);
  });

  test('should show error for password too short', async () => {
    await signupPage.fillPassword('123');
    await signupPage.submit();
    await signupPage.expectErrorMessage(signupPage.passwordTooShortError);
  });

  test('should show error for password too long', async () => {
    const longPassword = faker.string.alphanumeric(256);
    await signupPage.fillPassword(longPassword);
    await signupPage.submit();
    await signupPage.expectErrorMessage(signupPage.passwordTooLongError);
  });

  test('should show error for invalid email format', async () => {
    await signupPage.fillEmail('invalid-email');
    await signupPage.submit();
    await signupPage.expectErrorMessage(signupPage.emailInvalidError);
  });

  test('should show error for name too long', async () => {
    const longName = faker.string.alphanumeric(256);
    await signupPage.fillName(longName);
    await signupPage.submit();
    await signupPage.expectErrorMessage(signupPage.nameTooLongError);
  });
});
