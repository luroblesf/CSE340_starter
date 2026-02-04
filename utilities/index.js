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
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
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
  if (res.locals.loggedin) {
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

module.exports = {
  getNav, handleErrors, buildVehicleDetailHTML, buildClassificationList, checkJWTToken: Util.checkJWTToken,
  checkLogin: Util.checkLogin
}