const invModel = require("../models/inventory-model")

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

module.exports = { getNav, handleErrors, buildVehicleDetailHTML }