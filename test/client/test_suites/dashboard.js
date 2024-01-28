import { By } from "selenium-webdriver";
import { describe, it } from "mocha";
import { createDriver, createDriverHelper, baseURL, existingLearner, defaultTestSuiteTimeout, takeScreenshot } from "../utils/util.js";
import { expect } from "chai";

const driver = await createDriver();
const helper = createDriverHelper(driver);

describe("Learner Dashboard Test Suite", function () {
    this.timeout(defaultTestSuiteTimeout);

    this.beforeAll(async function () {
        await helper.loginAsLearner();

        await helper.clickElement("Dashboard");
        await helper.waitTimeout();
    });

    this.afterEach(async function () {
        if (this.currentTest.state === "failed") {
            const testName = this.currentTest.fullTitle();
            await takeScreenshot(driver, `${testName}.png`);
        }
    });

    it("Welcome renders", async function () {
        const name = await driver.findElement(By.id("pageTitle")).getText();
        expect(name).to.include(existingLearner.username);
    });

    it("Overview renders", async function () {
        await helper.checkElementExists("overview");
    });

    it("Milestones render", async function () {
        await helper.checkElementExists("milestones");
    });

    it("Top masteries render", async function () {
        await helper.checkElementExists("topMasteries");
    });

    it("Account card renders", async function () {
        const accountCard = await driver.findElement(By.id("accountCard"));
        const name = await accountCard.findElement(By.css("h1")).getText();
        expect(name).equal(existingLearner.username);
    });

    it("Calendar renders", async function () {
        await helper.checkElementExists("calendar");
    });

    it("Badges render", async function () {
        await helper.checkElementExists("badges");
    });

    it("Notifications clickable & renders", async function () {
        await helper.clickElement("notifications");
        await helper.checkElementExists("notifications-tooltip");
    });

    it("Notifications claimable", async function () {
        const newComerNotification = await helper.findElement("notification-1");
        const claimBtn = await newComerNotification.findElement(By.css(".claimBtn"));

        await claimBtn.click();
        await helper.checkElementNotExists("notification-1");
    });

    it("Default text for no notifications", async function () {
        await helper.hoverElement("notifications");

        await driver.wait(async () => {
            try {
                await helper.findElement("default-notification");
                return true;
            } catch (e) {
                return false;
            }
        }, 5000);
    });

    after(async function () {
        await driver.quit();
    });
});
