import {body, param, query, validationResult} from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    next()
}

/**
 * Password validation rules
 */
const passwordValidationRules = [
    //Must be at least 8 characters long
    body("password")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        // Must contain at least one uppercase letter
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        // Must contain at least one lowercase letter
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        // Must contain at least one number
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        // Must contain at least one special character
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one special character")
];

/**
 * Common validation rules
 */
const commonValidations = {
    name: body("name")
        .trim()
        .escape()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
    
    email: body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email address")
        .normalizeEmail(),
    
 
};

/**
 * Pagination validation rules
 */
export const paginationValidation = [
    query("page")
        .optional()
        .isInt({ min: 1 }).withMessage("Page must be a positive integer")
        .toInt(),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100")
        .toInt(),
    validate
];

/**
 * Validation rules for user registration
 */
export const registerValidation = [
    commonValidations.name,
    commonValidations.email,
    ...passwordValidationRules,
    validate
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
    commonValidations.email,
    ...passwordValidationRules,
    validate
];

export const updateValidation = [ //can have empty fields
    param("id").isMongoId().withMessage("Invalid user ID"),
    body("email").optional().isEmail().withMessage("Invalid email address"),
    body("name").optional().isString().withMessage("Name must be a string"),
    ...passwordValidationRules,
    validate    
];

export const sanitizeKeys = (req, res, next) => {
    const isUnsafe = obj => {
      if (!obj) return false;
      return Object.keys(obj).some(k => k.includes('$') || k.includes('.'));
    };
    
    if (isUnsafe(req.body) || isUnsafe(req.query) || isUnsafe(req.params)) {
      return res.status(400).json({ error: "Invalid characters in input." });
    }
    next();
  };
  