function createWebshopHelpers(driver, baseUrl, By, until) {
    async function login(email, password) {
        await driver.get(baseUrl);

        const loginLink = await driver.wait(
            until.elementLocated(By.css('#optLogin a[title="Log in"]')),
            10000,
            'Could not find the Log in link on the home page'
        );

        await driver.wait(until.elementIsVisible(loginLink), 5000);
        await loginLink.click();

        await driver.wait(until.urlContains('login.html'), 5000);

        const emailField = await driver.wait(
            until.elementLocated(By.id('txtEmail')),
            10000,
            'Login form did not load'
        );
        await driver.wait(until.elementIsVisible(emailField), 5000);

        await emailField.sendKeys(email);
        await driver.findElement(By.id('txtPassword')).sendKeys(password);
        await driver.findElement(By.css('#frmLogin input[type="submit"]')).click();

        await driver.wait(until.urlContains('index.html'), 10000);
    }



    async function addProductToCart(productName, quantity) {
        await driver.executeScript('window.scrollTo(0, 0);');

        const productArticle = await driver.wait(
            until.elementLocated(
                By.xpath(`//article[.//header/h2[normalize-space()="${productName}"]]`)
            ),
            10000,
            `Could not find the product article for ${productName}`
        );

        await driver.executeScript(
            'arguments[0].scrollIntoView({ behavior: "instant", block: "center" });',
            productArticle
        );

        await driver.wait(until.elementIsVisible(productArticle), 5000);

        const quantityInput = await productArticle.findElement(
            By.css('div.cart input[type="number"]')
        );

        await quantityInput.clear();
        await quantityInput.sendKeys(String(quantity));

        const addToCartButton = await productArticle.findElement(
            By.css('div.cart button')
        );

        await driver.wait(until.elementIsVisible(addToCartButton), 5000);
        await addToCartButton.click();
    }
    async function openCart() {
        await driver.executeScript('window.scrollTo(0, 0);');

        const cartLink = await driver.wait(
            until.elementLocated(By.css('#optCart a[title="Cart"]')),
            10000,
            'Could not find the Cart link on the page'
        );

        await driver.wait(until.elementIsVisible(cartLink), 5000);
        await cartLink.click();

        await driver.wait(async () => {
            const isOpen = await driver.executeScript(`
                const dialog = document.querySelector('#cart');
                return !!dialog && dialog.open === true;
            `);
            return isOpen;
        }, 10000, 'Cart dialog did not open after clicking Cart');
    }


    async function updateCartQuantity(productName, quantity) {
        const cartRow = await driver.wait(
            until.elementLocated(
                By.xpath(`//dialog[@id="cart"]//tr[td[@class="titleCell" and normalize-space()="${productName}"]]`)
            ),
            10000,
            `Could not find the cart row for ${productName}`
        );

        await driver.wait(until.elementIsVisible(cartRow), 5000);

        const quantityInput = await cartRow.findElement(
            By.css('td.amountCell input[type="number"]')
        );

        await driver.wait(until.elementIsVisible(quantityInput), 5000);
        await quantityInput.clear();
        await quantityInput.sendKeys(String(quantity));
        await quantityInput.sendKeys('\uE004');
    }


    async function proceedToCheckout() {
        const checkoutButton = await driver.wait(
            until.elementLocated(By.css('#cart input[type="submit"][value="Check Out"]')),
            10000,
            'Could not find the Check Out button in the cart dialog'
        );

        await driver.wait(until.elementIsVisible(checkoutButton), 5000);
        await checkoutButton.click();

        await driver.wait(async () => {
            const isOpen = await driver.executeScript(`
                const dialog = document.querySelector('#checkout');
                return !!dialog && dialog.open === true;
            `);
            return isOpen;
        }, 10000, 'Checkout dialog did not open after clicking Check Out');
    }


    async function placePurchase() {
        const deliveryAddress = await driver.wait(
            until.elementLocated(By.id('txtDeliveryAddress')),
            10000,
            'Could not find the delivery address field'
        );
        await driver.wait(until.elementIsVisible(deliveryAddress), 5000);
        await deliveryAddress.sendKeys('Guldbergsgade 29N');

        await driver.findElement(By.id('txtDeliveryPostalCode')).sendKeys('2200');
        await driver.findElement(By.id('txtDeliveryCity')).sendKeys('Copenhagen');

        const sameAsDeliveryCheckbox = await driver.findElement(By.id('chkRepeat'));
        const isChecked = await sameAsDeliveryCheckbox.isSelected();
        if (!isChecked) {
            await sameAsDeliveryCheckbox.click();
        }

        await driver.findElement(By.id('txtCreditCardName')).sendKeys('Pernille L. Hansen');


        // Special script needed for expiry data
        const expiryDateField = await driver.findElement(By.id('txtExpiryDate'));
        await driver.executeScript(
            `
    arguments[0].value = arguments[1];
    arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
    arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
    `,
            expiryDateField,
            '2027-12'
        );
        // end of script

        await driver.findElement(By.id('txtCVV')).sendKeys('666');

        const placePurchaseButton = await driver.findElement(
            By.css('#checkout input[type="submit"][value="Place Purchase"]')
        );
        await driver.wait(until.elementIsVisible(placePurchaseButton), 5000);
        await placePurchaseButton.click();
    }


    async function closeAlert() {
        await driver.wait(async () => {
            const isOpen = await driver.executeScript(`
                const dialog = document.querySelector('#alert');
                return !!dialog && dialog.open === true;
            `);
            return isOpen;
        }, 10000, 'Alert dialog did not open');

        const closeButton = await driver.findElement(
            By.css('#alert header button[title="Close Alert"]')
        );
        await driver.wait(until.elementIsVisible(closeButton), 5000);
        await closeButton.click();

        await driver.wait(async () => {
            const isOpen = await driver.executeScript(`
                const dialog = document.querySelector('#alert');
                return !!dialog && dialog.open === true;
            `);
            return !isOpen;
        }, 10000, 'Alert dialog did not close');
    }

    async function openCartExpectingEmptyAlert() {
        await driver.executeScript('window.scrollTo(0, 0);');

        const cartLink = await driver.wait(
            until.elementLocated(By.css('#optCart a[title="Cart"]')),
            10000,
            'Could not find the Cart link on the page'
        );

        await driver.wait(until.elementIsVisible(cartLink), 5000);
        await cartLink.click();

        await driver.wait(async () => {
            const isOpen = await driver.executeScript(`
                const dialog = document.querySelector('#alert');
                return !!dialog && dialog.open === true;
            `);
            return isOpen;
        }, 10000, 'Empty cart alert did not open after clicking Cart');

        const alertText = await driver.findElement(By.css('#alert section p')).getText();
        if (alertText !== 'The cart is empty. Please add some products to the cart.') {
            throw new Error(`Unexpected alert text: ${alertText}`);
        }
    }


    async function logout() {
        await driver.executeScript('window.scrollTo(0, 0);');

        const logoutLink = await driver.wait(
            until.elementLocated(By.css('#optLogout a[title="Log out"]')),
            10000,
            'Could not find the Log out link on the page'
        );

        await driver.wait(until.elementIsVisible(logoutLink), 5000);
        await logoutLink.click();

        const loginLink = await driver.wait(
            until.elementLocated(By.css('#optLogin a[title="Log in"]')),
            10000,
            'Log in link was not found after logging out'
        );
        await driver.wait(until.elementIsVisible(loginLink), 5000);
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

module.exports = {
    createWebshopHelpers
};