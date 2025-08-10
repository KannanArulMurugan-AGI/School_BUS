-- Schema for the School Bus Project tenant registry

CREATE TABLE tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  admin_email TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- e.g., 'admin', 'driver', 'parent'
  identifier TEXT NOT NULL, -- e.g., email for parent, driver's license for driver
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, identifier)
);

-- Indexes for faster lookups
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
