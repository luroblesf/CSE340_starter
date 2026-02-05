const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/") 

// Route for management
router.get("/", invController.buildManagement)

// Show form to add classification
router.get("/add-classification", invController.buildAddClassification)

// Process form for classification
router.post("/add-classification", invController.addClassification)

// Route for inventory by ID
router.get("/detail/:invId", invController.buildById)

// Show form to add vehicle
router.get("/add-vehicle", invController.buildAddVehicle)

// Process form for vehicle
router.post("/add-vehicle", invController.addVehicle)

// Route for classification by category 
router.get("/:category", invController.buildByCategory)

// New route: get inventory items by classification (JSON)
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON))

// Show form to edit vehicle (Edit Inventory)
router.get("/edit/:inv_id", invController.editInventoryView)

// Process form to update vehicle
router.post("/update", invController.updateInventory)
// Show form to delete vehicle
router.get("/delete/:inv_id", invController.buildDeleteInventory)
// Process form to delete vehicle
router.get("/delete/:inv_id", invController.deleteInventory);
// Delete vehicle
router.post("/delete", invController.deleteInventory);

module.exports = router