import { Builder, By, Key, WebDriver, until } from "selenium-webdriver";
import { describe, it } from "mocha";
import { createDriver, createDriverHelper, baseURL, existingLearner, takeScreenshot, defaultTestSuiteTimeout } from "../utils/util.js";
import { expect } from "chai";

const driver = await createDriver();
const helper = createDriverHelper(driver);

describe("Information Center Test Suite", function () {
    this.timeout(defaultTestSuiteTimeout);

    this.beforeAll(async function () {
        await helper.loginAsLearner();

        await helper.clickElement("Info Center");
        await helper.waitTimeout();
    });

    this.afterEach(async function () {
        if (this.currentTest.state === "failed") {
            const testName = this.currentTest.fullTitle();
            await takeScreenshot(driver, `${testName}.png`);
        }
    });

    // it("Loads first category of questions", async function () {
    //     await helper.checkElementExists("Dashboard-questions");
    // });

    // it("Question/Answer cards toggleable", async function () {
    //     await helper.clickElement("Dashboard-category");
    //     const container = await helper.findElement("Dashboard-questions");
    //     const infoCards = await container.findElements(By.css(".infoCard"));

    //     await Promise.all(
    //         infoCards.map(async (infoCard) => {
    //             const toggleBtn = await infoCard.findElement(By.css("button"));
    //             await toggleBtn.click();

    //             const answer = await infoCard.findElement(By.css("p"));
    //             expect(answer).to.exist;

    //             await toggleBtn.click();
    //             try {
    //                 await infoCard.findElement(By.css("p"));
    //             } catch (error) {
    //                 expect(error.name).to.equal("NoSuchElementError");
    //             }
    //         })
    //     );
    // });

    it("Categories selectable", async function () {
        const categoryCards = await driver.findElements(By.css(".categoryCard"));

        for (const categoryCard of categoryCards) {
            const id = await categoryCard.getAttribute("id");
            const category = id.split("-")[0];
            await categoryCard.click();

            await helper.checkElementExists(`${category}-questions`);
        }
    });

    after(async function () {
        await driver.quit();
    });
});
