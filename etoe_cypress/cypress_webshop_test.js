
const { createWebshopHelpers } = require('./cypress_webshop_helper');


describe('EK Webshop Happy Path - Cypress', () => {
    const helper = createWebshopHelpers();

    it('should sign up a user', () => {
        cy.visit('http://127.0.0.1:8080/');

        cy.get('#optSignup a[title="Sign up"]')
            .should('be.visible')
            .click();

        cy.url().should('include', 'signup.html');

        cy.get('#txtEmail')
            .should('be.visible')
            .type('test@kea.dk');

        cy.get('#txtPassword').type('Testing');
        cy.get('#txtRepeatPassword').type('Testing');

        cy.get('#frmSignup input[type="submit"]').click();

        cy.get('#alert')
            .should('have.attr', 'open');

        cy.get('#alert section p')
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                const alertText = text.trim();

                expect([
                    'The user was created successfully',
                    'The email already exists'
                ]).to.include(alertText);
            });

        cy.get('#alert header button[title="Close Alert"]')
            .should('be.visible')
            .click();

        cy.get('#alert').should('not.have.attr', 'open');
    });


    it('should login and buy', () => {
        helper.login('test@kea.dk', 'Testing');

        helper.addProductToCart('Mens Casual Premium Slim Fit T-Shirts', 1);
        helper.addProductToCart('SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s', 2);
        helper.openCart();
        helper.updateCartQuantity('SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s', 3);
        helper.proceedToCheckout();
        helper.placePurchase();
        helper.openCartExpectingEmptyAlert();
        helper.closeAlert();
        helper.logout();
    });
});


