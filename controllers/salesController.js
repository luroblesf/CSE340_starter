const SalesModel = require('../models/salesModel');
const utilities = require('../utilities');
const pool = require("../database/database"); 

async function getUserSales(req, res, next) {
    try {
        const accountData = req.session.accountData;
        if (!accountData || !accountData.account_id) {
            req.flash("notice", "You must be logged in to view purchases.");
            return res.redirect("/account/login");
        }

        const accountId = accountData.account_id;

        const result = await pool.query(
            `SELECT s.sale_id, s.sale_date, s.sale_price, s.payment_method, s.notes,
              i.inv_make, i.inv_model, c.classification_name
       FROM sales s
       JOIN inventory i ON s.inventory_id = i.inv_id
       JOIN classification c ON s.classification_id = c.classification_id
       WHERE s.account_id = $1
       ORDER BY s.sale_date DESC`,
            [accountId]
        );

        console.log("Sales result for account:", accountId, result.rows);

        const nav = await utilities.getNav();

        res.render("sales/userSales", {
            title: "My Purchases",
            nav,
            sales: result.rows,
            messages: [].concat(req.flash("notice"))
        });
    } catch (error) {
        console.error("Error fetching user sales:", error);
        next(error);
    }
}

async function createSale(req, res, next) {
    try {
        const accountId = req.session.accountData.account_id;
        const { inventory_id, classification_id, sale_date, sale_price, payment_method, notes } = req.body;

        await pool.query(
            `INSERT INTO sales 
        (account_id, inventory_id, classification_id, sale_date, sale_price, payment_method, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [accountId, inventory_id, classification_id, sale_date, sale_price, payment_method, notes]
        );

        req.flash("notice", "Your purchase has been submitted. We will contact you in a few minutes.");
        res.redirect("/account/management");
    } catch (error) {
        console.error("Error creating sale:", error);
        next(error);
    }
}

async function listAllSales(req, res, next) {
    try {
        const nav = await utilities.getNav();

        const result = await pool.query(
            `SELECT s.sale_id, s.sale_date, s.sale_price, s.payment_method,
              a.account_firstname, a.account_lastname,
              i.inv_make, i.inv_model, c.classification_name, s.notes
       FROM sales s
       JOIN account a ON s.account_id = a.account_id
       JOIN inventory i ON s.inventory_id = i.inv_id
       JOIN classification c ON s.classification_id = c.classification_id
       ORDER BY s.sale_date DESC`
        );

        res.render("sales/adminSales", {
            title: "All Sales",
            nav,
            errors: null,
            messages: [].concat(req.flash("notice")),
            sales: result.rows
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { getUserSales, createSale, listAllSales };
