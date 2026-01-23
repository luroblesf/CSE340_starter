const pool = require("../database/database")

// get categories
async function getCategories() {
    const result = await pool.query(
        "SELECT classification_name FROM classification ORDER BY classification_name"
    )
    return result.rows
}

// get vehicles by category
async function getVehiclesByCategory(categoryName) {
    const result = await pool.query(
        `SELECT i.*, c.classification_name
     FROM inventory i
     JOIN classification c ON i.classification_id = c.classification_id
     WHERE LOWER(c.classification_name) = LOWER($1)`,
        [categoryName]
    )
    return result.rows
}

// get vehicle by ID
async function getVehicleById(invId) {
    const result = await pool.query(
        "SELECT * FROM inventory WHERE inv_id = $1",
        [invId]
    )
    return result.rows[0]
}

module.exports = { getCategories, getVehiclesByCategory, getVehicleById }