import {expect, test} from '@playwright/test';

import {PW_CHANGE_USER_AUTH_FILE, VERIFIED_USER_AUTH_FILE} from '../../constants/auth.constants';

test.describe('bank transactions', () => {
  test.use({storageState: VERIFIED_USER_AUTH_FILE});

  test('renders, searches, filters by bank account, and opens transaction detail', async ({
    page,
  }) => {
    await page.setViewportSize({width: 1280, height: 720});
    await page.goto('/bank-transactions');

    const firstTransactionRow = page
      .getByTestId(/^bank-transaction-row-/)
      .filter({hasText: 'Coffee shop'});

    await expect(page.getByText('Coffee shop')).toBeVisible();
    await expect(firstTransactionRow.getByText('Daily spending', {exact: true})).toBeVisible();
    await expect(firstTransactionRow.getByText('Expense', {exact: true})).not.toBeVisible();
    await expect(
      page.getByTestId('bank-transactions-table').getByRole('columnheader', {name: 'Status'}),
    ).not.toBeVisible();
    await expect(
      firstTransactionRow.getByRole('cell').nth(3).getByText('Card Payment', {exact: true}),
    ).toBeVisible();
    await expect(firstTransactionRow.getByRole('cell').nth(1)).toContainText('Aug 25, 2026');

    await page.getByTestId('bank-transactions-search').fill('does not exist');
    await expect(page.getByText('No bank transactions found')).toBeVisible();

    await page.getByRole('button', {name: 'Clear filters'}).first().click();
    await expect(page.getByText('Coffee shop')).toBeVisible();

    await firstTransactionRow.click();
    await expect(page).toHaveURL(/\/bank-transactions\/[0-9a-f-]+$/);
    await expect(page.getByText('Bank transaction', {exact: true})).toBeVisible();
    await expect(page.getByText('Morning coffee')).toBeVisible();
    await expect(page.getByText('Merchant category code')).toBeVisible();
    await expect(page.getByText('Bank account', {exact: true})).toBeVisible();
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

  test('filters seeded transactions by bank account and booking date', async ({page}) => {
    await page.goto('/bank-transactions');

    await page.getByRole('button', {name: 'Bank accounts'}).click();
    await expect(page.getByRole('option', {name: /Daily spending/})).toBeVisible();
    await page.getByRole('option', {name: /Daily spending/}).click();
    await expect(page).toHaveURL(/bankAccountIds/);
    await expect(page.getByText('Coffee shop')).toBeVisible();

    await page.getByRole('button', {name: 'Booking date'}).first().click();
    for (let monthIndex = 0; monthIndex < 24; monthIndex += 1) {
      if (await page.getByText('August 2026', {exact: true}).isVisible()) break;
      await page.getByRole('button', {name: 'Go to previous month'}).click();
    }
    await page.getByRole('dialog').getByRole('gridcell', {name: '26'}).last().click();

    await expect(page).toHaveURL(/bookingDate/);
    await expect(page.getByText('Coffee shop')).toBeVisible();
    await expect(page.getByText('Provider purchase')).not.toBeVisible();
  });

  test('reflows transaction records for a phone viewport', async ({page}) => {
    await page.setViewportSize({width: 393, height: 852});
    await page.goto('/bank-transactions');

    const table = page.getByTestId('bank-transactions-table');
    const firstTransactionRow = page
      .getByTestId(/^bank-transaction-row-/)
      .filter({hasText: 'Coffee shop'});
    const descriptionLink = firstTransactionRow.locator('a');

    await expect(page.getByRole('heading', {name: 'Bank transactions'})).toBeVisible();
    await expect(firstTransactionRow).toBeVisible();
    await expect(descriptionLink).toHaveCount(1);
    await expect(table).toHaveAttribute('aria-label', 'Bank transactions');
    await expect(
      firstTransactionRow.getByText('Daily spending · ABN AMRO', {exact: true}),
    ).toBeVisible();
    await expect(
      firstTransactionRow.getByRole('link').getByText('Card Payment', {exact: true}),
    ).toBeVisible();
    await expect(firstTransactionRow.getByText('Aug 25, 2026', {exact: true})).not.toBeVisible();
    const pagination = page.getByTestId('pagination');
    await expect(pagination).toBeVisible();
    await expect(pagination).toHaveCSS('width', '361px');
    await expect(pagination.getByRole('button', {name: 'Go to previous page'})).toBeVisible();
    await expect(pagination.getByRole('button', {name: 'Go to next page'})).toBeVisible();
    await expect(pagination.getByRole('button', {name: 'Go to first page'})).not.toBeVisible();
    await expect(pagination.getByRole('button', {name: 'Go to last page'})).not.toBeVisible();
    await expect
      .poll(() => pagination.evaluate((element) => element.getBoundingClientRect().height))
      .toBeLessThan(52);
    await expect
      .poll(() => firstTransactionRow.evaluate((element) => element.getBoundingClientRect().height))
      .toBeLessThan(80);
    const tableWrapper = table.locator('xpath=../..');
    await expect(tableWrapper).toHaveCSS('border-top-width', '0px');
    await expect(tableWrapper).toHaveCSS('border-radius', '0px');
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);

    await descriptionLink.focus();
    await expect(descriptionLink).toBeFocused();
    await descriptionLink.press('Enter');
    await expect(page).toHaveURL(/\/bank-transactions\/[0-9a-f-]+$/);
  });

  test('sorts and paginates with the shared table controls', async ({page}) => {
    await page.goto('/bank-transactions');

    const bookingDateButton = page
      .getByTestId('bank-transactions-table')
      .getByRole('button', {name: 'Booking date'});
    await bookingDateButton.click();
    let sort = new URL(page.url()).searchParams.get('sort');
    expect(sort).toBe(JSON.stringify({by: 'bookingDate', order: 'ASC'}));

    await bookingDateButton.click();
    sort = new URL(page.url()).searchParams.get('sort');
    expect(sort).toBe(JSON.stringify({by: 'bookingDate', order: 'DESC'}));

    await page.getByRole('button', {name: 'Go to next page'}).click();
    await expect(page).toHaveURL(/pageIndex=1/);
    await expect(page.getByText('Extra transaction 9')).toBeVisible();
  });
});

test.describe('bank transactions without synced data', () => {
  test.use({storageState: PW_CHANGE_USER_AUTH_FILE});

  test('shows the empty state for an account without transactions', async ({page}) => {
    await page.goto('/bank-transactions');

    await expect(page.getByRole('heading', {name: 'No bank transactions found'})).toBeVisible();
    await expect(
      page.getByText('Synchronize a bank connection to make its transactions appear here.'),
    ).toBeVisible();
  });
});
