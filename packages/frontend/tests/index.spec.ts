import { test, expect } from '@playwright/test';

test('Website works', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/chibisafe/);
});

test('Access to uploads page', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
	await page.getByRole('link', { name: 'Dashboard' }).click();
	await expect(page.getByRole('heading', { name: 'Uploads' })).toBeVisible();
});
