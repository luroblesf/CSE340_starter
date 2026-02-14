const pool = require("../database/database")

// All the categories
async function getCategories() {
    const result = await pool.query(
        "SELECT classification_id, classification_name FROM classification ORDER BY classification_name"
    )
    return result.rows
}

// Get vehicle by category
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

// Get vehicle by ID
async function getVehicleById(invId) {
    const result = await pool.query(
        "SELECT * FROM inventory WHERE inv_id = $1",
        [invId]
    )
    return result.rows[0]
}

//  Add new classification
async function addClassification(classification_name) {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const result = await pool.query(sql, [classification_name])
    return result.rows[0] 
}

//  Add new vehicle
async function addVehicle(vehicle) {
    const sql = `
    INSERT INTO inventory 
    (classification_id, inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *;
  `
    const data = [
        vehicle.classification_id,
        vehicle.inv_make,
        vehicle.inv_model,
        vehicle.inv_year,
        vehicle.inv_price,
        vehicle.inv_miles,
        vehicle.inv_color,
        vehicle.inv_description,
        vehicle.inv_image,
        vehicle.inv_thumbnail
    ]
    const result = await pool.query(sql, data)
    return result.rows[0]
}

// Get vehicle with Classification
async function getVehiclesWithClassification() {
    const sql = `
    SELECT 
      i.inv_id,
      i.inv_make,
      i.inv_model,
      i.inv_year,
      i.inv_price,
      i.inv_miles,
      i.inv_color,
      i.inv_description,
      i.inv_image,
      i.inv_thumbnail,
      c.classification_name
    FROM inventory i
    JOIN classification c
      ON i.classification_id = c.classification_id
    ORDER BY i.inv_id DESC;
  `
    const result = await pool.query(sql)
    return result.rows
}

async function getVehiclesByCategoryId(categoryId) {
    const sql = `
    SELECT i.*, c.classification_name
    FROM inventory i
    JOIN classification c ON i.classification_id = c.classification_id
    WHERE c.classification_id = $1
  `
    const result = await pool.query(sql, [categoryId])
    return result.rows
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateVehicle(vehicle) {
    const sql = `
    UPDATE inventory
    SET classification_id = $2,
        inv_make = $3,
        inv_model = $4,
        inv_year = $5,
        inv_description = $6,
        inv_image = $7,
        inv_thumbnail = $8,
        inv_price = $9,
        inv_miles = $10,
        inv_color = $11
    WHERE inv_id = $1
    RETURNING *
  `
    const data = await pool.query(sql, [
        vehicle.inv_id,
        vehicle.classification_id,
        vehicle.inv_make,
        vehicle.inv_model,
        vehicle.inv_year,
        vehicle.inv_description,
        vehicle.inv_image,
        vehicle.inv_thumbnail,
        vehicle.inv_price,
        vehicle.inv_miles,
        vehicle.inv_color
    ])
    return data.rows[0]
}

async function deleteInventoryItem(inv_id) {
    try {
        const sql = "DELETE FROM inventory WHERE inv_id = $1";
        const data = await pool.query(sql, [inv_id]);
        return data.rowCount; 
    } catch (error) {
        throw new Error("Delete Inventory Error: " + error.message);
    }
}

// Check if vehicle is in sales
async function isVehicleInSales(inventory_id) {
    const sql = "SELECT 1 FROM sales WHERE inventory_id = $1 LIMIT 1";
    const result = await pool.query(sql, [inventory_id]);
    return result.rowCount > 0; 
}


module.exports = {
    getCategories, getVehiclesByCategory, getVehicleById, addClassification,
    addVehicle, getVehiclesWithClassification, getVehiclesByCategoryId, updateVehicle,
    deleteInventoryItem, isVehicleInSales
}