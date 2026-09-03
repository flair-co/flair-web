import {expect, test} from '@playwright/test';

import {VERIFIED_USER_AUTH_FILE} from '../../constants/auth.constants';
import {mockCurrentAccount} from '../../utils/mock-current-account';

test.use({storageState: VERIFIED_USER_AUTH_FILE});

const externalAccountId = '00000000-0000-4000-8000-000000000001';
const firstTransactionId = '00000000-0000-4000-8000-000000000011';

const transactions = [
  {
    id: firstTransactionId,
    transactionDate: '2026-08-24',
    bookingDate: '2026-08-26',
    valueDate: '2026-08-25',
    description: 'Coffee shop',
    counterpartyName: 'Cafe',
    amount: '-4.50000000',
    currency: 'EUR',
    creditDebitIndicator: 'DBIT',
    direction: 'EXPENSE',
    transactionType: 'CARD_PAYMENT',
    transactionStatus: 'BOOK',
    providerTransactionDescription: 'Card payment',
    merchantCategoryCode: '5814',
    remittanceInformation: 'Morning coffee',
    balanceAfterAmount: '100.50000000',
    balanceAfterCurrency: 'EUR',
    instructedAmount: '4.50000000',
    instructedCurrency: 'USD',
    exchangeRate: '0.923400000000000000',
    exchangeRateUnitCurrency: 'USD',
    exchangeRateType: 'SPOT',
    referenceNumber: 'reference-coffee',
    referenceNumberScheme: 'RF',
    bankName: 'ABN AMRO',
    bankCountry: 'NL',
    externalAccountName: 'Main account',
    externalAccountAlias: 'Daily spending',
  },
  {
    id: '00000000-0000-4000-8000-000000000012',
    transactionDate: '2026-08-19',
    bookingDate: '2026-08-20',
    valueDate: '2026-08-20',
    description: 'Salary',
    counterpartyName: 'Employer',
    amount: '100.00000000',
    currency: 'EUR',
    creditDebitIndicator: 'CRDT',
    direction: 'INCOME',
    transactionType: 'SALARY',
    transactionStatus: 'BOOK',
    providerTransactionDescription: 'Salary payment',
    merchantCategoryCode: null,
    remittanceInformation: 'Monthly income',
    bankName: 'ABN AMRO',
    bankCountry: 'NL',
    externalAccountName: 'Main account',
    externalAccountAlias: 'Daily spending',
  },
  ...Array.from({length: 9}, (_, index) => ({
    id: `00000000-0000-4000-8000-${String(index + 20).padStart(12, '0')}`,
    transactionDate: '2026-08-01',
    bookingDate: '2026-08-01',
    valueDate: '2026-08-01',
    description: `Extra transaction ${index + 1}`,
    counterpartyName: 'Provider',
    amount: '-1.00000000',
    currency: 'EUR',
    creditDebitIndicator: 'DBIT',
    direction: 'EXPENSE',
    transactionType: 'OTHER',
    transactionStatus: 'BOOK',
    providerTransactionDescription: null,
    merchantCategoryCode: null,
    remittanceInformation: null,
    bankName: 'ABN AMRO',
    bankCountry: 'NL',
    externalAccountName: 'Main account',
    externalAccountAlias: 'Daily spending',
  })),
];

test.describe('bank transactions', () => {
  test.beforeEach(async ({page}) => {
    await mockCurrentAccount(page);

    await page.route('http://localhost:3000/bank-connections', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '00000000-0000-4000-8000-000000000002',
            provider: 'enable-banking',
            aspspName: 'ABN AMRO',
            aspspCountry: 'NL',
            status: 'AUTHORIZED',
            consentValidUntil: '2030-01-01T00:00:00.000Z',
            lastSyncedAt: '2026-08-26T12:00:00.000Z',
            externalAccounts: [
              {
                id: externalAccountId,
                name: 'Main account',
                details: null,
                alias: 'Daily spending',
                currency: 'EUR',
                cashAccountType: 'CACC',
                usage: 'PRIV',
                maskedIdentifier: null,
                currentBalanceAmount: null,
                currentBalanceType: null,
                balanceUpdatedAt: null,
                isActive: true,
                latestBalances: [],
              },
            ],
          },
        ]),
      });
    });

    await page.route(
      /http:\/\/localhost:3000\/bank-transactions(?:\/.*)?(?:\?.*)?$/,
      async (route) => {
        const url = new URL(route.request().url());
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const detailId = pathSegments.length === 2 ? pathSegments[1] : undefined;

        if (detailId) {
          const transaction = transactions.find(({id}) => id === detailId);
          await route.fulfill({
            status: transaction ? 200 : 404,
            contentType: 'application/json',
            body: JSON.stringify(transaction || {message: 'Bank transaction not found.'}),
          });
          return;
        }

        const search = url.searchParams.get('filter[search]')?.toLowerCase();
        const filteredTransactions = search
          ? transactions.filter((transaction) =>
              `${transaction.description} ${transaction.counterpartyName} ${transaction.remittanceInformation}`
                .toLowerCase()
                .includes(search),
            )
          : transactions;
        const pageIndex = Number(url.searchParams.get('pagination[pageIndex]') || 0);
        const pageSize = Number(url.searchParams.get('pagination[pageSize]') || 10);

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            transactions: filteredTransactions.slice(
              pageIndex * pageSize,
              (pageIndex + 1) * pageSize,
            ),
            total: filteredTransactions.length,
          }),
        });
      },
    );
  });

  test('renders, searches, clears filters, and opens a read-only detail page', async ({page}) => {
    await page.goto('/bank-transactions');

    await expect(page.getByText('Coffee shop')).toBeVisible();
    await expect(
      page.getByTestId(`bank-transaction-row-${firstTransactionId}`).getByText('Daily spending'),
    ).toBeVisible();
    await expect(
      page.getByTestId(`bank-transaction-row-${firstTransactionId}`).getByText('Expense'),
    ).toBeVisible();
    await expect(
      page.getByTestId(`bank-transaction-row-${firstTransactionId}`).getByText('Card payment'),
    ).toBeVisible();
    await expect(
      page.getByTestId(`bank-transaction-row-${firstTransactionId}`).getByText('Aug 25, 2026'),
    ).toBeVisible();

    await page.getByTestId('bank-transactions-search').fill('does not exist');
    await expect(page.getByText('No bank transactions found')).toBeVisible();

    await page.getByRole('button', {name: 'Clear filters'}).first().click();
    await expect(page.getByText('Coffee shop')).toBeVisible();

    await page.getByTestId(`bank-transaction-row-${firstTransactionId}`).click();
    await expect(page).toHaveURL(new RegExp(`/bank-transactions/${firstTransactionId}$`));
    await expect(page.getByText('Bank transaction', {exact: true})).toBeVisible();
    await expect(page.getByText('Morning coffee')).toBeVisible();
    await expect(page.getByText('Merchant category code')).toBeVisible();
    await expect(page.getByText('Daily spending')).toBeVisible();
    await expect(page.getByText('Transaction date')).toBeVisible();
    await expect(page.getByText('Card payment', {exact: true})).toBeVisible();
    await expect(page.getByText('Provider classification')).toBeVisible();
    await expect(page.getByText('100.50 EUR')).toBeVisible();
    await expect(page.getByText('4.50 USD')).toBeVisible();
    await expect(page.getByText('0.923400000000000000 USD (SPOT)')).toBeVisible();
    await expect(page.getByText('reference-coffee (RF)')).toBeVisible();
    await expect(page.getByText('Category', {exact: true})).not.toBeVisible();
  });

  test('sorts and paginates with the shared table controls', async ({page}) => {
    await page.goto('/bank-transactions');

    await page
      .getByTestId('bank-transactions-table')
      .getByRole('button', {name: 'Booking date'})
      .click();
    const sort = new URL(page.url()).searchParams.get('sort');
    expect(sort).toBe(JSON.stringify({by: 'bookingDate', order: 'DESC'}));

    await page.getByRole('button', {name: 'Go to next page'}).click();
    await expect(page).toHaveURL(/pageIndex=1/);
    await expect(page.getByText('Extra transaction 9')).toBeVisible();
  });
});
