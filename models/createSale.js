const SalesModel = require('../models/salesModel');
const utilities = require('../utilities');

async function createSale(req, res, next) {
    try {
        const nav = await utilities.getNav();
        const accountId = req.session.accountData.account_id; 

        const { inventory_id, classification_id, sale_date, sale_price, payment_method, notes } = req.body;

        const saleId = await SalesModel.create({
            account_id: accountId,
            inventory_id,
            classification_id,
            sale_date,
            sale_price,
            payment_method,
            notes
        });

        req.flash("notice", `Purchase completed successfully. Sale ID: ${saleId}`);
        res.redirect("/sales"); 
    } catch (error) {
        next(error);
    }
}

module.exports = { createSale };