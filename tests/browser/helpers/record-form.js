import { expect } from '@playwright/test';

/** Complete optional sections through the same controls used by a person. */
export async function saveRecordForm(page) {
  const dialog = page.getByRole('dialog');
  const next = dialog.getByRole('button', { name: 'Next', exact: true });
  for (let index = 0; index < 10 && (await next.count()); index++) {
    const progress = dialog.locator('.form-progress');
    const before = await progress.textContent();
    await next.click();
    await expect(progress).not.toHaveText(before);
  }
  await dialog.getByRole('button', { name: /^(Create record|Save changes)$/ }).click();
}
