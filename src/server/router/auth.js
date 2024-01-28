import express from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { isAuth } from '../middleware/auth.js';
import * as controller from '../controller/auth.js';


const router = express.Router();

// Validation rules for login that checks body of http request
const validateLogin = [
    body('password') // checks password
        .trim()
        .isLength({ min: 8 })
        .withMessage('password should be at least 8 characters'),
    validate, // Apply the custom validation middleware
];

// Validation rules for signup that includes login validations and new rules
const validateSignup = [
    ...validateLogin,
    body('username') // checks the username field 
        .trim()
        .notEmpty()
        .withMessage('username should not be empty!')
        .isLength({ max: 20 })
        .withMessage('username should not be above 20 characters!'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('invalid email')
        .isLength({ max: 50 })
        .withMessage('Email should not be above 50 characters!'),
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('first name should not be empty!')
        .isLength({ max: 20 })
        .withMessage('First Name should not be above 20 characters!'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('last name should not be empty!')
        .isLength({ max: 20 })
        .withMessage('Last Name should not be above 20 characters!'),
    body('institutionCode')
        .isLength({ max: 12 })
        .withMessage('Institution Code should not be more than 12 characters')
    // .custom(async(value, { req }) => {
    //     if(req.query.userRoleId == 3) {
    //         const institution = await findByInstitutionCode(value);
    //         if(!institution) {
    //             throw new Error('code:Invalid institution code');
    //         }
    //     }
    // })
    ,
    validate,
];

// Define routes for signup and login, using the appropriate validation rules and controller functions
router.post('/signup', validateSignup, controller.signup);
router.post('/login', validateLogin, controller.login);
router.get('/me', isAuth, controller.me);

router.put('/password', isAuth, controller.updatePassword);
router.post('/emailVerification', controller.sendVerification);
router.delete('/account', isAuth, controller.deleteAccount);



export default router;



