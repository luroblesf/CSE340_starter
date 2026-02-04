const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty().withMessage("First name is required.")
            .isLength({ min: 1 }).withMessage("First name must be at least 1 character."),

        body("account_lastname")
            .trim()
            .escape()
            .notEmpty().withMessage("Last name is required.")
            .isLength({ min: 2 }).withMessage("Last name must be at least 2 characters."),

        body("account_email")
            .trim()
            .notEmpty().withMessage("Email is required.")
            .isEmail().withMessage("Please provide a valid email address.")
            .normalizeEmail(),

        body("account_password")
            .trim()
            .notEmpty().withMessage("Password is required.")
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            }).withMessage("Password must be at least 12 characters and include uppercase, lowercase, number, and symbol."),
    ]
}

/* ******************************
 * Login Data Validation Rules
 * ***************************** */
validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .notEmpty().withMessage("Email is required.")
            .isEmail().withMessage("Please provide a valid email address.")
            .normalizeEmail(),

        body("account_password")
            .trim()
            .notEmpty().withMessage("Password is required.")
    ]
}

/* ******************************
 * Check registration data
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.render("account/register", {
            errors: errors.array(),
            title: "Registration",
            nav,
            messages: [].concat(req.flash("notice")),
            account_firstname,
            account_lastname,
            account_email,
        })
    }
    next()
}

/* ******************************
 * Check login data
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.render("account/login", {
            errors: errors.array(),
            title: "Login",
            nav,
            messages: [].concat(req.flash("notice")),
            account_email,
        })
    }
    next()
}

module.exports = validate