const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const pool = require("../database/database") 

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
            title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
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
        const vehicles = await invModel.getVehiclesByCategory(category)

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

// Management page
async function buildManagement(req, res, next) {
    try {
        const nav = await utilities.getNav()
        const successMessages = req.flash("success")

        const success = successMessages.length
            ? [successMessages[successMessages.length - 1]]
            : []

        res.render("inventory/inventory_management", {
            title: "Vehicle Management",
            nav,
            errors: null,
            success,
            locals: {}
        })
    } catch (error) {
        next(error)
    }
}

// Build add classification
async function buildAddClassification(req, res, next) {
    try {
        const nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
            locals: {}
        })
    } catch (error) {
        next(error)
    }
}

// Process to add classification
async function addClassification(req, res, next) {
    try {
        const { classification } = req.body

        if (!classification || classification.length < 3) {
            const nav = await utilities.getNav()
            return res.status(400).render("inventory/add-classification", {
                title: "Add New Classification",
                nav,
                errors: [{ msg: "Classification must be at least 3 characters long." }],
                locals: req.body
            })
        }

        await invModel.addClassification(classification)

        req.flash("success", "Classification added successfully")
        res.redirect("/inventory")
    } catch (error) {
        next(error)
    }
}

// Get Classifications
async function getClassifications(req, res, next) {
    try {
        const sql = "SELECT * FROM classification ORDER BY classification_name"
        const result = await pool.query(sql)
        res.locals.classifications = result.rows
        next()
    } catch (error) {
        next(error)
    }
}

// Process form to add vehicle
async function addVehicle(req, res, next) {
    try {
        const {
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
            inv_miles,
            inv_color,
            inv_description, 
            inv_image,     
            inv_thumbnail
        } = req.body

        if (!classification_id || !inv_make || !inv_model || !inv_year) {
            const nav = await utilities.getNav()
            const classifications = await invModel.getCategories()
            return res.status(400).render("inventory/add-vehicle", {
                title: "Add New Vehicle",
                nav,
                classifications,
                errors: [{ msg: "All fields are required." }],
                success: [],
                locals: req.body
            })
        }

        await invModel.addVehicle({
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
            inv_miles,
            inv_color,
            inv_description,
            inv_image,
            inv_thumbnail
        })

        req.flash("success", "Vehicle added successfully")
        res.redirect("/inventory")
    } catch (error) {
        next(error)
    }
}

// Show form to add vehicle
async function buildAddVehicle(req, res, next) {
    try {
        const nav = await utilities.getNav()
        const classifications = await invModel.getCategories()

        res.render("inventory/add-vehicle", {
            title: "Add New Vehicle",
            nav,
            classifications,
            errors: null,
            success: [],   
            locals: {}
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    buildById, buildByCategory, buildManagement, buildAddClassification, addClassification,
    getClassifications, addVehicle, buildAddVehicle
}