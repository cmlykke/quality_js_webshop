

# install:
- npm install

# start servers:
- npm run server
- npm run frontend

# Run selenium:
- npx mocha etoe_seleniumtest/webshop_test.js

# Run Cypress:
- no UI:
- npm run test:cypress
- with UI:
- npm run test:cypress:open

# Run Playwright:
- no UI:
- npx playwright test
- with UI:
- npx playwright test --ui



# For Selenium

# intall javascript dependencies in root:

C:\Users\USER\MYPROJECTS\quality_js_webshop> npm install --save-dev json-server

# Run backend server:

C:\Users\USER\MYPROJECTS\quality_js_webshop> json-server --watch data/users.json --host 127.0.0.1

you can then see the backend at http://localhost:3000/

# Run frontend server:

paste http://localhost:63342/quality_js_webshop/ i a browser,

or open index.html in a browser.

# Setup selenium:

* check that selenumdriver is installed and on path (paste in powershell):
- chromedriver --version 
* if you dont have it, install it like this: 
   winget install --id Chromium.ChromeDriver --exact --silent

# Selenium test files in the folder here:
* \quality_js_webshop\seleniumtest
* install selenium:
- npm install --save-dev selenium-webdriver
* install hhtp-server
- npm install --save-dev http-server

* run test:
- npx mocha seleniumtest/webshop_test.js

# when the first test has run, this user will be created:

```adlanguage
,
{
"id": "14",
"email": "test@kea.dk",
"pwd": "Testing"
}
```



