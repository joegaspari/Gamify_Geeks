import { Builder, By, Key, WebDriver, until, Select } from "selenium-webdriver";
import { describe, it } from "mocha";
import { createDriver, createDriverHelper, baseURL, existingLearner, takeScreenshot, defaultTestSuiteTimeout } from "../utils/util.js";
import { expect } from "chai";

const driver = await createDriver();
const helper = createDriverHelper(driver);

describe("Embedded IDE Test Suite", function () {
    this.timeout(150000);

    const navigateToQuestion = async () => {
        await helper.waitElement("Explore");
        await helper.clickElement("Explore");

        await driver.wait(until.elementLocated(By.css(".topicCard")), 2000);
        var topicCards = await driver.findElements(By.css(".topicCard"));
        await topicCards[2].click();

        await helper.checkUrlContains("explore/question");
        await helper.waitTimeout();
    };

    this.beforeAll(async function () {
        await helper.navigate(`${baseURL}/accounts/login`);

        await helper.enterTextInput("Email or Username", existingLearner.username);
        await helper.enterTextInput("Password", existingLearner.password);

        await helper.clickElement("submitBtn");

        await helper.checkUrl(`${baseURL}/`);
        await helper.checkElementExists("mainNavbar");

        await navigateToQuestion();
    });

    this.afterEach(async function () {
        if (this.currentTest.state === "failed") {
            const testName = this.currentTest.fullTitle();
            await takeScreenshot(driver, `${testName}.png`);
        }
    });

    // TODO: Uncomment once toggles is required again
    // it('Settings/Leaderboard toggles', async function() {
    //   await helper.clickElement('Leaderboard')
    //   await helper.checkElementExists('leaderboard-container')

    //   await helper.clickElement('Questions')
    //   await helper.checkElementExists('questions-container')
    // })

    it("Default text upon loading", async function () {
        const questionDetailsElem = await driver.findElement(By.id("questionDetails"));
        const questionTextElem = await questionDetailsElem.findElement(By.css("p"));
        const questionText = await questionTextElem.getAttribute("innerHTML");
        expect(questionText).to.equal("Select language &amp; difficulty then generate a question!");
    });

    it("Generates new question", async function () {
        await helper.clickElement("generateBtn");

        await helper.waitElement("questionDetails");
        await helper.waitElement("progressPopup", 45000);
        const questionText = await driver.findElement(By.id("questionDetails")).getText();

        expect(questionText).to.not.equal("Select language & difficulty then generate a question!");
    });

    it("Regenerates same question given same params", async function () {
        await helper.clickElement("generateBtn");
        await helper.waitElement("questionDetails");
        await helper.waitElement("progressPopup", 45000);
        const firstQuestionText = await driver.findElement(By.id("questionDetails")).getText();
        const firstQuestionUrl = await driver.getCurrentUrl();

        await helper.navigate(`${baseURL}`);
        await navigateToQuestion();

        await helper.clickElement("generateBtn");
        await helper.waitElement("questionDetails");
        await helper.waitElement("progressPopup", 45000);
        const secondQuestionText = await driver.findElement(By.id("questionDetails")).getText();
        const secondQuestionUrl = await driver.getCurrentUrl();

        expect(firstQuestionText).to.equal(secondQuestionText);
        expect(firstQuestionUrl).to.equal(secondQuestionUrl);
    });

    // // TODO: Add back once Question API is fixed
    it("Save button saves answer to current params", async function () {
        var randomString = "";
        randomString += Math.random();
        randomString += Math.random();
        randomString += Math.random();

        await helper.clickElement("generateBtn");
        await helper.waitElement("questionDetails");
        await helper.waitElement("progressPopup", 45000);
        const ideCurrentLines = await driver.findElements(By.css(".cm-line"));

        await Promise.all(
            ideCurrentLines.map(async (line) => {
                await line.clear();
            })
        );

        const activeLine = await driver.findElement(By.css(".cm-activeLine"));
        await activeLine.sendKeys(randomString);

        await helper.clickElement("saveBtn");

        await helper.navigate(`${baseURL}`);
        await navigateToQuestion();

        await helper.clickElement("generateBtn");
        await helper.waitElement("questionDetails");
        await helper.waitElement("progressPopup", 45000);

        await driver.wait(async () => {
            const savedAnswer = await driver.findElement(By.css(".cm-activeLine")).getText();
            return savedAnswer == randomString;
        });
    });

    it("Reset button confirm popup cancels", async function () {
        await helper.clickElement("generateBtn");
        await helper.waitElement("questionDetails");
        await helper.waitElement("progressPopup", 45000);

        const activeLine = await driver.findElement(By.css(".cm-activeLine"));
        await activeLine.sendKeys("Test");
        const currentAnswer = await (await driver.findElement(By.css(".cm-activeLine"))).getText();

        await helper.clickElement("resetBtn");
        await helper.clickElement("cancelResetBtn");
        const ideCurrentLines = await driver.findElements(By.css(".cm-line"));
        expect(ideCurrentLines.length).to.equal(1);

        expect(currentAnswer).to.not.equal("");
    });

    it("Reset button clears current answer", async function () {
        await helper.clickElement("generateBtn");
        await helper.waitElement("questionDetails");
        await helper.waitElement("progressPopup", 45000);

        await helper.clickElement("resetBtn");
        await helper.clickElement("confirmResetBtn");
        const ideCurrentLines = await driver.findElements(By.css(".cm-line"));
        expect(ideCurrentLines.length).to.equal(1);

        const currentAnswer = await driver.findElement(By.css(".cm-activeLine")).getText();
        expect(currentAnswer).to.equal("");
    });

    it("Reset button disabled on empty answers", async function () {
        const btn = await helper.findElement("resetBtn");
        const btnClasses = await btn.getAttribute("class");

        expect(btnClasses.includes("disabled")).to.equal(true);
    });

    it("Save button disabled on empty answers", async function () {
        const btn = await helper.findElement("saveBtn");
        const btnClasses = await btn.getAttribute("class");

        expect(btnClasses.includes("disabled")).to.equal(true);
    });

    it("Reset button enabled on non-empty answers", async function () {
        const activeLine = await driver.findElement(By.css(".cm-activeLine"));
        await activeLine.sendKeys("Test");
        const btn = await helper.findElement("resetBtn");
        const btnClasses = await btn.getAttribute("class");

        expect(btnClasses.includes("disabled")).to.equal(false);
    });

    it("Save button enabled on non-empty answers", async function () {
        const activeLine = await driver.findElement(By.css(".cm-activeLine"));
        await activeLine.sendKeys("Test");
        const btn = await helper.findElement("saveBtn");
        const btnClasses = await btn.getAttribute("class");

        expect(btnClasses.includes("disabled")).to.equal(false);
    });

    it("Report button", async function () {
        await helper.clickElement("reportPopup");
        await helper.waitElement("popupOverlay");
        const popup = await helper.findElement("reportPopupContainer");

        const reportBtn = await popup.findElement(By.css("button"));
        await reportBtn.click();

        await helper.checkElementNotExists("reportPopupContainer");
        await helper.checkElementNotExists("popupOverlay");
    });

    it("Hint button", async function () {
        await helper.clickElement("generateBtn");
        await helper.waitElement("hintPopup");

        await helper.clickElement("hintPopup");
        await helper.waitElement("popupOverlay");
        const popup = await helper.findElement("hintPopupContainer");

        await helper.waitTimeout(1000);
        const feedback = await driver.findElement(By.id("feedback")).getText();
        expect(feedback).to.not.equal("");

        const closeBtn = await popup.findElement(By.css("button"));
        await closeBtn.click();

        await helper.checkElementNotExists("hintPopupContainer");
        await helper.checkElementNotExists("popupOverlay");
    });

    // it("Question evaluated wrong properly", async function () {
    //     await helper.clickElement("generateBtn");
    //     await helper.waitElement("questionDetails");

    //     await helper.clickElement("resetBtn");
    //     await driver.findElement(By.css(".cm-activeLine")).sendKeys("This is not the correct answer");

    //     await helper.clickElement("progressPopup");
    //     await helper.waitElement("popupOverlay", 5000);
    //     const popup = await helper.findElement("feedbackPopupContainer");
    //     const feedback = await (await driver.findElement(By.id("feedback"))).getText();
    //     expect(feedback).to.not.equal("");

    //     const closeBtn = await popup.findElement(By.css("button"));
    //     await closeBtn.click();

    //     await helper.checkElementNotExists("feedbackPopupContainer");
    //     await helper.checkElementNotExists("popupOverlay");

    //     const savedFeedback = await (await helper.findElement("savedFeedback")).getText();
    //     expect(savedFeedback).to.equal(feedback);
    // });

    // it('Question evaluated right properly', async function() {

    // })

    it("Submit button review answer", async function () {});

    it("Submit button next question", async function () {});

    // TODO: Add back once Question API is fixed
    it("Language select", async function () {
        await helper.clickElement("generateBtn");
        await helper.waitElement("hintPopup");

        const currentQuestion = await (await helper.findElement("questionDetails")).getText();
        const languageSelect = await driver.findElement(By.id("Language-Select"));

        const select = new Select(languageSelect);
        await select.selectByIndex(1);

        const selectedOption = await languageSelect.getAttribute("value");
        expect(selectedOption).to.equal("2");

        await helper.clickElement("generateBtn");
        await helper.waitTimeout(1000);
        await helper.waitElement("hintPopup");
        const newQuestion = await (await helper.findElement("questionDetails")).getText();
    });

    // TODO: Add back once Question API is fixed
    it("Difficulty select", async function () {
        await helper.clickElement("generateBtn");
        await helper.waitElement("hintPopup");

        const currentQuestion = await (await helper.findElement("questionDetails")).getText();
        const difficultySelect = await driver.findElement(By.id("Difficulty-Select"));

        const select = new Select(difficultySelect);
        await select.selectByIndex(1);

        const selectedOption = await difficultySelect.getAttribute("value");
        expect(selectedOption).to.equal("2");

        await helper.clickElement("generateBtn");
        await helper.waitTimeout(1000);
        await helper.waitElement("hintPopup");
        const newQuestion = await (await helper.findElement("questionDetails")).getText();
    });

    after(async function () {
        await driver.quit();
    });
});
