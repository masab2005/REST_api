import {body,param,validationResult} from "express-validator";

const validate = (res,req,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    next()
}

export const registerValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    validate    
];

export const loginValidation = [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    validate    
];

export const updateValidation = [
    param("id").isMongoId().withMessage("Invalid user ID"),
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    validate    
];