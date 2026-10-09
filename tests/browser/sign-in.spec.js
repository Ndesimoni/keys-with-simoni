import { expect, test } from '@playwright/test';
import { DEMO_PASSWORD, DEMO_SESSION_KEY, demoAdmins } from '../../src/config/demoAccounts.js';
import { signIn } from './helpers/session.js';
import { saveRecordForm } from './helpers/record-form.js';

test('signed-out deep links show sign-in before loading workspace records or calendar', async ({
  page,
}, testInfo) => {
  const calendarRequests = [];
  const errors = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/calendar/')) calendarRequests.push(request.url());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/#/properties');
  await expect(page).toHaveURL(/#\/sign-in$/);
  await expect(page.getByRole('heading', { name: 'Welcome back', level: 1 })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.app-shell')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('kws-crm-v1'))).toBe(null);
  expect(await page.evaluate(() => sessionStorage.getItem('kws-crm-demo-session'))).toBe(null);
  expect(calendarRequests).toHaveLength(0);
  expect(errors).toHaveLength(0);
  await page.screenshot({ path: testInfo.outputPath('sign-in-desktop-dark.png'), fullPage: true });
});

test('email/password validation, password visibility and rejected credentials stay on sign-in', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText('Enter your email address.', { exact: true })).toBeVisible();
  await expect(page.getByText('Enter your password.', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Email address')).toBeFocused();
  await page.getByLabel('Email address').fill('not an email');
  await page.getByLabel('Password', { exact: true }).fill('wrong password');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Hide password' }).click();
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText('Enter a valid email address.', { exact: true })).toBeVisible();
  await page.getByLabel('Email address').fill(demoAdmins[0].email);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Email or password is incorrect');
  await expect(page).toHaveURL(/#\/sign-in$/);
  expect(await page.evaluate(() => sessionStorage.getItem('kws-crm-demo-session'))).toBe(null);
  await page.getByLabel('Email address').fill('unknown@example.com');
  await page.getByLabel('Password', { exact: true }).fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Email or password is incorrect');
});

test('Aidah and Simoni enter the same workspace, reload routes and sign out without clearing records', async ({
  page,
}) => {
  await page.goto('/');
  await signIn(page);
  await expect(page.locator('.side-footer strong')).toHaveText('Aidah');
  await expect(page.locator('.sidebar .nav-item')).toHaveCount(19);
  await page
    .locator('.sidebar .nav-item')
    .filter({ hasText: /^Clients$/ })
    .click();
  await page.getByRole('button', { name: 'Add client', exact: true }).click();
  await page.locator('#client_id').fill('CL-ADMIN-SHARED');
  await page.locator('#full_name').fill('Shared admin test client');
  await saveRecordForm(page);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.page-heading h1')).toHaveText('Clients & requirements');
  await expect(page.getByText('Shared admin test client', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Account for Aidah' }).click();
  await expect(page.getByRole('link', { name: 'Sign out' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Account for Aidah' })).toBeFocused();
  await page.getByRole('button', { name: 'Account for Aidah' }).click();
  const before = await page.evaluate(() => localStorage.getItem('kws-crm-v1'));
  const storedSession = await page.evaluate(() => sessionStorage.getItem('kws-crm-demo-session'));
  expect(JSON.parse(storedSession)).toEqual({ version: 1, adminId: 'aidah' });
  expect(storedSession).not.toContain(DEMO_PASSWORD);
  await page.getByRole('link', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/#\/sign-in$/);
  await expect(page.getByLabel('Password', { exact: true })).toHaveValue('');
  expect(await page.evaluate(() => sessionStorage.getItem('kws-crm-demo-session'))).toBe(null);
  expect(await page.evaluate(() => localStorage.getItem('kws-crm-v1'))).toBe(before);
  await page.goBack();
  await expect(page).toHaveURL(/#\/sign-in$/);
  await expect(page.locator('.app-shell')).toHaveCount(0);
  await signIn(page, demoAdmins[1]);
  await expect(page.getByRole('button', { name: 'Account for Simoni' })).toBeVisible();
  await expect(page.locator('.side-footer strong')).toHaveText('Simoni');
  await expect(page.locator('.sidebar .nav-item')).toHaveCount(19);
  await page
    .locator('.sidebar .nav-item')
    .filter({ hasText: /^Clients$/ })
    .click();
  await expect(page.getByText('Shared admin test client', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Account for Simoni' }).click();
  await expect(page.getByRole('region', { name: 'Admin account' })).toContainText(
    'Admin · Full access',
  );
});

test('sign-in fits mobile in both themes and the selected theme reaches the dashboard', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const theme of ['dark', 'light']) {
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath(`sign-in-mobile-${theme}.png`),
      fullPage: true,
    });
    if (theme === 'dark') await page.getByRole('button', { name: 'Switch to light mode' }).click();
  }
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await signIn(page, demoAdmins[1]);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Account for Simoni' }).click();
  await expect(page.getByRole('link', { name: 'Sign out' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('invalid sessions require sign-in and blocked session writes report a recoverable error', async ({
  page,
}) => {
  await page.addInitScript(
    ({ key }) => {
      sessionStorage.setItem(key, '{"version":1,"adminId":"unknown","role":"Admin"}');
    },
    { key: DEMO_SESSION_KEY },
  );
  await page.goto('/#/leads');
  await expect(page).toHaveURL(/#\/sign-in$/);
  await page.evaluate((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException('Blocked', 'SecurityError');
      return original.call(this, name, value);
    };
  }, DEMO_SESSION_KEY);
  await page.getByLabel('Email address').fill(demoAdmins[0].email);
  await page.getByLabel('Password', { exact: true }).fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Your browser could not save the session');
  await expect(page.locator('.app-shell')).toHaveCount(0);
});

test('a failed sign-out does not claim success and can be retried', async ({ page }) => {
  await page.goto('/');
  await signIn(page);
  await page.evaluate((key) => {
    const original = Storage.prototype.removeItem;
    window.blockDemoSignOut = true;
    Storage.prototype.removeItem = function (name) {
      if (name === key && window.blockDemoSignOut)
        throw new DOMException('Blocked', 'SecurityError');
      return original.call(this, name);
    };
  }, DEMO_SESSION_KEY);
  await page.getByRole('button', { name: 'Account for Aidah' }).click();
  await page.getByRole('link', { name: 'Sign out' }).click();
  await expect(
    page.getByRole('heading', { name: 'Sign out could not be completed' }),
  ).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem('kws-crm-demo-session'))).not.toBe(null);
  await page.evaluate(() => {
    window.blockDemoSignOut = false;
  });
  await page.getByRole('button', { name: 'Try signing out again' }).click();
  await expect(page).toHaveURL(/#\/sign-in$/);
  expect(await page.evaluate(() => sessionStorage.getItem('kws-crm-demo-session'))).toBe(null);
});

test('navigation to sign-out respects the record editor unsaved-changes guard', async ({
  page,
}) => {
  await page.goto('/');
  await signIn(page);
  await page
    .locator('.sidebar .nav-item')
    .filter({ hasText: /^Clients$/ })
    .click();
  await page.getByRole('button', { name: 'Add client', exact: true }).click();
  await page.locator('#full_name').fill('Unsaved admin draft');
  // Trigger the same router link while the native modal keeps the header inert.
  await page.evaluate(() => document.querySelector('.user-button').click());
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.evaluate(() => document.querySelector('.account-sign-out').click());
  await expect(page.getByRole('dialog', { name: 'New client' })).toBeVisible();
  await expect(page.locator('#full_name')).toHaveValue('Unsaved admin draft');
  expect(await page.evaluate(() => sessionStorage.getItem('kws-crm-demo-session'))).not.toBe(null);
  page.once('dialog', (dialog) => dialog.accept());
  await page.evaluate(() => document.querySelector('.account-sign-out').click());
  await expect(page).toHaveURL(/#\/sign-in$/);
  await expect(page.locator('.app-shell')).toHaveCount(0);
});

test('sign-out warns about unsaved storage changes and retry preserves them', async ({ page }) => {
  await page.goto('/');
  await signIn(page);
  await page
    .locator('.sidebar .nav-item')
    .filter({ hasText: /^Clients$/ })
    .click();
  const before = await page.evaluate(() => localStorage.getItem('kws-crm-v1'));
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.restoreRecordWrites = () => {
      Storage.prototype.setItem = original;
    };
    Storage.prototype.setItem = function (key, value) {
      if (key === 'kws-crm-v1')
        throw new DOMException('Simulated quota error', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  });
  await page.getByRole('button', { name: 'Add client', exact: true }).click();
  await page.locator('#client_id').fill('CL-MEMORY-ADMIN');
  await page.locator('#full_name').fill('Admin in-memory client');
  page.once('dialog', (dialog) => dialog.accept());
  await saveRecordForm(page);
  await expect(page.locator('.storage-banner')).toContainText('Changes could not be saved');
  await page
    .getByRole('textbox', { name: 'Search Clients', exact: true })
    .fill('Admin in-memory client');
  await page.getByRole('button', { name: 'Account for Aidah' }).click();
  let warning = '';
  page.once('dialog', async (dialog) => {
    warning = dialog.message();
    await dialog.dismiss();
  });
  await page.getByRole('link', { name: 'Sign out' }).click();
  expect(warning).toContain('Export a full backup before signing out');
  await expect(page.getByText('Admin in-memory client', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('kws-crm-v1'))).toBe(before);
  expect(await page.evaluate(() => sessionStorage.getItem('kws-crm-demo-session'))).not.toBe(null);
  await page.evaluate(() => window.restoreRecordWrites());
  await page.getByRole('button', { name: 'Retry saving', exact: true }).click();
  await expect(page.locator('.storage-banner')).toHaveCount(0);
  await page.getByRole('button', { name: 'Account for Aidah' }).click();
  await page.getByRole('link', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/#\/sign-in$/);
  const records = await page.evaluate(
    () => JSON.parse(localStorage.getItem('kws-crm-v1')).data.Clients,
  );
  expect(records.some((record) => record.client_id === 'CL-MEMORY-ADMIN')).toBe(true);
});
