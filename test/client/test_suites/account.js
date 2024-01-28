import { describe, it } from "mocha";
import { until, By } from "selenium-webdriver";
import { createDriver, createDriverHelper, baseURL, existingLearner, existingInstructor, defaultTestSuiteTimeout, takeScreenshot } from "../utils/util.js";

const driver = await createDriver();
const helper = createDriverHelper(driver);

const updatedLearner = {
    firstName: "MockTwo",
    lastName: "LearnerTwo",
    username: "mocklearnertwo",
    email: "mocklearnertwo@gmail.com",
};

describe("Account Test Suite", function () {
    this.timeout(defaultTestSuiteTimeout);

    this.beforeAll(async function () {
        await helper.loginAsLearner();

        await helper.clickElement("Account");
        await helper.waitTimeout();
    });

    this.afterEach(async function () {
        if (this.currentTest.state === "failed") {
            const testName = this.currentTest.fullTitle();
            await takeScreenshot(driver, `${testName}.png`);
        }
    });

    it("Update account data", async function () {
        await helper.enterTextInput("firstName", updatedLearner.firstName);
        await helper.enterTextInput("lastName", updatedLearner.lastName);
        await helper.enterTextInput("username", updatedLearner.username);
        await helper.enterTextInput("email", updatedLearner.email);

        await helper.clickElement("largeUpdateAccountBtn");
        await helper.checkElementExists("updateSuccessful");

        await helper.enterTextInput("firstName", existingLearner.firstName);
        await helper.enterTextInput("lastName", existingLearner.lastName);
        await helper.enterTextInput("username", existingLearner.username);
        await helper.enterTextInput("email", existingLearner.email);

        await helper.clickElement("largeUpdateAccountBtn");
        await helper.checkElementExists("updateSuccessful");
    });

    it("Update failed upon no changes", async function () {
        await helper.clickElement("largeUpdateAccountBtn");
        await helper.checkElementNotExists("updateSuccessful");
    });

    it("Update failed upon invalid first name", async function () {
        await helper.enterTextInput("firstName", updatedLearner.firstName + "1");
        await helper.enterTextInput("lastName", updatedLearner.lastName);
        await helper.enterTextInput("username", updatedLearner.username);
        await helper.enterTextInput("email", updatedLearner.email);

        await helper.clickElement("largeUpdateAccountBtn");

        const targetText = "First Name can only contain up to 20 alphabetical characters.";
        await driver.wait(async () => {
            try {
                await driver.findElement(By.xpath(`//*[contains(text(), '${targetText}')]`));
                return true;
            } catch (e) {
                return false;
            }
        }, 5000);
    });

    it("Update failed upon invalid last name", async function () {
        await helper.enterTextInput("firstName", updatedLearner.firstName);
        await helper.enterTextInput("lastName", updatedLearner.lastName + "1");
        await helper.enterTextInput("username", updatedLearner.username);
        await helper.enterTextInput("email", updatedLearner.email);

        await helper.clickElement("largeUpdateAccountBtn");

        const targetText = "Last Name can only contain up to 20 alphabetical characters.";
        await driver.wait(async () => {
            try {
                await driver.findElement(By.xpath(`//*[contains(text(), '${targetText}')]`));
                return true;
            } catch (e) {
                return false;
            }
        }, 5000);
    });

    it("Update failed upon invalid username", async function () {
        await helper.enterTextInput("firstName", updatedLearner.firstName);
        await helper.enterTextInput("lastName", updatedLearner.lastName);
        await helper.enterTextInput("username", existingInstructor.username + "`");
        await helper.enterTextInput("email", updatedLearner.email);

        await helper.clickElement("largeUpdateAccountBtn");

        const targetText = "Username can only contain up to 20 characters including alphanumeric characters, periods, underscores, and hyphens.";
        await driver.wait(async () => {
            try {
                await driver.findElement(By.xpath(`//*[contains(text(), '${targetText}')]`));
                return true;
            } catch (e) {
                return false;
            }
        }, 5000);
    });

    it("Update failed upon already taken username", async function () {
        await helper.enterTextInput("firstName", updatedLearner.firstName);
        await helper.enterTextInput("lastName", updatedLearner.lastName);
        await helper.enterTextInput("username", existingInstructor.username);
        await helper.enterTextInput("email", updatedLearner.email);

        await helper.clickElement("largeUpdateAccountBtn");

        const targetText = `${existingInstructor.username} is already taken`;

        await driver.wait(async () => {
            try {
                await driver.findElement(By.xpath(`//*[contains(text(), '${targetText}')]`));
                return true;
            } catch (e) {
                return false;
            }
        }, 5000);
    });

    // TODO: Add once API is integrated
    it("Update notification preferences", async function () {});

    // TODO: Add once API is integrated
    it("Update leaderboard preferences", async function () {});

    it("Account data persists", async function () {
        await helper.enterTextInput("firstName", updatedLearner.firstName);
        await helper.enterTextInput("lastName", updatedLearner.lastName);
        await helper.enterTextInput("username", updatedLearner.username);
        await helper.enterTextInput("email", updatedLearner.email);

        await helper.clickElement("largeUpdateAccountBtn");
        await helper.checkElementExists("updateSuccessful");

        await helper.navigate(`${baseURL}/`);
        await helper.clickElement("Account");

        await helper.checkInputValue("firstName", updatedLearner.firstName);
        await helper.checkInputValue("lastName", updatedLearner.lastName);
        await helper.checkInputValue("username", updatedLearner.username);
        await helper.checkInputValue("email", updatedLearner.email);

        await helper.enterTextInput("firstName", existingLearner.firstName);
        await helper.enterTextInput("lastName", existingLearner.lastName);
        await helper.enterTextInput("username", existingLearner.username);
        await helper.enterTextInput("email", existingLearner.email);

        await helper.clickElement("largeUpdateAccountBtn");
        await helper.checkElementExists("updateSuccessful");
    });

    // TODO: Add once API is integrated
    it("Notification preferences persists", async function () {});

    // TODO: Add once API is integrated
    it("Leaderboard preferences persists", async function () {});

    after(async function () {
        await driver.quit();
    });
});
