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

// Process logout request
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err)
    res.clearCookie("jwt")
    res.redirect("/")
  })
})
 
// Show edit account view
router.get("/edit", utilities.checkLogin, accountController.buildEditAccount)

// Proccess account update request
router.post("/update", utilities.checkLogin, accountController.updateAccount)

// Process password change request
router.post("/change-password", utilities.checkLogin, accountController.changePassword)

// Account Management flash message route
router.get("/management", utilities.checkLogin, async (req, res) => {
  const nav = await utilities.getNav();
  res.render("account/myaccount", {   
    title: "Account Management",
    nav,
    accountData: req.session.accountData, 
    messages: [].concat(req.flash("notice"))
  });
});

module.exports = router