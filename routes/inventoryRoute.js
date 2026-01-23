// routes/inventoryRoute.js
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route for inventory by ID
router.get("/detail/:invId", invController.buildById)

// Route for classification by category
// This captures /inventory/sedan, /inventory/suv, /inventory/truck, etc.
router.get("/:category", invController.buildByCategory)

module.exports = router