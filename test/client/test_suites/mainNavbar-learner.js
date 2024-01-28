import { Builder, By, Key, until } from "selenium-webdriver";
import { describe, it } from "mocha";
import { createDriver, createDriverHelper, baseURL, existingLearner, takeScreenshot, defaultTestSuiteTimeout } from "../utils/util.js";
import { expect } from "chai";

const driver = await createDriver();
const helper = createDriverHelper(driver);

describe("Learner Main Navbar Test Suite", function () {
    this.timeout(defaultTestSuiteTimeout);

    this.beforeAll(async function () {
        await helper.loginAsLearner();
    });

    this.afterEach(async function () {
        if (this.currentTest.state === "failed") {
            const testName = this.currentTest.fullTitle();
            await takeScreenshot(driver, `${testName}.png`);
        }
    });

    it("Navigates to dashboard", async function () {
        await helper.clickElement("Dashboard");
        await helper.checkElementExists("dashboard-page");
    });

    it("Navigates to explore", async function () {
        await helper.clickElement("Explore");
        await helper.checkElementExists("explore-page");
    });

    it("Navigates to modules", async function () {
        await helper.clickElement("Modules");
        await helper.checkElementExists("modules-page");
    });

    // it('Navigates to students', async function() {
    //   await helper.clickElement('Students')
    //   await helper.checkElementExists('students-page')
    // });

    it("Navigates to analytics", async function () {
        await helper.clickElement("Analytics");
        await helper.checkElementExists("analytics-page");
    });

    it("Navigates to info center", async function () {
        await helper.clickElement("Info Center");
        await helper.checkElementExists("infoCenter-page");
    });

    it("Navigates to account", async function () {
        await helper.clickElement("Account");
        await helper.checkElementExists("account-page");
    });

    // TODO: Connect when there is new learner with no data
    // it('Remove class menu on unselected class', async function() {
    //   const courseName = await helper.findElement('courseName').getText()
    //   expect(courseName).to.satisfy((name) => {
    //     return name == "Add" || name == "Create"
    //   })

    //   await helper.checkElementNotExists('Modules')
    //   await helper.checkElementNotExists('Analytics')
    // })

    it("Choose current class in dropdown", async function () {
        await helper.clickElement("coursesPopupBtn");

        const firstClass = await helper.findElement("1");
        const className = await (await firstClass.findElement(By.css("h2"))).getText();
        await firstClass.click();

        const selectedClassNameElem = await helper.findElement("courseName");
        const selectedClassNameValue = await (await selectedClassNameElem).getText();
        expect(selectedClassNameValue).to.equal(className);
    });

    it("Choose any class in dropdown", async function () {
        await helper.clickElement("coursesPopupBtn");
        await helper.waitTimeout(5000);

        const popup = await helper.findElement("coursesPopup-container");

        const classCards = await popup.findElements(By.css(".classCard"));

        for (var i = 0; i < classCards.length; i++) {
            const classNameElem = await classCards[i].findElement(By.css("h2"));
            const className = await classNameElem.getText();
            await classCards[i].click();

            const selectedClassNameElem = await helper.findElement("courseName");
            const selectedClassName = await selectedClassNameElem.getText();
            expect(selectedClassName).to.equal(className);
            if (i < classCards.length - 1) {
                await helper.clickElement("coursesPopupBtn");
            }
        }
    });

    it("Input valid class code to join class", async function () {
        await helper.clickElement("coursesPopupBtn");

        var popup = await helper.findElement("coursesPopup-container");
        var initialClassCards = await popup.findElements(By.css(".classCard"));
        var initialLength = initialClassCards.length;

        // TODO: Find existing valid class code
        await helper.enterTextInput("search_class_code", "MOCK329");
        await helper.clickElement("addClassBtn");

        await driver.wait(async () => {
            var newClassCards = await popup.findElements(By.css(".classCard"));
            var newLength = newClassCards.length;

            return newLength == initialLength + 1;
        }, 5000);

        await helper.clickElement("coursesPopupBtn");
    });

    it("Input invalid class code to join class", async function () {
        await helper.clickElement("coursesPopupBtn");

        var popup = await helper.findElement("coursesPopup-container");
        var initialClassCards = await popup.findElements(By.css(".classCard"));
        var initialLength = initialClassCards.length;

        // TODO: Find existing valid class code
        await helper.enterTextInput("search_class_code", "BADCODE");
        await helper.clickElement("addClassBtn");

        await helper.waitTimeout(5000);

        await driver.wait(async () => {
            var newClassCards = await popup.findElements(By.css(".classCard"));
            var newLength = newClassCards.length;

            return newLength == initialLength;
        }, 5000);
    });

    it("Cancel logout", async function () {
        await helper.clickElement("logOutButton");

        await helper.waitElement("logOutOverlay");
        const logoutBtn = await helper.findElement("cancelLogOut");
        await logoutBtn.click();

        await helper.navigate(`${baseURL}/dashboard`);
        await helper.checkUrl(`${baseURL}/dashboard`);
    });

    it("Logout", async function () {
        await helper.clickElement("logOutButton");

        await helper.waitElement("logOutOverlay");
        const logoutBtn = await helper.findElement("onLogOut");
        await logoutBtn.click();

        await helper.navigate(`${baseURL}/dashboard`);
        await helper.checkUrl(`${baseURL}/accounts/login`);
    });

    after(async function () {
        await driver.quit();
    });
});
