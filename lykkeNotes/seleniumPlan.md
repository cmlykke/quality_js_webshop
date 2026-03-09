### Plan to Fulfill Exercise Requirements

To complete the 13 steps in `lykkeNotes/exerciseInstructions.md` using Selenium WebDriver, I have developed the following implementation plan. Since your project is JavaScript-based, I recommend using **Selenium WebDriver with Node.js and a test runner like Mocha**.

#### 1. Environment Setup
*   **Install Dependencies**: Add `selenium-webdriver` and a test runner (`mocha` and `chai`) to your `package.json`.
*   **WebDriver Configuration**: Ensure you have the `chromedriver` installed and accessible in your system's PATH.
*   **Starting URL**: The Selenium test will need to open your local `index.html` file (e.g., `file:///C:/Users/CMLyk/IdeaProjects/quality_js_webshop/index.html`).

#### 2. Test Implementation (The 13 Steps)
I will create a Selenium script that automates the following interactions:

*   **Step 1-3: Registration**
    *   Find the link with text "Sign up" and click it.
    *   Locate the input fields by their IDs (`txtEmail`, `txtPassword`, `txtRepeatPassword`) and enter the credentials: `test@kea.dk` and `Testing`.
    *   Find the "Sign up" submit button and click it.
    *   Handle the browser alert or the custom `<dialog>` alert by clicking the "Ok" or close button.

*   **Step 4-5: Authentication**
    *   Find the link with text "Log in" and click it.
    *   Enter the credentials (`test@kea.dk` / `Testing`) in the login form fields.
    *   Click the "Log in" button.

*   **Step 6-7: Product Selection**
    *   Locate the product `Mens Casual Premium Slim Fit T-Shirts` (searching by text) and click its "Add to cart" button.
    *   Scroll to find the `SanDisk SSD PLUS 1TB Internal SSD` product.
    *   Locate the quantity input field next to it, change it to `2`, and click "Add to cart".

*   **Step 8-9: Cart Management**
    *   Click the "Cart" link in the navigation bar.
    *   In the cart dialog, find the `SanDisk SSD` entry and increase its quantity to `3`.

*   **Step 10-11: Checkout & Payment**
    *   Click the "Check out" button in the cart.
    *   Fill out the delivery address (`Guldbergsgade 29N`, `2200`, `Copenhagen`).
    *   Check the "Same as delivery address" checkbox.
    *   Fill out the credit card information (`Pernille L. Hansen`, `December 2027`, `666`).
    *   Click the "Place Purchase" button.

*   **Step 12-13: Final Verification**
    *   Open the "Cart" again and confirm it is empty (assert that no products are listed).
    *   Close the cart modal.
    *   Click "Log out" and verify that the "Log in" option is visible again in the navigation menu.

#### 3. Execution & Verification
1.  **Start JSON Server**: Keep your terminal running `json-server --watch data/users.json --host 127.0.0.1`.
2.  **Run the Test**: Execute the script using `npx mocha tests/webshop_test.js`.
3.  **Confirm Results**: Watch the automated browser perform the steps and ensure the test report shows "Passed".

Would you like me to generate the actual Selenium test script for you?