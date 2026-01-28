const utilities = require('../utilities')
const accountModel = require('../models/accountModel')

// Deliver registration view
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render('account/register', {
        title: 'Register',
        nav,
        errors: null,
        messages: [].concat(req.flash('notice')), // siempre array
        account_firstname: "",  
        account_lastname: "",
        account_email: ""
    })
}

// Process registration
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    try {
        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            account_password
        )

        if (regResult) {
            req.flash('notice', `Congratulations, ${account_firstname}! You're registered. Please log in.`)
            return res.status(201).render("account/login", {
                title: 'Login',
                nav,
                errors: null,
                messages: [].concat(req.flash('notice'))
            })
        } else {
            req.flash('notice', "Sorry, the registration failed.")
            return res.status(501).render('account/register', {
                title: 'Registration',
                nav,
                errors: null,
                messages: [].concat(req.flash('notice')),
                account_firstname,
                account_lastname,
                account_email
            })
        }
    } catch (error) {
        console.error(error)
        req.flash('notice', "An error occurred during registration.")
        return res.status(500).render('account/register', {
            title: 'Registration',
            nav,
            errors: null,
            messages: [].concat(req.flash('notice')),
            account_firstname,
            account_lastname,
            account_email
        })
    }
}

module.exports = { buildRegister, registerAccount }