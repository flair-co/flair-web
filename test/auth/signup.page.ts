import {Locator, Page, expect} from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly nameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly emailInvalidError: Locator;
  readonly requiredError: Locator;
  readonly nameTooLongError: Locator;
  readonly passwordTooShortError: Locator;
  readonly passwordTooLongError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('signup-email');
    this.nameInput = page.getByTestId('signup-name');
    this.passwordInput = page.getByTestId('signup-password');
    this.submitButton = page.getByTestId('signup-submit');
    this.requiredError = page.getByText('Required');
    this.emailInvalidError = page.getByText('Please enter a valid email address.');
    this.nameTooLongError = page.getByText('Name must be less than 256 characters.');
    this.passwordTooShortError = page.getByText('Too short. Must be at least 8 characters.');
    this.passwordTooLongError = page.getByText('Too long. Must be less than 256 characters.');
  }

  async navigate() {
    await this.page.goto('/signup');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectFilledValues(email: string, name: string, password: string) {
    await expect(this.emailInput).toHaveValue(email);
    await expect(this.nameInput).toHaveValue(name);
    await expect(this.passwordInput).toHaveValue(password);
  }

  async expectRedirectToVerify() {
    await expect(this.page).toHaveURL(/.*\/verify-email/);
  }

  async expectErrorMessage(messageLocator: Locator) {
    await expect(messageLocator.first()).toBeVisible();
  }
}
