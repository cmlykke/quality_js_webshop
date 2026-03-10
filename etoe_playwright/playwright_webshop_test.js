const { test, expect } = require('@playwright/test');
const { createWebshopHelpers } = require('./playwright_webshop_helper');

test.describe('EK Webshop Happy Path - Playwright', () => {
    const baseUrl = 'http://127.0.0.1:8080/';

    test('should sign up a user', async ({ page }) => {
        // 1. Open home page and click "Sign up"
        await page.goto(baseUrl);

        const signUpLink = page.locator('#optSignup a[title="Sign up"]');
        await expect(signUpLink).toBeVisible();
        await signUpLink.click();

        // Make sure we are on the signup page
        await expect(page).toHaveURL(/signup.html/);

        // 2. Fill out the sign-up form and submit
        const emailField = page.locator('#txtEmail');
        await expect(emailField).toBeVisible();

        await emailField.fill('test@kea.dk');
        await page.locator('#txtPassword').fill('Testing');
        await page.locator('#txtRepeatPassword').fill('Testing');
        await page.locator('#frmSignup input[type="submit"]').click();

        // Check for alert dialog
        const alertDialog = page.locator('#alert');
        await expect(alertDialog).toHaveAttribute('open', '');

        const alertText = await page.locator('#alert section p').innerText();
        expect([
            'The user was created successfully',
            'The email already exists'
        ]).toContain(alertText.trim());

        const closeButton = page.locator('#alert header button[title="Close Alert"]');
        await expect(closeButton).toBeVisible();
        await closeButton.click();

        await expect(alertDialog).not.toHaveAttribute('open', '');
    });


    test('should login and buy', async ({ page }) => {
        const helper = createWebshopHelpers(page, baseUrl);

        await helper.login('test@kea.dk', 'Testing');
        await helper.addProductToCart('Mens Casual Premium Slim Fit T-Shirts', 1);
        await helper.addProductToCart('SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s', 2);
        await helper.openCart();
        await helper.updateCartQuantity('SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s', 3);
        await helper.proceedToCheckout();
        await helper.placePurchase();
        await helper.openCartExpectingEmptyAlert();
        await helper.closeAlert();
        await helper.logout();
    });
});
