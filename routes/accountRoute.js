const express = require('express')
const router = new express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')

// Default "/" route → Account Management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Deliver login view
router.get('/login', utilities.handleErrors(accountController.buildLogin))

// Deliver registration view
router.get('/register', utilities.handleErrors(accountController.buildRegister))

// Deliver My Account view
router.get(
  "/myaccount",
  utilities.handleErrors(accountController.buildAccount)
)

// Process the registration data
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login data
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.loginAccount)
)

module.exports = router;