import { describe, it } from "mocha";
import { createDriver, createDriverHelper, baseURL, existingLearner, defaultTestSuiteTimeout, defaultTimeout, takeScreenshot } from "../utils/util.js";

const driver = await createDriver();
const helper = createDriverHelper(driver);

describe("Instructor Analytics Test Suite", function () {
    this.timeout(defaultTestSuiteTimeout);

    this.beforeAll(async function () {
        await helper.loginAsInstructor();
        await helper.clickElement("Analytics");
        await helper.waitTimeout();
    });

    this.afterEach(async function () {
        if (this.currentTest.state === "failed") {
            const testName = this.currentTest.fullTitle();
            await takeScreenshot(driver, `${testName}.png`);
        }
    });

    it("Overview renders", async function () {
        await helper.checkElementExists("overview");
    });

    // it("Assignments render", async function () {
    //     await helper.checkElementExists("assignments");
    // });

    it("Top students render", async function () {
        await helper.checkElementExists("topStudents");
    });

    it("Leaderboard renders", async function () {
        await helper.checkElementExists("leaderboard");
    });

    it("Student analytics viewable through the leaderboard", async function () {
        const currentURL = await driver.getCurrentUrl();

        await helper.clickElement("row-1");

        await driver.wait(async () => {
            const newURL = await driver.getCurrentUrl();
            return currentURL != newURL;
        }, defaultTimeout);
    });

    // TODO: Add once API is integrated
    it("Notifications clickable & renders", async function () {
        // await helper.clickElement("notifications");
        // await helper.checkElementExists("notifications-tooltip");
    });

    after(async function () {
        await driver.quit();
    });
});
