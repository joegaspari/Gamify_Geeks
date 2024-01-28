import { Builder, By, Key, until } from "selenium-webdriver";
import { describe, it } from "mocha";
import { createDriver, createDriverHelper, baseURL, existingLearner, takeScreenshot, defaultTestSuiteTimeout } from "../utils/util.js";

const driver = await createDriver();
const helper = createDriverHelper(driver);

describe("Sign In Page Test Suite", function () {
    this.timeout(defaultTestSuiteTimeout);

    it("Navigates to sign up", async function () {
        await helper.navigate(`${baseURL}/accounts/login`);

        await helper.clickElement("needAccountBtn");
        await helper.checkUrl(`${baseURL}/accounts/signup`); // TODO: Request page change to register

        await helper.navigate(`${baseURL}/accounts/login`);
    });

    it("Error with unregistered user", async function () {
        await helper.enterTextInput("Email or Username", "notRegisteredUser");
        await helper.enterTextInput("Password", "incorrectPassword");

        await helper.clickElement("submitBtn");

        await driver.wait(async () => {
            try {
                await helper.checkTextValue("Email or Username-Error", "User does not exist!");
                return true;
            } catch (error) {
                return false;
            }
        }, 5000);
    });

    // To split into multiple test case for <6, >20, and special characters
    it("Error with incorrect password", async function () {
        await helper.enterTextInput("Email or Username", existingLearner.username);
        await helper.enterTextInput("Password", "incorrectPassword");

        await helper.waitTimeout(5000);
        await helper.clickElement("submitBtn");

        await driver.wait(async () => {
            try {
                await helper.checkTextValue("Password-Error", "Invalid user or password");
                return true;
            } catch (error) {
                return false;
            }
        }, 5000);
    });

    it("Error with empty username", async function () {
        await helper.clearTextInput("Email or Username");
        await helper.enterTextInput("Password", existingLearner.password);

        await helper.clickElement("submitBtn");

        await driver.wait(async () => {
            try {
                await helper.checkTextValue("Email or Username-Error", "Username or Email is required");
                return true;
            } catch (error) {
                return false;
            }
        }, 5000);
    });

    it("Error with empty password", async function () {
        await helper.enterTextInput("Email or Username", existingLearner.username);
        await helper.clearTextInput("Password");

        await helper.clickElement("submitBtn");

        await driver.wait(async () => {
            try {
                await helper.checkTextValue("Password-Error", "Password is required");
                return true;
            } catch (error) {
                return false;
            }
        }, 5000);
    });

    it("Signs in with valid info", async function () {
        await helper.navigate(`${baseURL}/accounts/login`);
        await helper.enterTextInput("Email or Username", existingLearner.username);
        await helper.enterTextInput("Password", existingLearner.password);

        await helper.clickElement("submitBtn");

        await helper.checkUrl(`${baseURL}/`);

        await helper.checkElementExists("mainNavbar");
    });

    // Should NOT be passing (?). TODO: Determine how to logout using driver rather than bot
    it("Navigates to dashboard on already logged in user", async function () {
        // TODO: Ensure user is logged in
        await helper.navigate(`${baseURL}/accounts/login`);

        await helper.checkUrl(`${baseURL}/`);
        await helper.checkElementExists("mainNavbar");
    });

    after(async function () {
        await driver.quit();
    });
});
