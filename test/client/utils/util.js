import { expect } from "chai";
import { Builder, By, Key, until, Capabilities } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import fs from "fs/promises";

// TODO: Remove (Kept here for Intellisense)
// TODO: Add more drivers for different browsers
// const driver = await new Builder().forBrowser('chrome').build();

const baseURL = "http://localhost:3000";

const existingLearner = {
    firstName: "Mock",
    lastName: "Learner",
    username: "mocklearner",
    email: "mocklearner@gmail.com",
    password: "Test1234!",
};

// Randomize New Learner Data
const newLearner = {
    firstName: "New",
    lastName: "Learner",
    username: "newlearner",
    email: "newlearner@gmail.com",
    password: "newPassword",
};

const existingInstructor = {
    firstName: "Mock",
    lastName: "Instructor",
    username: "mockinstructor",
    email: "mockinstructor@gmail.com",
    password: "Test1234!",
};

const newInstructor = {
    firstName: "New",
    lastName: "Learner",
    username: "newlearner",
    email: "newinstructor@gmail.com",
    password: "newPassword",
    institutionCode: "123-456-789", // TODO: Change to valid institution code
};

const takeScreenshot = async (driver, filename) => {
    try {
        const screenshot = await driver.takeScreenshot();
        await fs.writeFile(filename, screenshot, "base64");
    } catch (error) {
        console.error("Error capturing screenshot:", error);
    }
};

const createDriver = async (width = 1920, height = 1080) => {
    // Set the Page Load Strategy
    const capabilities = Capabilities.chrome();
    capabilities.set("pageLoadStrategy", "normal");

    // Set Chrome options
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments("--no-sandbox");
    chromeOptions.addArguments("--headless");
    chromeOptions.addArguments(`--window-size=${width},${height}`);
    chromeOptions.excludeSwitches("enable-logging"); // Disable logging

    // Create the WebDriver with the specified Chrome options
    const driver = await new Builder().forBrowser("chrome").withCapabilities(capabilities).setChromeOptions(chromeOptions).build();

    await driver.manage().window().setRect({ width: width, height: height });

    return driver;
};

// Separate defaultTimeout to timeouts for classes (Buttons, Major Components, Page Loads)
const defaultTimeout = 5000;
const defaultTestSuiteTimeout = 45000;
const createDriverHelper = function (driver, defaultTimeout) {
    const navigate = async (url) => {
        return driver.get(url);
    };

    const clearTextInput = async (inputId, timeout = defaultTimeout) => {
        await driver.wait(until.elementLocated(By.id(inputId)), timeout);
        const elem = await driver.findElement(By.id(inputId));
        await elem.sendKeys(Key.CONTROL, "a");
        await elem.sendKeys(Key.DELETE);
    };

    const enterTextInput = async (inputId, value, timeout = defaultTimeout) => {
        await driver.wait(until.elementLocated(By.id(inputId)), timeout);
        const elem = await driver.findElement(By.id(inputId));
        await elem.clear();
        await elem.sendKeys(value);
    };

    const clickElement = async (elemId, timeout = defaultTimeout) => {
        await driver.wait(until.elementLocated(By.id(elemId)), timeout);
        return driver.findElement(By.id(elemId)).click();
    };

    const checkNotClickable = async (elemId, timeout = defaultTimeout) => {
        try {
            await driver.wait(until.elementLocated(By.id(elemId)), timeout);
            await driver.findElement(By.id(elemId)).click();
            throw new Error(`${elemId} is clickable`);
        } catch (error) {
            expect(error.name).to.equal("ElementClickInterceptedError");
        }
    };

    const hoverElement = async (elemId, timeout = defaultTimeout) => {
        await driver.wait(until.elementLocated(By.id(elemId)), timeout);
        const elem = await driver.findElement(By.id(elemId));
        const actions = driver.actions({ bridge: true });
        return actions.move({ origin: elem }).perform();
    };

    const checkUrl = (url, timeout = defaultTimeout) => {
        return driver.wait(until.urlIs(url), timeout);
    };

    const checkUrlContains = (url, timeout = defaultTimeout) => {
        return driver.wait(until.urlContains(url), timeout);
    };

    const findElement = async (elemId, timeout = defaultTimeout) => {
        await driver.wait(until.elementLocated(By.id(elemId)), timeout);
        return driver.findElement(By.id(elemId));
    };

    const checkElementExists = async (elemId, timeout = defaultTimeout) => {
        await driver.wait(until.elementLocated(By.id(elemId)), timeout);
        const elem = await driver.findElement(By.id(elemId));
        expect(elem).to.exist;
    };

    const checkElementNotExists = async (elemId, timeout = 1000) => {
        try {
            await driver.wait(until.elementLocated(By.id(elemId)), timeout);
            // const elem = await driver.findElement(By.id(elemId));
            // throw new Error(`${elemId} exists`);
        } catch (error) {
            expect(error.name).to.equal("TimeoutError");
        }
    };

    const checkTextValue = async (elemId, value, timeout = defaultTimeout) => {
        await driver.wait(async () => {
            const textValue = await driver.findElement(By.id(elemId)).getText();
            return textValue == value;
        }, timeout);
    };

    const checkInputValue = async (elemId, value, timeout = defaultTimeout) => {
        await driver.wait(async () => {
            const elem = await driver.findElement(By.id(elemId));
            const inputValue = await elem.getAttribute("value");
            return inputValue == value;
        }, timeout);
    };

    const waitElement = (elemId, timeout = defaultTimeout) => {
        return driver.wait(until.elementLocated(By.id(elemId)), timeout);
    };

    const waitTimeout = async (timeout = defaultTimeout) => {
        await new Promise((resolve) => setTimeout(resolve, timeout));
    };

    const loginAsLearner = async () => {
        await navigate(`${baseURL}/accounts/login`);

        await enterTextInput("Email or Username", existingLearner.username);
        await enterTextInput("Password", existingLearner.password);

        await clickElement("submitBtn");

        await checkUrl(`${baseURL}/`);

        await checkElementExists("mainNavbar");
        await waitTimeout();
    };

    const loginAsInstructor = async () => {
        await navigate(`${baseURL}/accounts/login`);

        await enterTextInput("Email or Username", existingInstructor.username);
        await enterTextInput("Password", existingInstructor.password);

        await clickElement("submitBtn");

        await checkUrl(`${baseURL}/`);

        await checkElementExists("mainNavbar");
        await waitTimeout();
    };

    return {
        navigate,
        loginAsLearner,
        loginAsInstructor,
        clearTextInput,
        enterTextInput,
        clickElement,
        checkNotClickable,
        hoverElement,
        checkUrl,
        checkUrlContains,
        findElement,
        checkElementExists,
        checkElementNotExists,
        checkTextValue,
        checkInputValue,
        waitElement,
        waitTimeout,
    };
};

export {
    createDriver,
    createDriverHelper,
    baseURL,
    existingLearner,
    newLearner,
    existingInstructor,
    newInstructor,
    defaultTestSuiteTimeout,
    defaultTimeout,
    takeScreenshot,
};
