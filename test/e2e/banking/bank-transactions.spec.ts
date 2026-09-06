import {expect, test} from '@playwright/test';

import {VERIFIED_USER_AUTH_FILE} from '../../constants/auth.constants';

test.use({storageState: VERIFIED_USER_AUTH_FILE});

test.describe('bank transactions', () => {
  test('renders, searches, clears filters, and opens a read-only detail page', async ({page}) => {
    await page.goto('/bank-transactions');

    const firstTransactionRow = page
      .getByTestId(/^bank-transaction-row-/)
      .filter({hasText: 'Coffee shop'});

    await expect(page.getByText('Coffee shop')).toBeVisible();
    await expect(firstTransactionRow.getByText('Daily spending')).toBeVisible();
    await expect(firstTransactionRow.getByText('Expense')).not.toBeVisible();
    await expect(
      page.getByTestId('bank-transactions-table').getByRole('columnheader', {name: 'Status'}),
    ).not.toBeVisible();
    await expect(firstTransactionRow.getByText('Card payment')).toBeVisible();
    await expect(firstTransactionRow.getByText('Aug 25, 2026')).toBeVisible();

    await page.getByTestId('bank-transactions-search').fill('does not exist');
    await expect(page.getByText('No bank transactions found')).toBeVisible();

    await page.getByRole('button', {name: 'Clear filters'}).first().click();
    await expect(page.getByText('Coffee shop')).toBeVisible();

    await firstTransactionRow.click();
    await expect(page).toHaveURL(/\/bank-transactions\/[0-9a-f-]+$/);
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

  test('does not overflow horizontally on a narrow viewport', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.goto('/bank-transactions');

    await expect(page.getByText('Coffee shop')).toBeVisible();
    const [documentWidth, viewportWidth] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      window.innerWidth,
    ]);
    expect(documentWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test('does not require horizontal table scrolling at a laptop width', async ({page}) => {
    for (const width of [1280, 1320, 1366]) {
      await page.setViewportSize({width, height: 800});
      await page.goto('/bank-transactions');

      const metrics = await page.getByTestId('bank-transactions-table').evaluate((table) => {
        const viewport = table.closest('[data-radix-scroll-area-viewport]');
        const description = table.querySelector('tbody tr:nth-child(3) td:nth-child(3) > div');

        return {
          descriptionWidth: description?.clientWidth ?? 0,
          tableWidth: table.scrollWidth,
          viewportWidth: (viewport as HTMLElement | null)?.clientWidth ?? 0,
        };
      });

      expect(metrics.tableWidth).toBeLessThanOrEqual(metrics.viewportWidth);
      if (width === 1366) {
        expect(metrics.descriptionWidth).toBeGreaterThan(320);
      }
    }
  });
});
