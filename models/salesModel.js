const pool = require('../database/database');

class SalesModel {
    static async create({ account_id, inventory_id, classification_id, sale_date, sale_price, payment_method, notes }) {
        const sql = `
      INSERT INTO sales (account_id, inventory_id, classification_id, sale_date, sale_price, payment_method, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING sale_id
    `;
        const result = await pool.query(sql, [account_id, inventory_id, classification_id, sale_date, sale_price, payment_method, notes]);
        return result.rows[0].sale_id;
    }

    static async findAll() {
        const result = await pool.query(`SELECT * FROM sales ORDER BY sale_date DESC`);
        return result.rows;
    }

    static async findById(sale_id) {
        const result = await pool.query(`SELECT * FROM sales WHERE sale_id = $1`, [sale_id]);
        return result.rows[0];
    }

    static async findByAccount(account_id) {
        const result = await pool.query(`SELECT * FROM sales WHERE account_id = $1 ORDER BY sale_date DESC`, [account_id]);
        return result.rows;
    }
}



module.exports = SalesModel;