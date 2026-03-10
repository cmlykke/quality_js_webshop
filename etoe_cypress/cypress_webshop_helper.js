function createWebshopHelpers(baseUrl = 'http://127.0.0.1:8080/') {
    function login(email, password) {
        cy.visit(baseUrl);

        cy.get('#optLogin a[title="Log in"]')
            .should('be.visible')
            .click();

        cy.url().should('include', 'login.html');

        cy.get('#txtEmail')
            .should('be.visible')
            .clear()
            .type(email);

        cy.get('#txtPassword')
            .should('be.visible')
            .clear()
            .type(password);

        cy.get('#frmLogin input[type="submit"]')
            .should('be.visible')
            .click();

        cy.url().should('include', 'index.html');
    }

    function addProductToCart(productName, quantity) {
        cy.contains('article header h2', productName)
            .should('be.visible')
            .closest('article')
            .within(() => {
                cy.get('div.cart input[type="number"]')
                    .should('be.visible')
                    .clear()
                    .type(String(quantity));

                cy.get('div.cart button')
                    .should('be.visible')
                    .click();
            });
    }

    function openCart() {
        cy.get('#optCart a[title="Cart"]')
            .should('be.visible')
            .click();

        cy.get('#cart').should('have.attr', 'open');
    }

    function updateCartQuantity(productName, quantity) {
        cy.get('#cart').should('have.attr', 'open');

        cy.get('#cart').within(() => {
            cy.contains('tr td.titleCell', productName)
                .should('be.visible')
                .parents('tr')
                .within(() => {
                    cy.get('td.amountCell input[type="number"]')
                        .should('be.visible')
                        .clear()
                        .type(String(quantity))
                        .blur()
                        .trigger('change');
                });
        });
    }

    function proceedToCheckout() {
        cy.get('#cart input[type="submit"][value="Check Out"]')
            .should('be.visible')
            .click();

        cy.get('#checkout').should('have.attr', 'open');
    }

    function placePurchase() {
        cy.get('#checkout').should('have.attr', 'open');

        cy.get('#txtDeliveryAddress')
            .should('be.visible')
            .clear()
            .type('Guldbergsgade 29N');

        cy.get('#txtDeliveryPostalCode')
            .should('be.visible')
            .clear()
            .type('2200');

        cy.get('#txtDeliveryCity')
            .should('be.visible')
            .clear()
            .type('Copenhagen');

        cy.get('#chkRepeat').then(($checkbox) => {
            if (!$checkbox.is(':checked')) {
                cy.wrap($checkbox).click();
            }
        });

        cy.get('#txtCreditCardName')
            .should('be.visible')
            .clear()
            .type('Pernille L. Hansen');

        cy.get('#txtExpiryDate')
            .should('be.visible')
            .invoke('val', '2027-12')
            .trigger('input')
            .trigger('change');

        cy.get('#txtCVV')
            .should('be.visible')
            .clear()
            .type('666');

        cy.get('#checkout input[type="submit"][value="Place Purchase"]')
            .should('be.visible')
            .click();
    }

    function closeAlert() {
        cy.get('#alert').should('have.attr', 'open');

        cy.get('#alert header button[title="Close Alert"]')
            .should('be.visible')
            .click();

        cy.get('#alert').should('not.have.attr', 'open');
    }

    function openCartExpectingEmptyAlert() {
        cy.get('#optCart a[title="Cart"]')
            .should('be.visible')
            .click();

        cy.get('#alert').should('have.attr', 'open');

        cy.get('#alert section p')
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                expect(text.trim()).to.equal(
                    'The cart is empty. Please add some products to the cart.'
                );
            });
    }

    function logout() {
        cy.get('#optLogout a[title="Log out"]')
            .should('be.visible')
            .click();

        cy.get('#optLogin a[title="Log in"]')
            .should('be.visible');
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