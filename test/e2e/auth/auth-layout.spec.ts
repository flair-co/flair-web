import {expect, test} from '@playwright/test';

const routes = [
  {name: 'login', path: '/login'},
  {name: 'signup', path: '/signup'},
  {name: 'reset password', path: '/reset-password'},
];

for (const viewport of [
  {name: 'mobile', width: 393, height: 852},
  {name: 'small mobile', width: 320, height: 568},
]) {
  test.describe(`${viewport.name} auth layout`, () => {
    test.use({viewport});

    for (const route of routes) {
      test(`${route.name} fits without page scrolling`, async ({page}) => {
        const pageErrors: string[] = [];
        page.on('pageerror', (error) => pageErrors.push(error.message));

        await page.goto(route.path);
        await expect(page.getByTestId('auth-page')).toBeVisible();

        const metrics = await page.evaluate(() => ({
          viewport: {width: window.innerWidth, height: window.innerHeight},
          document: {
            scrollWidth: document.documentElement.scrollWidth,
            scrollHeight: document.documentElement.scrollHeight,
          },
          body: {
            scrollWidth: document.body.scrollWidth,
            scrollHeight: document.body.scrollHeight,
          },
        }));

        expect(metrics.document.scrollWidth).toBeLessThanOrEqual(metrics.viewport.width);
        expect(metrics.document.scrollHeight).toBeLessThanOrEqual(metrics.viewport.height);
        expect(metrics.body.scrollWidth).toBeLessThanOrEqual(metrics.viewport.width);
        expect(metrics.body.scrollHeight).toBeLessThanOrEqual(metrics.viewport.height);
        expect(pageErrors).toEqual([]);
      });
    }
  });
}
