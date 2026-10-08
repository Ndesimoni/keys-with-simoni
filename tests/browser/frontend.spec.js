import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';
import { schema } from '../../src/lib/schema.js';

test('section URLs survive reload, support browser history, and recover from unknown routes', async ({
  page,
}) => {
  await page.goto('/#/properties');
  await expect(page.locator('.page-heading h1')).toHaveText('Property portfolio');
  await page.reload();
  await expect(page.locator('.modern-property-card')).toHaveCount(13);
  await page
    .locator('.sidebar .nav-item')
    .filter({ hasText: /^Clients$/ })
    .click();
  await expect(page).toHaveURL(/#\/clients$/);
  await page.goBack();
  await expect(page.locator('.page-heading h1')).toHaveText('Property portfolio');
  await page.goForward();
  await expect(page.locator('.page-heading h1')).toHaveText('Clients & requirements');
  await page.goto('/#/unknown');
  await expect(
    page.getByRole('heading', { name: 'Page not found', exact: true, level: 1 }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Back to overview' }).click();
  await expect(page.locator('.page-heading h1')).toHaveText('Overview');
});

test('keyboard drawers contain focus, restore the opener, validate fields and guard unsaved edits', async ({
  page,
}) => {
  await page.goto('/#/clients');
  const add = page.getByRole('button', { name: 'Add client', exact: true });
  await add.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'New client' });
  await expect(dialog).toBeVisible();
  await expect(page.locator('#client_id')).toBeFocused();
  await page.locator('#client_id').fill('CL-001');
  await page.locator('#email').fill('invalid');
  await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('#client_id')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#client_id')).toBeFocused();
  await page.locator('#client_id').fill('CL-KEYBOARD');
  await page.locator('#email').fill('valid@example.com');
  await dialog.getByRole('button', { name: 'Next', exact: true }).focus();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => Boolean(document.activeElement.closest('dialog')))).toBe(true);
  page.once('dialog', (event) => event.dismiss());
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  page.once('dialog', (event) => event.accept());
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(add).toBeFocused();
  await expect
    .poll(() =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem('kws-crm-v1')).data.Clients.some(
          (row) => row.client_id === 'CL-KEYBOARD',
        ),
      ),
    )
    .toBe(false);
});

test('global search opens the matching client profile and retains its query on reload', async ({
  page,
}) => {
  await page.goto('/#/properties');
  const names = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('kws-crm-v1')).data.Clients.map((row) => row.full_name),
  );
  const name = names[1];
  await page.getByRole('textbox', { name: 'Search CRM records' }).fill(name);
  await page.keyboard.press('Enter');
  await expect(page.locator('.profile-head h2')).toHaveText(name);
  await expect(page.locator('.desk-client')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.profile-head h2')).toHaveText(name);
  await page
    .getByRole('textbox', { name: 'Search clients in client desk' })
    .fill('No matching profile');
  await expect(page.locator('.profile-head')).toHaveCount(0);
});

test('malformed saved data is preserved through reload and can be downloaded before recovery', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('kws-crm-v1', '{unreadable existing records'));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Recover your workspace' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('kws-crm-v1'))).toBe(
    '{unreadable existing records',
  );
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download saved data' }).click();
  const path = testInfo.outputPath('recovery.json');
  await (await download).saveAs(path);
  expect(await readFile(path, 'utf8')).toBe('{unreadable existing records');
  await page.getByRole('button', { name: 'Retry opening workspace' }).click();
  await expect(page.getByRole('heading', { name: 'Recover your workspace' })).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Replace with empty workspace' }).click();
  await expect(page.locator('.page-heading h1')).toHaveText('Overview');
  await expect
    .poll(() =>
      page.evaluate(() => JSON.parse(localStorage.getItem('kws-crm-v1')).data.Clients.length),
    )
    .toBe(0);
});

test('invalid JSON backup and non-workbook imports leave current records intact', async ({
  page,
}) => {
  const alerts = [];
  page.on('dialog', async (dialog) => {
    alerts.push(dialog.message());
    await dialog.accept();
  });
  await page.goto('/');
  await expect
    .poll(() => page.evaluate(() => Boolean(localStorage.getItem('kws-crm-v1'))))
    .toBe(true);
  const before = await page.evaluate(() => localStorage.getItem('kws-crm-v1'));
  const invalid = {
    format: 'keys-with-simoni-full-backup',
    version: 2,
    data: { Properties: [], Clients: [null] },
  };
  await page.locator('input[accept=".json,application/json"]').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(invalid)),
  });
  await expect.poll(() => alerts.length).toBe(1);
  const zip = new JSZip();
  zip.file('not-a-workbook.txt', 'Invalid workbook');
  await page.locator('input[accept^=".xlsx"]').setInputFiles({
    name: 'invalid.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: await zip.generateAsync({ type: 'nodebuffer' }),
  });
  await expect.poll(() => alerts.length).toBe(2);
  expect(await page.evaluate(() => localStorage.getItem('kws-crm-v1'))).toBe(before);
  expect(alerts[0]).toContain('invalid record');
  expect(alerts[1]).toContain('missing');
});

test('original prefixed Excel template parses and imports rich text, numeric zero and Excel dates', async ({
  page,
}) => {
  await page.goto('/');
  const empty = await page.evaluate(async () => {
    const { importExcel } = await import('/src/lib/excel.js');
    const response = await fetch('/data/Keys_with_Simoni_Real_Estate_CRM_Enhanced.xlsx');
    return importExcel(new File([await response.arrayBuffer()], 'template.xlsx'));
  });
  expect(Object.keys(empty)).toHaveLength(11);
  expect(Object.values(empty).every((rows) => rows.length === 0)).toBe(true);
  const workbook = await page.request.get('/data/Keys_with_Simoni_Real_Estate_CRM_Enhanced.xlsx');
  const zip = await JSZip.loadAsync(await workbook.body());
  const col = (module, field) => schema(module).find((value) => value.key === field).col;
  const cells = [
    `<x:c r="A6" t="inlineStr"><x:is><x:t>CL-TEMPLATE</x:t></x:is></x:c>`,
    `<x:c r="B6" t="inlineStr"><x:is><x:r><x:t>Template </x:t></x:r><x:r><x:t>Client</x:t></x:r></x:is></x:c>`,
    `<x:c r="${col('Clients', 'maximum_budget_aed')}6"><x:v>0</x:v></x:c>`,
    `<x:c r="${col('Clients', 'date_added')}6"><x:v>46031</x:v></x:c>`,
  ].join('');
  const xml = await zip.file('xl/worksheets/sheet3.xml').async('string');
  zip.file(
    'xl/worksheets/sheet3.xml',
    xml.replace(/<x:row\b[^>]*r="6"[^>]*>[\s\S]*?<\/x:row>/, `<x:row r="6">${cells}</x:row>`),
  );
  const messages = [];
  page.on('dialog', async (dialog) => {
    messages.push(dialog.message());
    await dialog.accept();
  });
  await page.locator('input[accept^=".xlsx"]').setInputFiles({
    name: 'original-template.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: await zip.generateAsync({ type: 'nodebuffer' }),
  });
  await expect(page.locator('.toast')).toContainText('Imported 1 records from Excel');
  const saved = await page.evaluate(
    () => JSON.parse(localStorage.getItem('kws-crm-v1')).data.Clients[0],
  );
  expect(saved.full_name).toBe('Template Client');
  expect(saved.maximum_budget_aed).toBe(0);
  expect(saved.date_added).toBe(
    new Date(Date.UTC(1899, 11, 30) + 46031 * 86400000).toISOString().slice(0, 10),
  );
  expect(messages).toHaveLength(1);
});

test('mobile navigation and record dialogs remain keyboard accessible without page overflow', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/properties');
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await expect(page.getByRole('dialog', { name: 'CRM navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Toggle navigation' })).toBeFocused();
  await page.getByRole('button', { name: 'Add property' }).click();
  await expect(page.getByRole('dialog', { name: 'New property' })).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'New property' })).toHaveCSS('opacity', '1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.screenshot({ path: testInfo.outputPath('mobile-editor.png'), animations: 'disabled' });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.screenshot({
    path: testInfo.outputPath('mobile-properties-dark.png'),
    fullPage: true,
    animations: 'disabled',
  });
});

test('real error boundaries catch render failures and allow retry without clearing stored records', async ({
  page,
}) => {
  await page.goto('/');
  await expect
    .poll(() => page.evaluate(() => Boolean(localStorage.getItem('kws-crm-v1'))))
    .toBe(true);
  const before = await page.evaluate(() => localStorage.getItem('kws-crm-v1'));
  await page.evaluate(async () => {
    const React = (await import('/node_modules/.vite/deps/react.js')).default;
    const { default: ReactDOM } = await import('/node_modules/.vite/deps/react-dom_client.js');
    const { ErrorBoundary } = await import('/src/components/ui/ErrorBoundary.jsx');
    const container = document.createElement('div');
    document.body.appendChild(container);
    let broken = true;
    function BrokenScreen() {
      if (broken) throw Error('Simulated feature failure');
      return React.createElement('p', {}, 'Recovered feature');
    }
    window.repairTestFeature = () => {
      broken = false;
    };
    ReactDOM.createRoot(container).render(
      React.createElement(ErrorBoundary, {}, React.createElement(BrokenScreen)),
    );
  });
  await expect(
    page.getByRole('heading', { name: 'This screen could not be displayed' }),
  ).toBeVisible();
  await page.evaluate(() => window.repairTestFeature());
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByText('Recovered feature', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('kws-crm-v1'))).toBe(before);
});
