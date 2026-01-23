// controllers/invController.js
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

// Detail by vehicle ID
async function buildById(req, res, next) {
    try {
        const invId = req.params.invId
        const vehicleData = await invModel.getVehicleById(invId)

        if (!vehicleData) {
            return res.status(404).send("Vehicle not found")
        }

        const nav = await utilities.getNav()
        const vehicleHTML = utilities.buildVehicleDetailHTML(vehicleData)

        res.render("inventory/detail", {
            title: `${vehicleData.make} ${vehicleData.model}`,
            nav,
            vehicleHTML
        })
    } catch (error) {
        next(error)
    }
}

// Classification by category
async function buildByCategory(req, res, next) {
    try {
        const category = req.params.category
        console.log("Category param:", category) // 👀
        const vehicles = await invModel.getVehiclesByCategory(category)
        console.log("Vehicles found:", vehicles) // 👀

        if (!vehicles || vehicles.length === 0) {
            const nav = await utilities.getNav()
            return res.status(404).render("errors/404", {
                title: "Not Found",
                nav,
                message: `No vehicles found in category: ${category}`
            })
        }

        const nav = await utilities.getNav()
        res.render("inventory/classification", {
            title: `${category} Vehicles`,
            nav,
            vehicles
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { buildById, buildByCategory }