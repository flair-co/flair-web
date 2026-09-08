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
    const headingGroup = page.getByTestId('bank-transactions-heading');
    const [headingBox, summaryBox] = await Promise.all([
      headingGroup.getByRole('heading').boundingBox(),
      headingGroup.locator('p').boundingBox(),
    ]);
    expect(headingBox).not.toBeNull();
    expect(summaryBox).not.toBeNull();
    expect(summaryBox!.y).toBeLessThan(headingBox!.y + headingBox!.height);
    await expect(page.getByRole('button', {name: 'Bank accounts', exact: true})).not.toBeVisible();
    const bookingDateFilter = page.getByRole('button', {name: 'Booking date', exact: true}).first();
    await expect(bookingDateFilter).toBeVisible();
    const bookingDateBox = await bookingDateFilter.boundingBox();
    expect(bookingDateBox).not.toBeNull();
    expect(bookingDateBox!.width).toBe(361);
    await expect(firstTransactionRow).toBeVisible();
    const [tableBox, firstTransactionRowBox] = await Promise.all([
      table.boundingBox(),
      firstTransactionRow.boundingBox(),
    ]);
    expect(tableBox).not.toBeNull();
    expect(firstTransactionRowBox).not.toBeNull();
    expect(firstTransactionRowBox!.x).toBeCloseTo(tableBox!.x, 0);
    expect(firstTransactionRowBox!.x + firstTransactionRowBox!.width).toBeCloseTo(
      tableBox!.x + tableBox!.width,
      0,
    );
    await expect(descriptionLink).toHaveCount(1);
    await expect(table).toHaveAttribute('aria-label', 'Bank transactions');
    const mobileMeta = firstTransactionRow.getByTestId('bank-transaction-mobile-meta');
    await expect(mobileMeta).toContainText('26 Aug');
    await expect(mobileMeta).toContainText('Daily spending');
    await expect(mobileMeta).toContainText('ABN AMRO');
    await expect(mobileMeta).toContainText('Card Payment');
    await expect(firstTransactionRow.getByText('Aug 25, 2026', {exact: true})).not.toBeVisible();
    const pagination = page.getByTestId('pagination');
    await expect(pagination).toBeVisible();
    await expect(pagination).toHaveCSS('width', '361px');
    await expect(pagination.getByRole('button', {name: 'Go to previous page'})).toBeVisible();
    await expect(pagination.getByRole('button', {name: 'Go to next page'})).toBeVisible();
    await expect(pagination.getByRole('button', {name: 'Go to first page'})).not.toBeVisible();
    await expect(pagination.getByRole('button', {name: 'Go to last page'})).not.toBeVisible();
    const rowsSelector = pagination.getByRole('combobox', {name: 'Rows per page'});
    const rowsValue = rowsSelector.locator(':scope > span');
    const rowsChevron = rowsSelector.locator('svg');
    const [rowsValueBox, rowsChevronBox] = await Promise.all([
      rowsValue.boundingBox(),
      rowsChevron.boundingBox(),
    ]);
    expect(rowsValueBox).not.toBeNull();
    expect(rowsChevronBox).not.toBeNull();
    expect(rowsChevronBox!.x - (rowsValueBox!.x + rowsValueBox!.width)).toBeGreaterThanOrEqual(8);
    await expect
      .poll(() => pagination.evaluate((element) => element.getBoundingClientRect().height))
      .toBeLessThan(52);
    await expect
      .poll(() => firstTransactionRow.evaluate((element) => element.getBoundingClientRect().height))
      .toBeLessThan(80);
    const tableWrapper = table.locator('xpath=../../..');
    await expect(tableWrapper).toHaveCSS('border-top-width', '0px');
    await expect(tableWrapper).toHaveCSS('border-radius', '0px');
    await expect(firstTransactionRow).toHaveCSS('border-top-width', '1px');
    const mobileMetaContainer = firstTransactionRow.getByTestId('bank-transaction-mobile-meta');
    const mobileMetaRight = firstTransactionRow.getByTestId('bank-transaction-mobile-meta-right');
    const mobileAmount = firstTransactionRow.locator('td').filter({hasText: '-€4.50'});
    await expect(mobileMetaRight).toBeVisible();
    await expect(mobileMetaRight).toHaveCSS('text-align', 'right');
    const [metaBox, metaRightBox, amountBox] = await Promise.all([
      mobileMetaContainer.boundingBox(),
      mobileMetaRight.boundingBox(),
      mobileAmount.boundingBox(),
    ]);
    expect(metaBox).not.toBeNull();
    expect(metaRightBox).not.toBeNull();
    expect(amountBox).not.toBeNull();
    expect(metaRightBox!.x + metaRightBox!.width).toBeCloseTo(amountBox!.x + amountBox!.width, 0);
    expect(metaRightBox!.y).toBeGreaterThan(amountBox!.y);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);

    await descriptionLink.focus();
    await expect(descriptionLink).toBeFocused();
    await descriptionLink.press('Enter');
    await expect(page).toHaveURL(/\/bank-transactions\/[0-9a-f-]+$/);
  });

  test('keeps a selected booking date range within a phone viewport', async ({page}) => {
    await page.setViewportSize({width: 320, height: 852});
    await page.goto('/bank-transactions');

    await page.getByRole('button', {name: 'Booking date', exact: true}).first().click();
    const dialog = page.getByRole('dialog');
    let dayButtons = dialog.locator('button[name="day"]:not([disabled]):not(.day-outside)');
    if ((await dayButtons.count()) < 2) {
      await dialog.getByRole('button', {name: 'Go to previous month'}).click();
      dayButtons = dialog.locator('button[name="day"]:not([disabled]):not(.day-outside)');
    }
    await dayButtons.nth(0).click();
    await dayButtons.nth(1).click();

    const bookingDate = page.getByRole('button', {name: /^Booking date/}).first();
    await expect(bookingDate).toContainText(' - ');
    await expect(bookingDate).toHaveAttribute('aria-label', /^Booking date: .+ - .+$/);
    const metrics = await bookingDate.evaluate((element) => ({
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);
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
