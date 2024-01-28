import { Builder, By, Key, WebDriver, until } from "selenium-webdriver";
import { describe, it } from "mocha";
import { createDriver, createDriverHelper, baseURL, existingLearner, takeScreenshot, defaultTestSuiteTimeout } from "../utils/util.js";
import { expect } from "chai";

const driver = await createDriver();
const helper = createDriverHelper(driver);

describe("Explore Test Suite", function () {
    this.timeout(defaultTestSuiteTimeout);

    this.beforeAll(async function () {
        await helper.loginAsLearner();

        await helper.clickElement("Explore");
        await helper.waitTimeout();
    });

    this.afterEach(async function () {
        if (this.currentTest.state === "failed") {
            const testName = this.currentTest.fullTitle();
            await takeScreenshot(driver, `${testName}.png`);
        }
    });

    // TODO: Fix search input visibility
    // it("Search option filters", async function () {
    //     // var stringsToTest = ["", "b", "v", "abc", "testing"];
    //     var stringsToTest = ["b"];

    //     for (var strToTest of stringsToTest) {
    //         strToTest = strToTest.toLowerCase();

    //         const element = await driver.wait(until.elementIsVisible(driver.findElement(By.id("search_Search"))));
    //         await element.sendKeys(strToTest);

    //         // Temporary fix. Does not test API calls taking longer than 1s
    //         await new Promise((resolve) => setTimeout(resolve, 1000));

    //         var topicCards = await driver.findElements(By.css(".topicCard"));

    //         await Promise.all(
    //             topicCards.map(async (topicCard) => {
    //                 var topicName = await topicCard.findElement(By.css("h1")).getText();
    //                 topicName = topicName.toLowerCase();
    //                 console.log(topicName);
    //                 expect(topicName).to.satisfy((name) => {
    //                     return name.includes(strToTest);
    //                 });
    //             })
    //         );
    //     }
    // });

    // it("Default text upon no topics found", async function () {
    //     // await helper.checkTextValue('noTopicsFound', "Oh no, there doesn't seem to be any topics that fit this filter!")
    // });

    it("Choosing 1 Multi option filters", async function () {
        const tagContainer = await helper.findElement("Language-tags-container");
        const tags = await tagContainer.findElements(By.xpath("*"));
        const numTags = tags.length;

        for (var i = 1; i < numTags + 1; i++) {
            await helper.waitElement(`${i}_Language`);
            const elem = await driver.findElement(By.id(`${i}_Language`));
            await driver.executeScript("arguments[0].click();", elem);
            const searchedLanguage = await elem.getAttribute("name");

            await helper.waitTimeout(500);
            var topicCards = await driver.findElements(By.css(".topicCard"));

            await Promise.all(
                topicCards.map(async (topicCard) => {
                    var languageCards = await topicCard.findElements(By.css(".languageCard"));
                    var hasLanguage = false;

                    for (const languageCard of languageCards) {
                        var language = await languageCard.getText();
                        if (searchedLanguage == language) {
                            hasLanguage = true;
                            break;
                        }
                    }

                    expect(hasLanguage).to.true;
                })
            );

            await driver.executeScript("arguments[0].click();", elem);
        }
    });

    it("Choosing >1 multi option filters", async function () {
        const tagContainer = await helper.findElement("Language-tags-container");
        const tags = await tagContainer.findElements(By.xpath("*"));
        const numTags = tags.length;

        for (var i = 1; i < numTags; i++) {
            await helper.waitElement(`${i}_Language`);
            await helper.waitElement(`${i + 1}_Language`);
            const elem1 = await driver.findElement(By.id(`${i}_Language`));
            const elem2 = await driver.findElement(By.id(`${i + 1}_Language`));
            await driver.executeScript("arguments[0].click();", elem1);
            await driver.executeScript("arguments[0].click();", elem2);
            const searchedLanguage1 = await elem1.getAttribute("name");
            const searchedLanguage2 = await elem2.getAttribute("name");

            // await new Promise(resolve => setTimeout(resolve, 1000))
            var topicCards = await driver.findElements(By.css(".topicCard"));

            await Promise.all(
                topicCards.map(async (topicCard) => {
                    var languageCards = await topicCard.findElements(By.css(".languageCard"));
                    var hasLanguage1 = false;
                    var hasLanguage2 = false;

                    for (const languageCard of languageCards) {
                        var language = await languageCard.getText();
                        if (searchedLanguage1 == language) {
                            hasLanguage1 = true;
                        }
                        if (searchedLanguage2 == language) {
                            hasLanguage2 = true;
                        }
                        if (hasLanguage1 && hasLanguage2) {
                            break;
                        }
                    }

                    expect(hasLanguage1 && hasLanguage2).to.true;
                })
            );

            await driver.executeScript("arguments[0].click();", elem1);
            await driver.executeScript("arguments[0].click();", elem2);
        }
    });

    // TODO: Uncomment once toggles is required again
    // it('Settings/Leaderboard toggles', async function() {
    //   await helper.clickElement('Leaderboard')
    //   await helper.checkElementExists('leaderboard-container')

    //   await helper.clickElement('Settings')
    //   await helper.checkElementExists('settings-container')
    // })

    it("Cards navigate to question", async function () {
        var topicCards = await driver.findElements(By.css(".topicCard"));
        await topicCards[0].click();

        await helper.checkUrlContains("explore/question");
    });

    after(async function () {
        await driver.quit();
    });
});
