-- PHONESUITE COMPLETE DATABASE MIGRATION SCRIPT
-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. Create Tenants & Branches
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    stripe_connect_id VARCHAR(255),
    square_access_token VARCHAR(255),
    square_location_id VARCHAR(255),
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Profiles (Extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    role VARCHAR(50) CHECK (role IN ('tenant_admin', 'branch_manager', 'staff', 'customer')) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    title VARCHAR(50),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    mobile VARCHAR(50),
    whatsapp VARCHAR(50),
    dob DATE,
    avatar_url TEXT,
    addresses JSONB DEFAULT '[]'::jsonb,
    commission_rate NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Customers
CREATE TABLE IF NOT EXISTS customers (
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

-- 4. Inventory
CREATE TABLE IF NOT EXISTS inventory (
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

-- 5. Repairs
CREATE TABLE IF NOT EXISTS repairs (
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

-- 6. Sales & Sale Items
CREATE TABLE IF NOT EXISTS sales (
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

CREATE TABLE IF NOT EXISTS sales_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE NOT NULL,
    inventory_id UUID REFERENCES inventory(id) ON DELETE RESTRICT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL,
    commission_earned NUMERIC(12,2) DEFAULT 0.00 NOT NULL
);

-- 7. Rent-to-Own Contracts & Installments
CREATE TABLE IF NOT EXISTS contracts (
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

CREATE TABLE IF NOT EXISTS installments (
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

-- 8. Receivables & Payables
CREATE TABLE IF NOT EXISTS bills (
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

CREATE TABLE IF NOT EXISTS vendor_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) CHECK (status IN ('pending', 'paid')) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_bills ENABLE ROW LEVEL SECURITY;

-- Helper to check active tenant ID for logged-in profile
CREATE OR REPLACE FUNCTION get_auth_tenant_id()
RETURNS UUID AS $$
    SELECT tenant_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. Tenants Access Policies
CREATE POLICY tenant_read_all ON tenants
    FOR SELECT USING (TRUE); -- Allow signups and connection lookups

-- 2. Branches Isolation Policies
CREATE POLICY branch_tenant_policy ON branches
    FOR ALL USING (tenant_id = get_auth_tenant_id()) WITH CHECK (tenant_id = get_auth_tenant_id());

-- 3. Profiles Isolation Policies
CREATE POLICY profile_tenant_policy ON profiles
    FOR ALL USING (tenant_id = get_auth_tenant_id()) WITH CHECK (tenant_id = get_auth_tenant_id());

-- 4. Customers Isolation Policies
CREATE POLICY customer_tenant_policy ON customers
    FOR ALL USING (tenant_id = get_auth_tenant_id()) WITH CHECK (tenant_id = get_auth_tenant_id());

-- 5. Inventory Isolation Policies
CREATE POLICY inventory_tenant_policy ON inventory
    FOR ALL USING (tenant_id = get_auth_tenant_id()) WITH CHECK (tenant_id = get_auth_tenant_id());

-- 6. Repairs Isolation Policies
CREATE POLICY repair_tenant_policy ON repairs
    FOR ALL USING (tenant_id = get_auth_tenant_id()) WITH CHECK (tenant_id = get_auth_tenant_id());

CREATE POLICY repair_customer_portal_policy ON repairs
    FOR SELECT USING (
        customer_id IN (
            SELECT id FROM customers WHERE profile_id = auth.uid()
        )
    );

-- 7. Sales & Items Isolation Policies
CREATE POLICY sales_tenant_policy ON sales
    FOR ALL USING (tenant_id = get_auth_tenant_id()) WITH CHECK (tenant_id = get_auth_tenant_id());

CREATE POLICY sales_items_tenant_policy ON sales_items
    FOR ALL USING (
        sale_id IN (SELECT id FROM sales WHERE tenant_id = get_auth_tenant_id())
    );

-- 8. Contracts & Installments Isolation Policies
CREATE POLICY contracts_tenant_policy ON contracts
    FOR ALL USING (tenant_id = get_auth_tenant_id()) WITH CHECK (tenant_id = get_auth_tenant_id());

CREATE POLICY contracts_customer_sign_policy ON contracts
    FOR SELECT USING (TRUE); -- Allow unauthenticated secure portal signature via contract ID verification

CREATE POLICY contracts_customer_portal_policy ON contracts
    FOR SELECT USING (
        customer_id IN (
            SELECT id FROM customers WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY installments_tenant_policy ON installments
    FOR ALL USING (tenant_id = get_auth_tenant_id()) WITH CHECK (tenant_id = get_auth_tenant_id());

CREATE POLICY installments_customer_portal_policy ON installments
    FOR SELECT USING (
        contract_id IN (
            SELECT id FROM contracts WHERE customer_id IN (
                SELECT id FROM customers WHERE profile_id = auth.uid()
            )
        )
    );

-- 9. Bills & Vendor Bills Isolation Policies
CREATE POLICY bills_tenant_policy ON bills
    FOR ALL USING (tenant_id = get_auth_tenant_id()) WITH CHECK (tenant_id = get_auth_tenant_id());

CREATE POLICY bills_customer_portal_policy ON bills
    FOR SELECT USING (
        customer_id IN (
            SELECT id FROM customers WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY vendor_bills_tenant_policy ON vendor_bills
    FOR ALL USING (tenant_id = get_auth_tenant_id()) WITH CHECK (tenant_id = get_auth_tenant_id());
