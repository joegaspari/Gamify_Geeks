import {validationResult} from 'express-validator';

// Express middlewARE FUNCTION NAMED VALIDATE. THis is used to check if there are validation errors in the request and send a corresopnding response.
const validate = (req,res,next) => {
    // this fetches the result of the validations run on the request data, validationResult returns an object that holds the results of the validations
    const errors = validationResult(req);
    // if there is no validation errors, the function will return next(), which executes the middleware coming after this one
    if (errors.isEmpty()){
        return next();
    }
    // if there are errors, returns 400 status code and the message of the first error.
    return res.status(400).json({message: errors.array()[0].msg});
};

export default validate;