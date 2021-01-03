/* eslint-disable no-undef */
const puppeteer = require('puppeteer');

test('Check the logo renders', async () => {
	const browser = await puppeteer.launch({
		headless: true
	});
	const page = await browser.newPage();

	await page.goto('http://localhost:5000', {
		timeout: 45000,
		waitUntil: ['networkidle2']
	});

	// Check the logo exists
	const logo = await page.waitForSelector('.logoContainer');
	await browser.close();

	expect(logo).toBeTruthy();
});
