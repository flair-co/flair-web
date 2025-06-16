import {Locator, Page} from '@playwright/test';

export class SecuritySettingsPage {
  readonly page: Page;
  readonly sessionCards: Locator;
  readonly otherSessionCards: Locator;
  readonly currentSessionCard: Locator;
  readonly revokeAllButton: Locator;
  readonly revokeAllButtonConfirm: Locator;
  readonly revokeButton: Locator;
  readonly revokeButtonConfirm: Locator;
  readonly sessionRevokeSuccessToast: Locator;
  readonly logOutButton: Locator;
  readonly logOutButtonConfirm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sessionCards = page.getByTestId('session-card');
    this.otherSessionCards = page
      .getByTestId('session-card')
      .and(page.locator('[data-current-session="false"]'));
    this.currentSessionCard = page
      .getByTestId('session-card')
      .and(page.locator('[data-current-session="true"]'));
    this.revokeAllButton = this.page.getByTestId('revoke-all-sessions-button');
    this.revokeAllButtonConfirm = this.page.getByTestId('revoke-all-sessions-button-confirm');
    this.revokeButton = this.page.getByTestId('revoke-session-button');
    this.revokeButtonConfirm = this.page.getByTestId('revoke-session-button-confirm');
    this.sessionRevokeSuccessToast = this.page.getByText('Session revoked.');
    this.logOutButton = this.page.getByTestId('log-out-button');
    this.logOutButtonConfirm = this.page.getByTestId('log-out-button-confirm');
  }

  async navigate() {
    await this.page.goto('/settings/security');
  }
}
