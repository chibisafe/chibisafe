import { test as setup, expect } from '@playwright/test';

const authFile = './tests/.auth/admin.json';

setup('Authenticate as admin', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Login / Register' }).click();
	await expect(page.getByRole('heading', { name: 'Authentication' })).toBeVisible();
	await page.getByRole('textbox', { name: 'Username' }).fill('admin');
	await page.getByRole('textbox', { name: 'Password' }).fill('admin');
	await page.getByRole('button', { name: 'Sign In' }).click();
	await page.waitForResponse('**/api/auth/login');
	await page.context().storageState({ path: authFile });
});
