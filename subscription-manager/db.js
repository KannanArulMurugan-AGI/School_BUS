/**
 * @fileoverview This module handles all database interactions for the
 * Subscription Manager service, using the 'pg' library to connect to a
 * PostgreSQL database.
 * @module db
 * @see {@link https://node-postgres.com/} for more information about the 'pg' library.
 */

const { Pool } = require('pg');

// The 'pg' library automatically reads environment variables for connection details.
const pool = new Pool();

/**
 * Executes a query against the database. This is a thin wrapper around `pool.query`.
 * @param {string} text - The SQL query text.
 * @param {Array} [params=[]] - The parameters for the query.
 * @returns {Promise<object>} The query result object from the 'pg' library.
 */
const query = (text, params) => pool.query(text, params);

/**
 * Creates a new tenant in the database.
 * @param {object} tenantData - The data for the new tenant.
 * @param {string} tenantData.name - The name of the school/tenant.
 * @param {string} tenantData.adminEmail - The email of the tenant's administrator.
 * @param {string} tenantData.plan - The subscription plan.
 * @returns {Promise<object>} The newly created tenant object from the database.
 * @throws {Error} If the database query fails.
 */
const createTenant = async ({ name, adminEmail, plan }) => {
  const id = `tenant-${Date.now()}`; // Generate a unique ID
  const status = 'active';

  const sql = `
    INSERT INTO tenants (id, name, admin_email, plan, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const params = [id, name, adminEmail, plan, status];

  try {
    const result = await query(sql, params);
    console.log(`[DB] Created tenant: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
    return result.rows[0];
  } catch (error) {
    console.error(`[DB] Error creating tenant: ${error.message}`);
    throw error;
  }
};

module.exports = {
  query,
  createTenant,
};
