const utilities = require('../utilities')
const accountModel = require('../models/accountModel')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config()

// Deliver registration view
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render('account/register', {
        title: 'Register',
        nav,
        errors: null,
        messages: [].concat(req.flash('notice')),
        account_firstname: "",
        account_lastname: "",
        account_email: ""
    })
}

// Process registration
async function registerAccount(req, res, next) {
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(account_password, 10)
        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword
        )

        if (regResult) {
            req.flash('notice', `Congratulations, ${account_firstname}! You're registered. Please log in.`)
            return res.redirect("/account/login")
        } else {
            req.flash('notice', "Sorry, the registration failed.")
            return res.redirect("/account/register")
        }
    } catch (error) {
        console.error(error)
        req.flash('notice', "An error occurred during registration.")
        return res.redirect("/account/register")
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
            messages: [].concat(req.flash("notice")),
            accountData: res.locals.accountData
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

/* ****************************************
 *  Process login request
 * ************************************ */
async function loginAccount(req, res, next) {
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        return res.redirect("/account/login")
    }

    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password

            const payload = {
                account_id: accountData.account_id,
                account_firstname: accountData.account_firstname,
                account_lastname: accountData.account_lastname,
                account_email: accountData.account_email,
                account_type: accountData.account_type  
            }

            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
            res.cookie("jwt", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 3600 * 1000
            })

            req.session.loggedin = true
            req.session.accountData = payload

            return res.redirect("/account/myaccount")
        } else {
            req.flash("notice", "Please check your credentials and try again.")
            return res.redirect("/account/login")
        }
    } catch (error) {
        next(error)
    }
}

// Deliver edit account view
async function buildEditAccount(req, res, next) {
    try {
        const nav = await utilities.getNav()
        res.render("account/edit-account", {
            title: "Edit Account",
            nav,
            errors: null,
            messages: [].concat(req.flash("notice")),
            accountData: req.session.accountData
        })
    } catch (error) {
        next(error)
    }
}

async function updateAccount(req, res, next) {
    const { account_firstname, account_lastname, account_email } = req.body
    try {
        const result = await accountModel.updateAccount(
            req.session.accountData.account_id,
            account_firstname,
            account_lastname,
            account_email
        )
        if (result) {
            req.session.accountData.account_firstname = account_firstname
            req.session.accountData.account_lastname = account_lastname
            req.session.accountData.account_email = account_email
            req.flash("notice", "Congratulations, your information has been updated.")
            return res.redirect("/account/myaccount")
        } else {
            req.flash("notice", "Sorry, your update failed.")
            return res.redirect("/account/edit")
        }
    } catch (error) {
        next(error)
    }
}

async function changePassword(req, res, next) {
    const { current_password, new_password } = req.body
    try {
        const accountData = await accountModel.getAccountByEmail(req.session.accountData.account_email)
        const validPassword = await bcrypt.compare(current_password, accountData.account_password)
        if (!validPassword) {
            req.flash("notice", "Current password is incorrect.")
            return res.redirect("/account/edit")
        }
        const hashedPassword = await bcrypt.hash(new_password, 10)
        const result = await accountModel.updatePassword(req.session.accountData.account_id, hashedPassword)
        if (result) {
            req.flash("notice", "Password changed successfully.")
            return res.redirect("/account/myaccount")
        } else {
            req.flash("notice", "Password change failed.")
            return res.redirect("/account/edit")
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    buildRegister, registerAccount, buildAccount, buildLogin, loginAccount, buildEditAccount, updateAccount,
    buildEditAccount, updateAccount, changePassword
}