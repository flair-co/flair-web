import {faker} from '@faker-js/faker';
import {test} from '@playwright/test';

import {SignupPage} from './signup.page';

test.describe('Signup', () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({page}) => {
    signupPage = new SignupPage(page);
    await signupPage.navigate();
  });

  test('should successfully create a new account', async () => {
    const uniqueEmail = faker.internet.email();
    const testName = faker.person.fullName();
    const testPassword = faker.internet.password();

    await signupPage.fillEmail(uniqueEmail);
    await signupPage.fillName(testName);
    await signupPage.fillPassword(testPassword);

    await signupPage.expectFilledValues(uniqueEmail, testName, testPassword);

    await signupPage.submit();
    await signupPage.expectRedirectToVerify();
  });
});
