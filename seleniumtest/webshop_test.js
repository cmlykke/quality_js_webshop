const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const { createWebshopHelpers } = require('./webshop_helpers');

describe('EK Webshop Happy Path', function () {
    this.timeout(30000);
    let driver;
    let helper;

    const baseUrl = 'http://127.0.0.1:8080/';

    before(async function () {
        driver = await new Builder().forBrowser('MicrosoftEdge').build();
        //driver = await new Builder().forBrowser('chrome').build();
        helper = createWebshopHelpers(driver, baseUrl, By, until);
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    it('should sign up a user', async function () {
        // 1. Open home page and click "Sign up"
        await driver.get(baseUrl);

        const signUpLink = await driver.wait(
            until.elementLocated(By.css('#optSignup a[title="Sign up"]')),
            10000,
            'Could not find the Sign up link on the home page'
        );
        await driver.wait(until.elementIsVisible(signUpLink), 5000);
        await signUpLink.click();

        // Make sure we are on the signup page
        await driver.wait(until.urlContains('signup.html'), 5000);

        // 2. Fill out the sign-up form and submit
        const emailField = await driver.wait(
            until.elementLocated(By.id('txtEmail')),
            10000,
            'Sign-up form did not load'
        );
        await driver.wait(until.elementIsVisible(emailField), 5000);

        await emailField.sendKeys('test@kea.dk');
        await driver.findElement(By.id('txtPassword')).sendKeys('Testing');
        await driver.findElement(By.id('txtRepeatPassword')).sendKeys('Testing');
        await driver.findElement(By.css('#frmSignup input[type="submit"]')).click();

        await driver.wait(async () => {
            return await driver.executeScript(`
                const dialog = document.querySelector('#alert');
                return !!dialog && dialog.open === true;
            `);
        }, 10000, 'Alert dialog did not open after clicking Sign up');

        const alertText = await driver.findElement(By.css('#alert section p')).getText();
        expect(alertText).to.be.oneOf([
            'The user was created successfully',
            'The email already exists'
        ]);

        const closeButton = await driver.findElement(
            By.css('#alert header button[title="Close Alert"]')
        );
        await driver.wait(until.elementIsVisible(closeButton), 5000);
        await closeButton.click();
    });

    it('should login and buy', async function () {
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