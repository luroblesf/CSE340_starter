const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route for management
router.get("/", invController.buildManagement)

// Show form to add classification
router.get("/add-classification", invController.buildAddClassification)

// Process form for classification
router.post("/add-classification", invController.addClassification)

// Route for inventory by ID
router.get("/detail/:invId", invController.buildById)

// Mostrar formulario para vehículo
router.get("/add-vehicle", invController.buildAddVehicle)

// Procesar formulario de vehículo
router.post("/add-vehicle", invController.addVehicle)

// Route for classification by category 
router.get("/:category", invController.buildByCategory)

module.exports = router