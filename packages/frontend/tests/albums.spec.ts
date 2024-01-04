import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';

const navigateToAlbumsPage = async (page: Page) => {
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
	await page.getByRole('link', { name: 'Dashboard' }).click();
	await expect(page.getByRole('link', { name: 'Albums' })).toBeVisible();
	await page.getByRole('link', { name: 'Albums' }).click();
};

test.describe.serial('Album actions', () => {
	const randomAlbumName = `-- e2e test album --`;

	test('Create new album', async ({ page }) => {
		await navigateToAlbumsPage(page);

		await page.getByRole('button', { name: 'New album' }).click();
		await page.waitForTimeout(200);
		await page.locator('input#input').fill(randomAlbumName);
		await page.getByRole('button', { name: 'Create' }).click();

		await expect(page.getByText(randomAlbumName)).toBeVisible();
	});

	test('Rename album', async ({ page }) => {
		await navigateToAlbumsPage(page);

		await expect(page.getByText(randomAlbumName)).toBeVisible();
		await page.locator('li').filter({ hasText: randomAlbumName }).getByRole('img').click();

		await page.getByLabel('Album name').click();
		await page.getByLabel('Album name').fill('-- e2e test album RENAMED --');
		await page.getByRole('button', { name: 'Rename' }).click();

		await page.getByLabel('Album name').click();
		await page.getByLabel('Album name').fill('-- e2e test album --');
		await page.getByRole('button', { name: 'Rename' }).click();
	});

	test('Create new link', async ({ page }) => {
		await navigateToAlbumsPage(page);

		await expect(page.getByText(randomAlbumName)).toBeVisible();
		await page.locator('li').filter({ hasText: randomAlbumName }).getByRole('img').click();

		await page.getByRole('button', { name: 'Create new link' }).click();
		await page.getByRole('button', { name: 'Delete', exact: true }).click();
	});

	test('Delete album', async ({ page }) => {
		await navigateToAlbumsPage(page);

		await expect(page.getByText(randomAlbumName)).toBeVisible();
		await page.locator('li').filter({ hasText: randomAlbumName }).getByRole('img').click();

		// Delete album
		await page.getByRole('button', { name: 'Delete album', exact: true }).click();
		await page.getByRole('button', { name: 'Confirm' }).click();

		await expect(page.getByText(randomAlbumName)).toBeHidden();
	});
});

// await page.locator('body').click();
// await page.goto('http://localhost:8000/');
// await page.getByRole('link', { name: 'Login / Register' }).click();
// await page.getByPlaceholder('Username').click();
// await page.getByPlaceholder('Username').fill('admin');
// await page.getByPlaceholder('Username').press('Tab');
// await page.getByPlaceholder('Password').fill('admin');
// await page.getByPlaceholder('Password').press('Enter');
// await page.getByRole('link', { name: 'Albums' }).click();
// await page.getByRole('button', { name: 'New album' }).click();
// await page.getByLabel('Album name').click();
// await page.getByLabel('Album name').fill('-- e2e test album --');
// await page.getByRole('button', { name: 'Create' }).click();
// await page.locator('li').filter({ hasText: '-- e2e test album --' }).getByRole('img').click();

// await page.getByLabel('Album name').click();
// await page.getByLabel('Album name').press('ArrowLeft');
// await page.getByLabel('Album name').press('ArrowLeft');
// await page.getByLabel('Album name').press('CapsLock');
// await page.getByLabel('Album name').fill('-- e2e test album RENAMED --');
// await page.getByLabel('Album name').press('CapsLock');
// await page.getByRole('button', { name: 'Rename' }).click();
// await page.getByLabel('Album name').click();
// await page.getByLabel('Album name').press('ArrowLeft');
// await page.getByLabel('Album name').press('Shift+ArrowRight');
// await page.getByLabel('Album name').press('ArrowLeft');
// await page.getByLabel('Album name').press('ArrowLeft');
// await page.getByLabel('Album name').press('Shift+ArrowRight');
// await page.getByLabel('Album name').press('Shift+ArrowRight');
// await page.getByLabel('Album name').press('Shift+ArrowRight');
// await page.getByLabel('Album name').press('Shift+ArrowRight');
// await page.getByLabel('Album name').press('Shift+ArrowRight');
// await page.getByLabel('Album name').press('Shift+ArrowRight');
// await page.getByLabel('Album name').press('Shift+ArrowRight');
// await page.getByLabel('Album name').fill('-- e2e test album --');
// await page.getByRole('button', { name: 'Rename' }).click();

// await page.getByRole('button', { name: 'Create new link' }).click();
// await page.getByRole('row', { name: '6c72ry Delete' }).getByRole('switch').click();
// await page.getByRole('button', { name: 'Delete', exact: true }).click();
// await page.getByRole('button', { name: 'Confirm' }).click();
// await page.getByRole('button', { name: 'Delete album', exact: true }).click();
// await page.getByRole('button', { name: 'Confirm' }).click();
