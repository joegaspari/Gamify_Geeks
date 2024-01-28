import { Builder, By, Key, until } from "selenium-webdriver";
import { describe, it } from "mocha";
import { createDriver, createDriverHelper, baseURL, takeScreenshot, defaultTestSuiteTimeout } from "../utils/util.js";

const driver = await createDriver();
const helper = createDriverHelper(driver);

describe("Landing Navbar Test Suite", function () {
    this.timeout(defaultTestSuiteTimeout);

    this.afterEach(async function () {
        if (this.currentTest.state === "failed") {
            const testName = this.currentTest.fullTitle();
            await takeScreenshot(driver, `${testName}.png`);
        }
    });

    it("Navigates to home", async function () {
        await helper.navigate(`${baseURL}`);

        await helper.clickElement("home");

        await helper.checkUrl(`${baseURL}/`);
        await helper.checkElementExists("landingBox");
    });

    // it("Navigates to help", async function () {
    //     await helper.navigate(`${baseURL}`);

    //     await helper.clickElement("help");

    //     await helper.checkUrl(`${baseURL}/help`);
    //     await helper.checkElementExists("help-page");
    // });

    it("Navigates to sign in", async function () {
        await helper.navigate(`${baseURL}`);

        await helper.clickElement("signIn");

        await helper.checkElementExists("needAccountBtn");
    });

    it("Navigates to sign up", async function () {
        await helper.navigate(`${baseURL}`);

        await helper.clickElement("signUp");

        await helper.checkElementExists("hasAccountBtn");
    });

    after(async function () {
        await driver.quit();
    });
});
