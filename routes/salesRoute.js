const express = require("express");
const router = new express.Router();
const salesController = require("../controllers/salesController");
const utilities = require("../utilities");
const pool = require("../database/database");

router.get(
    "/user",
    utilities.checkLogin, 
    utilities.handleErrors(salesController.getUserSales)
);

router.post(
    "/create",
    utilities.checkLogin, 
    utilities.handleErrors(salesController.createSale) 
);

router.get(
    "/admin",
    utilities.checkLogin,
    utilities.handleErrors(salesController.listAllSales)
);

router.get("/purchase", utilities.checkLogin, async (req, res, next) => {
    try {
        const nav = await utilities.getNav();

        const result = await pool.query(
            `SELECT inv_id, inv_make, inv_model, inv_price, classification_id
       FROM inventory
       ORDER BY inv_make, inv_model`
        );

        res.render("sales/purchase", {
            title: "Make a Purchase",
            nav,
            messages: [].concat(req.flash("notice")),
            inventory: result.rows 
        });
    } catch (error) {
        console.error("Error loading purchase page:", error);
        next(error);
    }
});

router.get("/userSales", utilities.checkLogin, salesController.getUserSales);

module.exports = router;