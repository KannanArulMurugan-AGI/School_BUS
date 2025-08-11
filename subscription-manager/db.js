const { Pool } = require('pg');
// Using a timestamp for the ID is not ideal, but avoids a new dependency
// given the current environment issues.

// The 'pg' library automatically reads environment variables for connection details.
// - PGUSER: The user to connect as
// - PGHOST: The database host
// - PGPASSWORD: The password for the user
// - PGDATABASE: The database to connect to
// - PGPORT: The port to connect on
const pool = new Pool();

/**
 * Executes a query against the database.
 * @param {string} text - The SQL query text.
 * @param {Array} params - The parameters for the query.
 * @returns {Promise<object>} The query result.
 */
const query = (text, params) => pool.query(text, params);

/**
 * Creates a new tenant in the database.
 * @param {object} tenantData - The data for the new tenant.
 * @param {string} tenantData.name - The name of the school/tenant.
 * @param {string} tenantData.adminEmail - The email of the tenant's administrator.
 * @param {string} tenantData.plan - The subscription plan.
 * @returns {Promise<object>} The newly created tenant object.
 */
const createTenant = async ({ name, adminEmail, plan }) => {
  const sql = `
    INSERT INTO tenants (name, admin_email, plan)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const params = [name, adminEmail, plan];

  try {
    const result = await query(sql, params);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[DB] Created tenant: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
    }
    return result.rows[0];
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`[DB] Error creating tenant: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Creates a new user in the database.
 * @param {object} userData - The data for the new user.
 * @param {string} userData.tenant_id - The ID of the tenant the user belongs to.
 * @param {string} userData.role - The user's role (e.g., 'admin').
 * @param {string} userData.identifier - The user's identifier (e.g., email).
 * @returns {Promise<object>} The newly created user object.
 */
const createUser = async ({ tenant_id, role, identifier }) => {
  const sql = `
    INSERT INTO users (tenant_id, role, identifier)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const params = [tenant_id, role, identifier];
  try {
    const result = await query(sql, params);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[DB] Created user: ${result.rows[0].identifier} (ID: ${result.rows[0].id})`);
    }
    return result.rows[0];
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`[DB] Error creating user: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Finds a user by their ID.
 * @param {string} id - The UUID of the user to find.
 * @returns {Promise<object|undefined>} The user object, or undefined if not found.
 */
const findUserById = async (id) => {
  const sql = 'SELECT * FROM users WHERE id = $1;';
  try {
    const result = await query(sql, [id]);
    return result.rows[0]; // Returns the user or undefined if not found
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`[DB] Error finding user by ID: ${error.message}`);
    }
    throw error;
  }
};

module.exports = {
  query,
  createTenant,
  createUser,
  findUserById,
};
