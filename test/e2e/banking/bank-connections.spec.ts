import {expect, test} from '@playwright/test';

import {VERIFIED_USER_AUTH_FILE} from '../../constants/auth.constants';
import {mockCurrentAccount} from '../../utils/mock-current-account';

test.use({storageState: VERIFIED_USER_AUTH_FILE});

test.describe('bank connections', () => {
  let requestedBankName: string | undefined;
  let syncRequested = false;

  test.beforeEach(async ({page}) => {
    requestedBankName = undefined;
    syncRequested = false;

    await mockCurrentAccount(page);

    await page.route('http://localhost:3000/bank-connections/authorize', async (route) => {
      expect(route.request().method()).toBe('POST');
      const request = route.request().postDataJSON() as {
        aspspName: string;
        aspspCountry: string;
      };
      expect(request).toEqual({
        aspspName: expect.stringMatching(/^(ABN AMRO|Mock ASPSP)$/),
        aspspCountry: 'NL',
      });
      requestedBankName = request.aspspName;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({authorizationUrl: 'https://auth.example.test/authorize'}),
      });
    });

    await page.route('http://localhost:3000/bank-connections', async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'connection-1',
            provider: 'enable-banking',
            aspspName: 'ABN AMRO',
            aspspCountry: 'NL',
            status: 'AUTHORIZED',
            consentValidUntil: '2030-01-01T00:00:00.000Z',
            lastSyncedAt: '2026-08-26T12:00:00.000Z',
            externalAccounts: [
              {
                id: 'external-account-1',
                name: 'Eduard',
                details: 'Main account',
                alias: null,
                currency: 'EUR',
                cashAccountType: 'CACC',
                usage: 'PRIV',
                maskedIdentifier: null,
                currentBalanceAmount: null,
                currentBalanceType: null,
                balanceUpdatedAt: null,
                isActive: true,
                latestBalances: [
                  {
                    name: 'Available balance',
                    balanceType: 'AVAILABLE',
                    amount: '123.45000000',
                    currency: 'EUR',
                    lastChangeDateTime: '2026-08-26T12:00:00.000Z',
                    referenceDate: '2026-08-26',
                    observedAt: '2026-08-26T12:00:00.000Z',
                    isPrimary: true,
                  },
                  {
                    name: 'Booked balance',
                    balanceType: 'BOOKED',
                    amount: '120.00000000',
                    currency: 'EUR',
                    lastChangeDateTime: null,
                    referenceDate: '2026-08-26',
                    observedAt: '2026-08-26T12:00:00.000Z',
                    isPrimary: false,
                  },
                ],
              },
            ],
          },
        ]),
      });
    });

    await page.route('http://localhost:3000/bank-connections/connection-1/sync', async (route) => {
      expect(route.request().method()).toBe('POST');
      syncRequested = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'sync-run-1',
          status: 'SUCCEEDED',
          startedAt: '2026-08-26T12:00:00.000Z',
          finishedAt: '2026-08-26T12:00:02.000Z',
          requestedFrom: null,
          requestedTo: '2026-08-26',
          accountsFetched: 1,
          balancesFetched: 2,
          transactionsFetched: 5,
          errorMessage: null,
        }),
      });
    });

    await page.route(
      'http://localhost:3000/bank-connections/connection-1/transactions**',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            total: 1,
            transactions: [
              {
                id: 'external-transaction-1',
                bookingDate: '2026-08-26',
                valueDate: '2026-08-26',
                amount: '-12.50000000',
                currency: 'EUR',
                creditDebitIndicator: 'DBIT',
                transactionStatus: 'BOOK',
                description: 'Provider purchase',
                counterpartyName: 'Shop',
                merchantCategoryCode: '5411',
                remittanceInformation: 'Groceries',
              },
            ],
          }),
        });
      },
    );

    await page.route('https://auth.example.test/authorize', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'mock bank authorization',
      });
    });
  });

  test('starts authorization for the configured sandbox or production bank', async ({page}) => {
    await page.goto('/bank-connections');
    const connectButton = page.getByTestId(/connect-(abn-amro|mock-aspsp)-button/);
    const buttonText = await connectButton.innerText();
    const expectedBankName = buttonText.includes('Mock ASPSP') ? 'Mock ASPSP' : 'ABN AMRO';
    await connectButton.click();

    await expect(page).toHaveURL('https://auth.example.test/authorize');
    await expect(page.getByText('mock bank authorization')).toBeVisible();
    expect(requestedBankName).toBe(expectedBankName);
  });

  test('shows connected accounts and callback success feedback', async ({page}) => {
    await page.goto('/bank-connections?result=connected');

    await expect(page.getByText('ABN AMRO', {exact: true})).toBeVisible();
    await expect(page.getByText('Eduard', {exact: true})).toBeVisible();
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

  test('runs a manual synchronization and displays the bank data preview', async ({page}) => {
    await page.goto('/bank-connections');

    await expect(page.getByText('available · primary')).toBeVisible();
    await expect(page.getByText('Provider purchase')).toBeVisible();

    await page.getByTestId('sync-bank-connection-1').click();

    await expect(page.getByText('Bank synchronized')).toBeVisible();
    await expect(page.getByText('5 transactions and 2 balances fetched.')).toBeVisible();
    expect(syncRequested).toBe(true);
  });
});
