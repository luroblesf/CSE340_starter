const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route for inventory by ID
router.get("/detail/:invId", invController.buildById)

// Route for classification by category
router.get("/:category", invController.buildByCategory)


module.exports = router