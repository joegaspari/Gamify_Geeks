import { Builder, Button, By, Key, WebDriver, until  } from 'selenium-webdriver';
import { describe, it } from 'mocha';
import { createHelperFunctions, baseURL, existingLearner } from '../utils/util.js'
import { expect } from 'chai';

const driver = await new Builder().forBrowser('chrome').build();
await driver.manage().window().setRect({ width: 1600, height: 800 });

const helper = createHelperFunctions(driver)

describe('Student Modules Test Suite', function() {

  this.timeout(10000);

  this.beforeAll(async function() {
    await helper.navigate(`${baseURL}/accounts/login`)

    await helper.enterTextInput('Email or Username', existingLearner.username)
    await helper.enterTextInput('Password', existingLearner.password);
    
    await helper.clickElement('submitBtn')

    await helper.checkUrl(`${baseURL}/`)

    await helper.checkElementExists('mainNavbar')
    await helper.clickElement('Modules')
  })

  it('Default details with unselected assignment', async function() {
    await helper.checkTextValue('default-text', "Please select any of your instructor's assignments to view the details and get started!")
  })

  it('Modules toggleable', async function() {
    const modulesContainer = await helper.findElement('modules-container')
    const Modules = await modulesContainer.findElements(By.css('.module'))

    await Promise.all(Modules.map(async(module) => {
        await module.findElement(By.css('.toggleBtn')).click();
        var assignment = await module.findElement(By.css('.assignment'))
        expect(await assignment.isDisplayed()).to.true

        await module.findElement(By.css('.toggleBtn')).click();
        assignment = await module.findElement(By.css('.assignment'))
        expect(await assignment.isDisplayed()).to.false
    }))
  })

  it('Viewable individual assignment details', async function() {
    const modulesContainer = await helper.findElement('modules-container')
    const Modules = await modulesContainer.findElements(By.css('.module'))

    await Promise.all(Modules.map(async(module) => {
        await module.findElement(By.css('.toggleBtn')).click();
        var assignments = await module.findElements(By.css('.assignment'))

        await Promise.all(assignments.map(async(assignment) => {
          expect(await assignment.isDisplayed()).to.true
          const details = await helper.findElement('details-container')
          const initialElem = await details.getAttribute('innerHTML')

          await assignment.click();

          await driver.wait(async () => {
            const currentElem = await details.getAttribute('innerHTML');
            return currentElem !== initialElem;
          }, 2000);
        }))

        await module.findElement(By.css('.toggleBtn')).click();
    }))
  })

  it('Navigate to assignment with prepared params', async function() {
    await helper.clickElement('startAssignmentBtn')

    await helper.checkUrlContains('explore/question')
    
    // TODO: Gather assignment details from details-container. Check with rendered dropdowns
    // TODO: IDE must have a read-only option
  })

  after(async function() {
    await driver.quit();
  });

});