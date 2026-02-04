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
            vehicleHTML,
            errors: [],
            success: []
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
                message: `No vehicles found in category: ${category}`,
                errors: [],
                success: []
            })
        }

        const nav = await utilities.getNav()
        res.render("inventory/classification", {
            title: `${category} Vehicles`,
            nav,
            vehicles,
            errors: [],
            success: []
        })
    } catch (error) {
        next(error)
    }
}

// Management page
async function buildManagement(req, res, next) {
    try {
        const nav = await utilities.getNav()
        const classifications = await invModel.getCategories()
        const classificationSelect = utilities.buildClassificationList(classifications)

        const success = req.flash("success")
        const errors = req.flash("error")

        res.render("inventory/inventory_management", {
            title: "Vehicle Management",
            nav,
            classificationSelect,
            errors,
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
            errors: [],
            success: [],
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
                success: [],
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

// Process to add inventory
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
            errors: [],
            success: [],
            locals: {}
        })
    } catch (error) {
        next(error)
    }
}

// Return Inventory by Classification As JSON
async function getInventoryJSON(req, res, next) {
    try {
        const classification_id = parseInt(req.params.classification_id)
        const invData = await invModel.getVehiclesByCategoryId(classification_id)

        if (invData && invData[0] && invData[0].inv_id) {
            return res.json(invData)
        } else {
            next(new Error("No data returned"))
        }
    } catch (error) {
        next(error)
    }
}

// Build edit inventory view
async function editInventoryView(req, res, next) {
    try {
        const inv_id = parseInt(req.params.inv_id)
        let nav = await utilities.getNav()

        const itemData = await invModel.getVehicleById(inv_id)

        const classifications = await invModel.getCategories()
        const classificationSelect = await utilities.buildClassificationList(
            classifications,
            itemData.classification_id
        )

        const itemName = `${itemData.inv_make} ${itemData.inv_model}`

        const success = req.flash("success")
        const errors = req.flash("error")

        res.render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect,
            errors,
            success,
            inv_id: itemData.inv_id,
            inv_make: itemData.inv_make,
            inv_model: itemData.inv_model,
            inv_year: itemData.inv_year,
            inv_description: itemData.inv_description,
            inv_image: itemData.inv_image,
            inv_thumbnail: itemData.inv_thumbnail,
            inv_price: itemData.inv_price,
            inv_miles: itemData.inv_miles,
            inv_color: itemData.inv_color,
            classification_id: itemData.classification_id
        })
    } catch (error) {
        next(error)
    }
}

// Process update inventory
async function updateInventory(req, res, next) {
    try {
        const {
            inv_id,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        } = req.body

        if (!inv_id || !inv_make || !inv_model || !inv_year) {
            req.flash("error", "All required fields must be filled.")
            return res.redirect(`/inv/edit/${inv_id}`)
        }

        await invModel.updateVehicle({
            inv_id,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })

        req.flash("success", `Vehicle ${inv_make} ${inv_model} updated successfully`)
        res.redirect("/inventory")
    } catch (error) {
        next(error)
    }
}

module.exports = {
    buildById, buildByCategory, buildManagement, buildAddClassification, addClassification,
    getClassifications, addVehicle, buildAddVehicle, getInventoryJSON, editInventoryView,
    updateInventory
}