-- Initial Schema for PhoneSuite

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    stripe_connect_id VARCHAR(255),
    square_access_token VARCHAR(255),
    square_location_id VARCHAR(255),
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    role VARCHAR(50) CHECK (role IN ('tenant_admin', 'branch_manager', 'staff', 'customer')) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    dob DATE, -- used for e-signature verification
    commission_rate NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    credit_score INT DEFAULT 100 CHECK (credit_score BETWEEN 0 AND 1000),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    buy_price NUMERIC(12,2) NOT NULL,
    sell_price NUMERIC(12,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 5,
    commission_override NUMERIC(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(tenant_id, branch_id, sku)
);

CREATE TABLE repairs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT NOT NULL,
    device_type VARCHAR(50) CHECK (device_type IN ('phone', 'tablet', 'laptop', 'smartwatch', 'audio', 'hairdryer', 'other')) NOT NULL,
    device_model VARCHAR(255) NOT NULL,
    device_serial VARCHAR(255),
    issue_description TEXT NOT NULL,
    diagnostic_notes TEXT,
    status VARCHAR(50) CHECK (status IN ('received', 'diagnosing', 'waiting_parts', 'repairing', 'ready', 'picked_up', 'cancelled')) DEFAULT 'received' NOT NULL,
    estimated_cost NUMERIC(12,2),
    final_cost NUMERIC(12,2),
    assigned_staff_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'card', 'rto_installments', 'portal_stripe', 'portal_square')) NOT NULL,
    payment_status VARCHAR(50) CHECK (payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE sales_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE NOT NULL,
    inventory_id UUID REFERENCES inventory(id) ON DELETE RESTRICT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL,
    commission_earned NUMERIC(12,2) DEFAULT 0.00 NOT NULL
);

CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT NOT NULL,
    sale_id UUID REFERENCES sales(id) ON DELETE RESTRICT NOT NULL,
    upfront_amount NUMERIC(12,2) NOT NULL,
    financed_amount NUMERIC(12,2) NOT NULL,
    interest_rate NUMERIC(5,2) NOT NULL,
    frequency VARCHAR(50) CHECK (frequency IN ('weekly', 'monthly', 'quarterly')) NOT NULL,
    total_installments INT NOT NULL,
    installment_amount NUMERIC(12,2) NOT NULL,
    agreement_text TEXT NOT NULL,
    verification_code VARCHAR(6) NOT NULL,
    verification_sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    signature_svg TEXT,
    signature_ip VARCHAR(100),
    signature_user_agent TEXT,
    signature_verified_dob DATE,
    signature_date TIMESTAMP WITH TIME ZONE,
    contract_hash VARCHAR(64),
    status VARCHAR(50) CHECK (status IN ('draft', 'verification_sent', 'signed', 'active', 'completed', 'defaulted', 'collections')) DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    due_date DATE NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('pending', 'paid', 'overdue')) DEFAULT 'pending' NOT NULL,
    payment_intent_id VARCHAR(255),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT NOT NULL,
    sale_id UUID REFERENCES sales(id),
    repair_id UUID REFERENCES repairs(id),
    amount NUMERIC(12,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) CHECK (status IN ('pending', 'paid', 'overdue')) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE vendor_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) CHECK (status IN ('pending', 'paid')) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Settings
CREATE OR REPLACE FUNCTION get_auth_tenant_id()
RETURNS UUID AS $$
    SELECT tenant_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON inventory
    FOR ALL
    USING (tenant_id = get_auth_tenant_id())
    WITH CHECK (tenant_id = get_auth_tenant_id());
