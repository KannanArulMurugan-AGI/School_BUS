-- School Bus Tracking System - PostgreSQL Schema
-- Version 1.1

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- tenants table
-- Stores information about each tenant (e.g., a school or district)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) NOT NULL UNIQUE,
    plan VARCHAR(50) NOT NULL, -- e.g., 'basic', 'premium'
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- e.g., 'active', 'inactive', 'trial'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- users table
-- Stores user information for all tenants, linked by tenant_id
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- e.g., 'admin', 'driver', 'parent'
    identifier VARCHAR(255) NOT NULL, -- e.g., email for parent, driver's license for driver
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, identifier)
);

-- Indexes for faster lookups
CREATE INDEX idx_users_tenant_id ON users(tenant_id);

-- Trigger to update 'updated_at' timestamp on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
