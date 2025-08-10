// This file mocks the database connection and queries.
// In a real application, you would use the 'pg' library to connect to a PostgreSQL database.

const mockTenants = [];
const mockUsers = [];

/**
 * Mocks creating a new tenant in the database.
 * @param {string} name - The name of the school/tenant.
 * @param {string} adminEmail - The email of the tenant's administrator.
 * @param {string} plan - The subscription plan.
 * @returns {object} The newly created tenant object.
 */
const createTenant = async ({ name, adminEmail, plan }) => {
  console.log(`[DB MOCK] Creating tenant: ${name}`);
  const newTenant = {
    id: `tenant-${Date.now()}`,
    name,
    admin_email: adminEmail,
    plan,
    status: 'active',
    created_at: new Date().toISOString(),
  };
  mockTenants.push(newTenant);
  return newTenant;
};

module.exports = {
  createTenant,
};
