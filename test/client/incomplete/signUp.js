import { Builder, By, Key, until } from 'selenium-webdriver';
import { describe, it } from 'mocha';
import { createHelperFunctions, baseURL, existingLearner, newLearner, newInstructor} from '../utils/util.js'

const driver = await new Builder().forBrowser('chrome').build();

const helper = createHelperFunctions(driver)

describe('Sign Up Page Test Suite', function() {

  this.timeout(10000);

  this.beforeEach(async function() {
    await helper.navigate(`${baseURL}/accounts/login`);
    await helper.clickElement('needAccountBtn');
    await helper.waitElement('hasAccountBtn');
  })

  it('Signs up learner with valid info', async function() {
    await helper.enterTextInput('First Name', newLearner.firstName);
    await helper.enterTextInput('Last Name', newLearner.lastName);
    await helper.enterTextInput('Username', newLearner.username);
    await helper.enterTextInput('Email', newLearner.email);
    await helper.enterTextInput('Password', newLearner.password);
    await helper.enterTextInput('Confirm Password', newLearner.password);

    await helper.clickElement('submitBtn');

    await helper.checkUrl(`${baseURL}/`);
    await helper.checkElementExists('mainNavbar')
  })

  it('Signs up instructor with valid info', async function() {
    await helper.clickElement('toggleBtn')

    await helper.enterTextInput('First Name', newInstructor.firstName);
    await helper.enterTextInput('Last Name', newInstructor.lastName);
    await helper.enterTextInput('Username', newInstructor.username);
    await helper.enterTextInput('Email', newInstructor.email);
    await helper.enterTextInput('Password', newInstructor.password);
    await helper.enterTextInput('Confirm Password', newInstructor.password);
    await helper.enterTextInput('Institution Code', newInstructor.institutionCode);

    await helper.clickElement('submitBtn');

    await helper.checkUrl(`${baseURL}/`);
    await helper.checkElementExists('mainNavbar')
  })

  it('Error on empty first name', async function() {
    await helper.enterTextInput('First Name', '');
    await helper.enterTextInput('Last Name', newLearner.lastName);
    await helper.enterTextInput('Username', newLearner.username);
    await helper.enterTextInput('Email', newLearner.email);
    await helper.enterTextInput('Password', newLearner.password);
    await helper.enterTextInput('Confirm Password', newLearner.password);

    await helper.clickElement('submitBtn');

    await helper.checkTextValue('First Name-Error', "First Name is required!")
  })

  it('Error on empty last name', async function() {
    await helper.enterTextInput('First Name', newLearner.firstName);
    await helper.enterTextInput('Last Name', '');
    await helper.enterTextInput('Username', newLearner.username);
    await helper.enterTextInput('Email', newLearner.email);
    await helper.enterTextInput('Password', newLearner.password);
    await helper.enterTextInput('Confirm Password', newLearner.password);

    await helper.clickElement('submitBtn');

    await helper.checkTextValue('Last Name-Error', "Last Name is required!")
  })

  it('Error on empty username', async function() {
    await helper.enterTextInput('First Name', newLearner.firstName);
    await helper.enterTextInput('Last Name', newLearner.lastName);
    await helper.enterTextInput('Username', '');
    await helper.enterTextInput('Email', newLearner.email);
    await helper.enterTextInput('Password', newLearner.password);
    await helper.enterTextInput('Confirm Password', newLearner.password);

    await helper.clickElement('submitBtn');

    await helper.checkTextValue('Username-Error', "Username is required!");
  })

  it('Error on empty email', async function() {
    await helper.enterTextInput('First Name', newLearner.firstName);
    await helper.enterTextInput('Last Name', newLearner.lastName);
    await helper.enterTextInput('Username', newLearner.username);
    await helper.enterTextInput('Email', '');
    await helper.enterTextInput('Password', newLearner.password);
    await helper.enterTextInput('Confirm Password', newLearner.password);

    await helper.clickElement('submitBtn');

    await helper.checkTextValue('Email-Error', "Email is required!")
  })

  it('Error on empty password', async function() {
    await helper.enterTextInput('First Name', newLearner.firstName);
    await helper.enterTextInput('Last Name', newLearner.lastName);
    await helper.enterTextInput('Username', newLearner.username);
    await helper.enterTextInput('Email', newLearner.email);
    await helper.enterTextInput('Password', '');
    await helper.enterTextInput('Confirm Password', newLearner.password);

    await helper.clickElement('submitBtn');

    await helper.checkTextValue('Password-Error', "Password is required!")
  })

  it('Error on empty confirm password', async function() {
    await helper.enterTextInput('First Name', newLearner.firstName);
    await helper.enterTextInput('Last Name', newLearner.lastName);
    await helper.enterTextInput('Username', newLearner.username);
    await helper.enterTextInput('Email', newLearner.email);
    await helper.enterTextInput('Password', newLearner.password);
    await helper.enterTextInput('Confirm Password', '');

    await helper.clickElement('submitBtn');

    await helper.checkTextValue('Confirm Password-Error', "Confirm Password is required!")
  })

  it('Error on username already taken', async function() {
    await helper.enterTextInput('First Name', newLearner.firstName);
    await helper.enterTextInput('Last Name', newLearner.lastName);
    await helper.enterTextInput('Username', existingLearner.username);
    await helper.enterTextInput('Email', newLearner.email);
    await helper.enterTextInput('Password', newLearner.password);
    await helper.enterTextInput('Confirm Password', newLearner.password);

    await helper.clickElement('submitBtn');

    await helper.checkTextValue('Username-Error', "Username is already taken!");
  })

  it('Error on email already in use', async function() {
    await helper.enterTextInput('First Name', newLearner.firstName);
    await helper.enterTextInput('Last Name', newLearner.lastName);
    await helper.enterTextInput('Username', newLearner.username);
    await helper.enterTextInput('Email', existingLearner.email);
    await helper.enterTextInput('Password', newLearner.password);
    await helper.enterTextInput('Confirm Password', newLearner.password);

    await helper.clickElement('submitBtn');

    await helper.checkTextValue('Email-Error', "Email is already in use!");
  })

  it('Error on confirm password does not match', async function() {
    await helper.enterTextInput('First Name', newLearner.firstName);
    await helper.enterTextInput('Last Name', newLearner.lastName);
    await helper.enterTextInput('Username', newLearner.username);
    await helper.enterTextInput('Email', newLearner.email);
    await helper.enterTextInput('Password', newLearner.password);
    await helper.enterTextInput('Confirm Password', newLearner.password + '1');

    await helper.clickElement('submitBtn');

    await helper.checkTextValue('Confirm Password-Error', "Confirm Password must match!");
  })

  it('Error on invalid institution code', async function() {
    await helper.clickElement('toggleBtn')

    await helper.enterTextInput('First Name', newInstructor.firstName);
    await helper.enterTextInput('Last Name', newInstructor.lastName);
    await helper.enterTextInput('Username', newInstructor.username);
    await helper.enterTextInput('Email', newInstructor.email);
    await helper.enterTextInput('Password', newInstructor.password);
    await helper.enterTextInput('Confirm Password', newInstructor.password);
    await helper.enterTextInput('Institution Code', 'invalidInstitutionCode');

    await helper.clickElement('submitBtn');

    await helper.checkTextValue('Institution Code-Error', "Institution Code is invalid!");
  })

  it('Navigates to sign in', async function() {
    await helper.clickElement('toggleBtn')

    await helper.clickElement('hasAccountBtn')
    await helper.checkElementExists('needAccountBtn')
  })

  it('Toggle functions', async function() {
    await helper.clickElement('toggleBtn')
    await helper.checkTextValue('currentToggle', 'Instructor')

    await helper.clickElement('toggleBtn')
    await helper.checkTextValue('currentToggle', 'Student')
  })
  
  // Currently tests only first input for required tag. 
  // Can be changed to add all inputs. 
  it('Displays required on empty inputs', async function() {
    await helper.clickElement('toggleBtn')
    
    await helper.enterTextInput('First Name', '');
    await helper.checkElementExists('First Name-required');

    await helper.enterTextInput('First Name', ' ');
    await helper.checkElementNotExists('First Name-required');
  })

  it('Navigates to dashboard on already logged in user', async function() {
    await helper.navigate(`${baseURL}/accounts/login`);

    await helper.enterTextInput('Email or Username', existingLearner.username)
    await helper.enterTextInput('Password', existingLearner.password);
    
    await helper.clickElement('submitBtn')

    await helper.checkUrl(`${baseURL}/`)
    await helper.checkElementExists('mainNavbar')

    await helper.navigate(`${baseURL}/accounts/login`);

    await helper.checkUrl(`${baseURL}/`)
    await helper.checkElementExists('mainNavbar')
  })

  after(async function() {
    await driver.quit();
  });

});


