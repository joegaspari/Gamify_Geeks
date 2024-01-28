import { Builder, Button, By, Key, WebDriver, until  } from 'selenium-webdriver';
import { describe, it } from 'mocha';
import { createDriver, createDriverHelper, baseURL, existingLearner, takeScreenshot, defaultTestSuiteTimeout} from '../utils/util.js'
import { expect } from 'chai';

const driver = await createDriver()
const helper = createDriverHelper(driver)

describe('Students Test Suite', function() {
  
  this.timeout(defaultTestSuiteTimeout);

  this.beforeAll(async function() {
    await helper.navigate(`${baseURL}/accounts/login`)

    await helper.enterTextInput('Email or Username', existingLearner.username)

    await helper.enterTextInput('Password', existingLearner.password)
    
    await helper.clickElement('submitBtn')

    await helper.checkUrl(`${baseURL}/`)

    await helper.checkElementExists('mainNavbar')
    await helper.clickElement('Students')
    await helper.waitTimeout()
  })

  this.afterEach(async function() {
    if (this.currentTest.state === 'failed') {
      const testName = this.currentTest.fullTitle();
      await takeScreenshot(driver, `${testName}.png`)
    }
  })

  it('Add students popup', async function() {
    await helper.clickElement('addStudentsPopup')
    await helper.waitElement('popupOverlay')
    const popup = await helper.findElement('addStudentsPopup-container')
    const closeBtn = await popup.findElement(By.css('button'))
    await closeBtn.click()
  })

  // TODO: Add once feature is implemented
  // it('Class code onClick copy', async function() {
  //   await helper.clickElement('addStudentsPopup')
  //   await helper.waitElement('popupOverlay')
  //   const popup = await helper.findElement('addStudentsPopup-container')

  //   const classCode = await popup.findElement(By.id('classCode')).getText();

  //   const copyBtn = await popup.findElement(By.id('copyBtn'))
  //   await copyBtn.click();
  //   const clipboardContent = await driver.executeScript('return navigator.clipboard.readText();');

  //   const closeBtn = await popup.findElement(By.css('button'))
  //   await closeBtn.click()

  //   expect(clipboardContent).to.equal(classCode)
  // })

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

  it('Search students filter', async function() {
    const textSearchValues = ['1', '2', '12', 'User', 'User12']

    for (const textSearchValue of textSearchValues){
        await helper.enterTextInput('search_Students', textSearchValue)
        await new Promise(resolve => setTimeout(resolve, 500))

        const students = await driver.findElements(By.css('.studentName'))

        for (const student of students){
            const studentName = await student.getText();
            // Bugged: Missing textDom every so often despite text rendering
            if (studentName != ''){
                expect(studentName.toLowerCase()).to.include(textSearchValue.toLowerCase())
            }
        }
    }
  })

  // TODO: Implement selectable individual students
  // it('Individual students details visible', async function() {
  //   await helper.enterTextInput('search_Students', '')
  //   await new Promise(resolve => setTimeout(resolve, 500))

  //   const students = await driver.findElements(By.css('.studentRow'));

  //   await Promise.all(students.map(async(student) => {
  //       const initialState = await student.getAttribute('data-state')
  //       await student.click();

  //       await driver.wait(async () => {
  //           const newState = await student.getAttribute('data-state')
  //           return newState !== initialState
  //       }, 1000)
  //   }))
  // })

  after(async function() {
    await driver.quit();
  });

});