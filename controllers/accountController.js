const utilities = require('../utilities')
const accountModel = require('../models/accountModel')
const bcrypt = require("bcryptjs")

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
async function registerAccount(req, res, next) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    try {
        // Hash password antes de guardar
        const hashedPassword = await bcrypt.hash(account_password, 10)

        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword
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

// Deliver "My Account" view
async function buildAccount(req, res, next) {
    try {
        const nav = await utilities.getNav()
        res.render("account/myaccount", {
            title: "My Account",
            nav,
            errors: null,
            messages: [].concat(req.flash("notice"))
        })
    } catch (error) {
        next(error)
    }
}

// Deliver login view
async function buildLogin(req, res, next) {
    try {
        const nav = await utilities.getNav()
        res.render("account/login", {
            title: "Login",
            nav,
            errors: null,
            messages: [].concat(req.flash("notice"))
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { buildRegister, registerAccount, buildAccount, buildLogin }