const express = require('express')
const router = new express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')

// Deliver login view
router.get('/login', utilities.handleErrors(accountController.buildLogin))

// Deliver registration view
router.get('/register', utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),   // reglas de validación
  regValidate.checkRegData,          // chequeo de errores
  utilities.handleErrors(accountController.registerAccount) // controlador si pasa validación
)

module.exports = router