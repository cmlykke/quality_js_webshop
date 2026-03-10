


## Exercise description:

### Selenium WebDriver webshop
Write a happy path end-to-end test in Selenium WebDriver for the [webshop sample](https://github.com/arturomorarioja/js_webshop) that covers the following business path:

1. Click on "Sign up"
2. Insert the e-mail `test@kea.dk`, password and repeat password `Testing`. Click on "Sign up"
3. Click on the subsequent alert's Ok button
4. Click on "Log in"
5. Insert the e-mail `test@kea.dk` and password `Testing`. Click on "Log in"
6. Add to cart one unit of the product `Mens Casual Premium Slim Fit T-Shirts`
7. Scroll down. In the product `SanDisk SSD PLUS 1TB Internal SSD – SATA III 6 Gb/s`, increase the quantity to 2 units. Add both units to the cart
8. Click on "Cart"
9. Increase the units of the product `SanDisk SSD PLUS 1TB Internal SSD – SATA III 6 Gb/s` to 3
10. Click on "Check out"
11. Introduce the address `Guldbergsgade 29N`, postal code `2200`, city `Copenhagen`, in Billing address check "Same as delivery address", in Credit card introduce the name `Pernille L. Hansen`, expiration `December 2027`, CVV `666`. Click on "Place Purchase"
12. Click on "Cart". Confirm that it is empty. Leave the modal
13. Log out. Confirm that the option "Log in" is on the page



