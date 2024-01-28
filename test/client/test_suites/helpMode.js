import { By } from "selenium-webdriver";
import { describe, it } from "mocha";
import { createDriver, createDriverHelper, baseURL, existingLearner, defaultTestSuiteTimeout, takeScreenshot } from "../utils/util.js";
import { expect } from "chai";

const driver = await createDriver();
const helper = createDriverHelper(driver);

describe("Help Mode Test Suite", function () {
    this.timeout(defaultTestSuiteTimeout);

    this.beforeAll(async function () {
        await helper.navigate(`${baseURL}/accounts/login`);
        await helper.checkUrl(`${baseURL}/accounts/login`);

        await helper.enterTextInput("Email or Username", existingLearner.username);
        await helper.enterTextInput("Password", existingLearner.password);

        await helper.clickElement("submitBtn");

        await helper.checkUrl(`${baseURL}/`);

        await helper.checkElementExists("mainNavbar");
        await helper.clickElement("Dashboard");
        await helper.waitTimeout();
    });

    this.afterEach(async function () {
        if (this.currentTest.state === "failed") {
            const testName = this.currentTest.fullTitle();
            await takeScreenshot(driver, `${testName}.png`);
        }
    });

    it("Toggles on", async function () {
        await helper.clickElement("toggleHelpBtn");
        const overlay = await driver.findElement(By.css(".overlay"));
        expect(overlay).to.exist;
    });

    it("All elements hoverable", async function () {
        await helper.hoverElement("overview");
        await helper.checkElementExists("overview-tooltip");

        // Currently only checks the first milestone
        // await helper.hoverElement("milestone-1");
        // await helper.checkElementExists("milestone-1-tooltip");

        await helper.hoverElement("topMasteries");
        await helper.checkElementExists("topMasteries-tooltip");

        await helper.hoverElement("accountCard");
        await helper.checkElementExists("accountCard-tooltip");

        await helper.hoverElement("calendar");
        await helper.checkElementExists("calendar-tooltip");

        await helper.hoverElement("badges");
        await helper.checkElementExists("badges-tooltip");
    });

    it("Disables popups and modals", async function () {
        await helper.hoverElement("notifications");
        await helper.checkElementNotExists("notifications-tooltip");

        await helper.checkNotClickable("Explore");
        await helper.checkUrl(`${baseURL}/dashboard`);
    });

    it("Toggles off", async function () {
        await helper.clickElement("toggleHelpBtn");
        try {
            const overlay = await driver.findElement(By.css(".overlay"));
            throw new Error("Overlay element still exists");
        } catch (error) {
            expect(error.name).to.equal("NoSuchElementError");
        }
    });

    after(async function () {
        await driver.quit();
    });
});
