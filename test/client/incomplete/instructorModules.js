import { Builder, Button, By, Key, WebDriver, until  } from 'selenium-webdriver';
import { describe, it } from 'mocha';
import { createDriver, createDriverHelper, baseURL, existingLearner, takeScreenshot, defaultTestSuiteTimeout } from '../utils/util.js'
import { expect } from 'chai';

const driver = await createDriver()
const helper = createDriverHelper(driver)

describe('Instructor Modules Test Suite', function() {

  this.timeout(defaultTestSuiteTimeout);

  this.beforeAll(async function() {
    await helper.navigate(`${baseURL}/accounts/login`)
    
    await helper.enterTextInput('Email or Username', existingLearner.username)
    await helper.enterTextInput('Password', existingLearner.password)
    
    await helper.clickElement('submitBtn')

    await helper.checkUrl(`${baseURL}/`)

    await helper.checkElementExists('mainNavbar')
    await helper.clickElement('Modules')
    await helper.waitTimeout()
    // TODO: Login as Instructor
  })

  this.afterEach(async function() {
    if (this.currentTest.state === 'failed') {
      const testName = this.currentTest.fullTitle();
      await takeScreenshot(driver, `${testName}.png`)
    }
  })

  it('Default details with unselected assignment', async function() {
    await helper.checkTextValue('default-text', "Please select any of your assignments to view & edit the details!")
  })

  it('Add module', async function() {
    await driver.wait(driver.findElement(By.css('.accordion')), 10000)
    const initialAccordionItems = await driver.findElements(By.css('.accordion__item'))
    const initialNumberOfItems = initialAccordionItems.length

    await helper.clickElement('addModuleBtn')
    await driver.wait(async() => {
      const newAccordionItems = await driver.findElements(By.css('.accordion__item'))
      const newNumberOfItems = newAccordionItems.length
      return newNumberOfItems === initialNumberOfItems + 1;
    }, 2000)
  })

  it('Modules dropdown toggleable', async function() {
    const accordionItems = await driver.findElements(By.css('.accordion__item'))

    await Promise.all(accordionItems.map(async(accordionItem) => {
      const header = await accordionItem.findElement(By.css('.accordion__heading'))
      const panel = await accordionItem.findElement(By.css('.accordion__panel'))
      var initialStatus = await panel.getAttribute('aria-hidden')

      await header.click()
      await driver.wait(async () => {
        const updatedStatus = await panel.getAttribute('aria-hidden')
        return initialStatus == 'true' && updatedStatus == 'false'
      }, 2000)

      initialStatus = await panel.getAttribute('aria-hidden')

      await header.click()
      await driver.wait(async () => {
        const updatedStatus = await panel.getAttribute('aria-hidden')
        return initialStatus == 'false' && updatedStatus == 'true'
      }, 2000)
    }))
  })

  it('Module visibility toggleable', async function() {
    const accordionItems = await driver.findElements(By.css('.accordion__item'))

    await Promise.all(accordionItems.map(async(accordionItem) => {
      const header = await accordionItem.findElement(By.css('.accordion__heading'))
      const moduleVisibilityBtn = await header.findElement(By.id('moduleVisibility'))
      const initialModuleVisibility = await moduleVisibilityBtn.getAttribute('innerHTML')

      await moduleVisibilityBtn.click();
      await driver.wait(async() => {
        const newModuleVisibility = await moduleVisibilityBtn.getAttribute('innerHTML')
        return newModuleVisibility != initialModuleVisibility
      })
    }))
  })

  it('Add assignment', async function() {
    const accordionItems = await driver.findElements(By.css('.accordion__item'))

    await Promise.all(accordionItems.map(async(accordionItem) => {
      const header = await accordionItem.findElement(By.css('.accordion__heading'))
      const panel = await accordionItem.findElement(By.css('.accordion__panel'))
      const addAssignmentBtn = await header.findElement(By.id('addAssignmentBtn'))

      const initialAssignments = await panel.findElements(By.css('.assignment'))
      const initialNumberOfAssignments = initialAssignments.length;

      await header.click()
      await addAssignmentBtn.click()

      await driver.wait(async() => {
        const newAssignments = await panel.findElements(By.css('.assignment'))
        const newNumberOfAssignments = newAssignments.length;
        return newNumberOfAssignments == initialNumberOfAssignments + 1;
      })
    }))
  })

  it('Assigmment visiblity toggleable', async function() {
    const accordionItems = await driver.findElements(By.css('.accordion__item'))

    await Promise.all(accordionItems.map(async(accordionItem) => {
      const header = await accordionItem.findElement(By.css('.accordion__heading'))
      const panel = await accordionItem.findElement(By.css('.accordion__panel'))
      const panelItems = await panel.findElements(By.css('.assignment'))

      await header.click()
      await Promise.all(panelItems.map(async(panelItem) => {
        const visiblityBtn = await panelItem.findElement(By.id('assignmentVisibilityBtn'))
        var initialVisibilty = await visiblityBtn.getAttribute('innerHTML')

        await driver.executeScript('arguments[0].click();', visiblityBtn);
        await driver.wait(async() => {
          const newVisibility = await visiblityBtn.getAttribute('innerHTML')
          return newVisibility != initialVisibilty
        })

        initialVisibilty = await visiblityBtn.getAttribute('innerHTML')
        await driver.executeScript('arguments[0].click();', visiblityBtn);
        await driver.wait(async() => {
          const newVisibility = await visiblityBtn.getAttribute('innerHTML')
          return newVisibility != initialVisibilty
        })
      }))
    }))
  })

  // TODO: Ask team if testing is necessary as libraries have been utilized
  // it('Assignment drag reordering without selected', async function() {

  // })

  // it('Assignment drag reordering with selected', async function() {

  // })

  it('Individual assignment details viewable onClick', async function() {
    const accordionItems = await driver.findElements(By.css('.accordion__item'))

    await Promise.all(accordionItems.map(async(accordionItem) => {
      const header = await accordionItem.findElement(By.css('.accordion__heading'))
      const panel = await accordionItem.findElement(By.css('.accordion__panel'))
      const panelItems = await panel.findElements(By.css('.assignment'))

      await header.click()
      await Promise.all(panelItems.map(async(panelItem) => {
        const editBtn = await panelItem.findElement(By.id('assignmentEditBtn'))
        // const detailsContaner = await helper.findElement('details-container')
        // const initialDetails = await detailsContaner.getAttribute('innerHTML')

        await driver.executeScript('arguments[0].click();', editBtn);
        // await driver.wait(async() => {
        //   const newDetails = await detailsContaner.getAttribute('innerHTML')
        //   return newDetails != initialDetails
        // }, 2000)
      }))

      var initialStatus = await panel.getAttribute('aria-hidden')

      await header.click()
      await driver.wait(async () => {
        const updatedStatus = await panel.getAttribute('aria-hidden')
        return initialStatus == 'false' && updatedStatus == 'true'
      }, 2000)

    }))
  })
  
  it('Update assignment details', async function() {
    const accordionItems = await driver.findElements(By.css('.accordion__item'))

    await Promise.all(accordionItems.map(async(accordionItem) => {
      const header = await accordionItem.findElement(By.css('.accordion__heading'))
      const panel = await accordionItem.findElement(By.css('.accordion__panel'))
      const panelItems = await panel.findElements(By.css('.assignment'))

      await header.click()
      await Promise.all(panelItems.map(async(panelItem) => {
        const editBtn = await panelItem.findElement(By.id('assignmentEditBtn'))
        // const detailsContaner = await helper.findElement('details-container')
        // const initialDetails = await detailsContaner.getAttribute('innerHTML')

        await driver.executeScript('arguments[0].click();', editBtn);
        // await driver.wait(async() => {
        //   const newDetails = await detailsContaner.getAttribute('innerHTML')
        //   return newDetails != initialDetails
        // }, 2000)

        // const initialPanelContents = await panelItem.getAttribute('innerHTML')
        await helper.clickElement('saveChangesBtn')

        // await driver.wait(async() => {
        //   const newPanelContents = await panelItem.getAttribute('innerHTML')
        //   return newPanelContents != initialPanelContents
        // }, 2000)
      }))

      var initialStatus = await panel.getAttribute('aria-hidden')

      await header.click()
      await driver.wait(async () => {
        const updatedStatus = await panel.getAttribute('aria-hidden')
        return initialStatus == 'false' && updatedStatus == 'true'
      }, 2000)

    }))
  })

  it('Delete assignment', async function() {
    const accordionItems = await driver.findElements(By.css('.accordion__item'))
    const accordionItem = accordionItems[0]

    const header = await accordionItem.findElement(By.css('.accordion__heading'))
    await header.click()

    const panel = await accordionItem.findElement(By.css('.accordion__panel'))
    const initialAssignments = await panel.findElements(By.css('.assignment'))
    const initialNumberOfAssignments = initialAssignments.length

    const editBtn = await initialAssignments[0].findElement(By.id('assignmentEditBtn'))
    await driver.executeScript('arguments[0].click();', editBtn);

    await helper.clickElement('deleteBtn')
    await driver.wait(async() => {
      const newAssignments = await panel.findElements(By.css('.assignment'))
      const newNumberOfAssignments = newAssignments.length
      return newNumberOfAssignments == initialNumberOfAssignments - 1;
    })

    var initialStatus = await panel.getAttribute('aria-hidden')
    await header.click()
    await driver.wait(async () => {
      const updatedStatus = await panel.getAttribute('aria-hidden')
      return initialStatus == 'false' && updatedStatus == 'true'
    }, 2000)

  })
  
  // TODO: Add once API is integrated
  it('Question loaded to IDE based on assignment params', async function() {

  })

  // TODO: Add once API is integrated
  it('Module data persists', async function() {

  })

  after(async function() {
    await driver.quit();
  });
});