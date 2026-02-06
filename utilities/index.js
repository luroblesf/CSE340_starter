const { check } = require("express-validator")
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

// Build the dynamic navigation menu
async function getNav() {
  const categories = await invModel.getCategories()
  let nav = '<nav><ul>'
  nav += '<li><a href="/" title="Home page">Home</a></li>'
  categories.forEach(category => {
    nav += `<li><a href="/inventory/${category.classification_name.toLowerCase()}" 
             title="See our ${category.classification_name} inventory">
             ${category.classification_name}</a></li>`
  })
  nav += '</ul></nav>'
  return nav
}

// Error handling in async functions
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Build the vehicle detail HTML
function buildVehicleDetailHTML(vehicle) {
  return `
<section class="vehicle-detail">
  <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
  
  <img src="${vehicle.inv_image}" 
       alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" 
       class="vehicle-img">
  <div class="vehicle-detail-text">
  <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
    <p><strong>Price:</strong>
      ${Number(vehicle.inv_price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  })}
    </p>
    <p><strong>Description:</strong> ${vehicle.inv_description}</p>
    <p><strong>Color:</strong> ${vehicle.inv_color}</p>
    <p><strong>Miles:</strong> ${vehicle.inv_miles.toLocaleString("es-US")}</p>
  </div>
</section>
  `;
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }

        req.session.accountData = accountData
        req.session.loggedin = true
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (req.session.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

// Build the classification select list
function buildClassificationList(classifications) {
  let list = '<select name="classification_id" id="classification_id">'
  list += '<option value="">Choose a Classification</option>'
  classifications.forEach((classification) => {
    list += `<option value="${classification.classification_id}">
               ${classification.classification_name}
             </option>`
  })
  list += '</select>'
  return list
}

// Middleware to add session data to res.locals
function addSessionToLocals(req, res, next) {
  res.locals.loggedin = req.session.loggedin || false
  res.locals.accountData = req.session.accountData || null
  next()
}

/* ****************************************
 * Middleware verify account type
 * ************************************ */
function checkAccountType(req, res, next) {
  const accountData = req.session.accountData

  if (!accountData) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  if (req.session.accountData.account_type === "Employee" || req.session.accountData.account_type === "Admin") {
    next()
  } else {
    req.flash("notice", "You do not have permission to access this area.")
    return res.redirect("/account/myaccount")
  }
}

module.exports = {
  getNav, handleErrors, buildVehicleDetailHTML, buildClassificationList,
  checkJWTToken: Util.checkJWTToken, checkLogin: Util.checkLogin, addSessionToLocals,
  checkAccountType
}