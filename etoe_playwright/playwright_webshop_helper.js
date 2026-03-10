const { expect } = require('@playwright/test');

function createWebshopHelpers(page, baseUrl = 'http://127.0.0.1:8080/') {
    async function login(email, password) {
        await page.goto(baseUrl);

        const loginLink = page.locator('#optLogin a[title="Log in"]');
        await expect(loginLink).toBeVisible();
        await loginLink.click();

        await expect(page).toHaveURL(/login.html/);

        const emailField = page.locator('#txtEmail');
        await expect(emailField).toBeVisible();

        await emailField.fill(email);
        await page.locator('#txtPassword').fill(password);
        await page.locator('#frmLogin input[type="submit"]').click();

        await expect(page).toHaveURL(/index.html/);
    }

    async function addProductToCart(productName, quantity) {
        const productArticle = page
            .locator('article')
            .filter({
                has: page.locator('header h2', { hasText: productName })
            })
            .first();

        await expect(productArticle).toBeVisible();
        await productArticle.scrollIntoViewIfNeeded();

        await productArticle.locator('div.cart input[type="number"]').fill(String(quantity));
        await productArticle.locator('div.cart button').click();
    }

    async function openCart() {
        const cartLink = page.locator('#optCart a[title="Cart"]');
        await expect(cartLink).toBeVisible();
        await cartLink.click();

        await expect(page.locator('#cart')).toHaveAttribute('open', '');
    }

    async function updateCartQuantity(productName, quantity) {
        const cartDialog = page.locator('#cart');
        await expect(cartDialog).toHaveAttribute('open', '');

        const cartRow = cartDialog.locator('tr', { hasText: productName }).first();

        await expect(cartRow).toBeVisible();

        const quantityInput = cartRow.locator('td.amountCell input[type="number"]');
        await expect(quantityInput).toBeVisible();
        await quantityInput.fill(String(quantity));
        await quantityInput.press('Tab');
    }

    async function proceedToCheckout() {
        const checkoutButton = page.locator('#cart input[type="submit"][value="Check Out"]');
        await expect(checkoutButton).toBeVisible();
        await checkoutButton.click();

        await expect(page.locator('#checkout')).toHaveAttribute('open', '');
    }

    async function placePurchase() {
        const checkoutDialog = page.locator('#checkout');
        await expect(checkoutDialog).toHaveAttribute('open', '');

        await page.locator('#txtDeliveryAddress').fill('Guldbergsgade 29N');
        await page.locator('#txtDeliveryPostalCode').fill('2200');
        await page.locator('#txtDeliveryCity').fill('Copenhagen');

        const sameAsDeliveryCheckbox = page.locator('#chkRepeat');
        if (!(await sameAsDeliveryCheckbox.isChecked())) {
            await sameAsDeliveryCheckbox.check();
        }

        await page.locator('#txtCreditCardName').fill('Pernille L. Hansen');

        await page.locator('#txtExpiryDate').evaluate((element) => {
            element.value = '2027-12';
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        });

        await page.locator('#txtCVV').fill('666');
        await page.locator('#checkout input[type="submit"][value="Place Purchase"]').click();
    }

    async function closeAlert() {
        const alertDialog = page.locator('#alert');
        await expect(alertDialog).toHaveAttribute('open', '');

        const closeButton = page.locator('#alert header button[title="Close Alert"]');
        await expect(closeButton).toBeVisible();
        await closeButton.click();

        await expect(alertDialog).not.toHaveAttribute('open', '');
    }

    async function openCartExpectingEmptyAlert() {
        const cartLink = page.locator('#optCart a[title="Cart"]');
        await expect(cartLink).toBeVisible();
        await cartLink.click();

        const alertDialog = page.locator('#alert');
        await expect(alertDialog).toHaveAttribute('open', '');

        await expect(page.locator('#alert section p')).toHaveText(
            'The cart is empty. Please add some products to the cart.'
        );
    }

    async function logout() {
        const logoutLink = page.locator('#optLogout a[title="Log out"]');
        await expect(logoutLink).toBeVisible();
        await logoutLink.click();

        await expect(page.locator('#optLogin a[title="Log in"]')).toBeVisible();
    }

    return {
        login,
        addProductToCart,
        openCart,
        updateCartQuantity,
        proceedToCheckout,
        placePurchase,
        closeAlert,
        openCartExpectingEmptyAlert,
        logout
    };
}

module.exports = { createWebshopHelpers };
