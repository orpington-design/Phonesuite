# MASTER SPECIFICATION DOC: PhoneSuite

PhoneSuite is a professional, multi-tenant operations, CRM, Point of Sale (POS), and repair management software specifically designed for electronics sales and repair businesses in the UK and worldwide. 

---

## 1. Core Architectural Pillars

### 1.1 Multi-Tenancy (Database Level)
- Every tenant (shop owner) is isolated from others.
- All records (customers, sales, inventory, repairs, branches, bills) are partitioned using a `tenant_id` column.
- Row-Level Security (RLS) in Supabase PostgreSQL guarantees that a tenant's staff can only query records matching their own `tenant_id`.
- Dynamic slugs resolve paths like `phonesuite.uk/[tenant-slug]/dashboard` or `phonesuite.uk/[tenant-slug]/portal`.

### 1.2 Multi-Branch Infrastructure
- Tenants can define multiple branch locations (e.g., London Central, Manchester, Bristol).
- Staff members are assigned to specific branch locations (though Tenant Admins can access all branches).
- The active branch is tracked in the user's session.
- Inventory quantities, sales, repair tickets, and financial reports are filtered or segmented by `branch_id`.

### 1.3 Partner Referral & Transaction Fee Splitting
- **Stripe Connect**: Tenants onboard via Stripe Connect Standard/Express. The connection URL uses PhoneSuite's Platform Client ID to establish a referral relationship. For every payment processed, PhoneSuite takes a platform fee (e.g., 1.5% or a flat rate) via the `application_fee_amount` parameter.
- **Square OAuth**: Tenants connect using Square's OAuth flow. Payments made via the customer portal process using the tenant's access token, passing PhoneSuite's application fee money parameter to deduct platform commission.

### 1.4 Secure E-Signature System (UK Regulatory Compliance)
- For Rent-to-Own (RTO) finance agreements, an in-app, secure email-based signature workflow is triggered:
  1. An email is dispatched using **Resend** containing a unique, secure URL and a 6-digit verification code.
  2. The customer opens the URL and must verify their identity by entering their **Date of Birth (DOB)** and the **6-digit verification code**.
  3. Once authenticated, they view the complete credit agreement and sign using an HTML5 Canvas drawing pad.
  4. The system logs the signature, time, IP address, user-agent, and DOB verification status.
  5. The system automatically appends a **Certificate of Signature** final page containing the complete audit trail and the SHA-256 hash of the contract contents.

---

## 2. Database Schema Definition

### 2.1 Tenants & Branches
```sql
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
```

### 2.2 Profiles & Staff Management
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    role VARCHAR(50) CHECK (role IN ('tenant_admin', 'branch_manager', 'staff', 'customer')) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    dob DATE, -- used for e-signature verification
    commission_rate NUMERIC(5,2) DEFAULT 0.00, -- default percentage commission
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 2.3 Inventory & Customers
```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- optional portal association
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    credit_score INT DEFAULT 100 CHECK (credit_score BETWEEN 0 AND 1000), -- internal credit score
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
    commission_override NUMERIC(12,2), -- fixed amount override if set
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(tenant_id, branch_id, sku)
);
```

### 2.4 Service Repairs & Maintenance
```sql
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
```

### 2.5 Point of Sale (POS) Sales & Commissions
```sql
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- seller
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
```

### 2.6 Rent-to-Own Contracts & Installments
```sql
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
    signature_svg TEXT, -- path strokes
    signature_ip VARCHAR(100),
    signature_user_agent TEXT,
    signature_verified_dob DATE,
    signature_date TIMESTAMP WITH TIME ZONE,
    contract_hash VARCHAR(64), -- SHA-256 of text + signature metadata
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
```

### 2.7 Receivables (Bills) & Payables (Vendor Bills)
```sql
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
```

---

## 3. Row-Level Security (RLS) Policy Blueprint

### 3.1 Security Helper Functions
A PostgreSQL function checks the tenant profile context of the executing request:
```sql
CREATE OR REPLACE FUNCTION get_auth_tenant_id()
RETURNS UUID AS $$
    SELECT tenant_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;
```

### 3.2 Global Tenant-Isolation Policies
Enable RLS for every operational table (e.g. `inventory`, `repairs`, `sales`, `bills`, `contracts`).
```sql
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON inventory
    FOR ALL
    USING (tenant_id = get_auth_tenant_id())
    WITH CHECK (tenant_id = get_auth_tenant_id());
```

### 3.3 Customer Portal Specific RLS Rules
Customers must only access their own items. For tables accessed by portal customers, write policies checking their profile role:
```sql
-- Allow customers to read their own bills
CREATE POLICY customer_bill_policy ON bills
    FOR SELECT
    USING (
        customer_id IN (
            SELECT id FROM customers WHERE profile_id = auth.uid()
        )
    );
```

---

## 4. UI/UX Style Guidelines (Vanilla CSS)

To prevent cheap design, the styling variables block in `styles/globals.css` must adhere to this system:

- **Theme Colors**:
  - `bg-base`: `#0b0f19` (Deep slate navy/black)
  - `bg-surface`: `rgba(20, 27, 45, 0.7)` (Frosted translucent surface)
  - `border-color`: `rgba(255, 255, 255, 0.08)`
  - `primary-glow`: `linear-gradient(135deg, #3b82f6, #10b981)`
  - `accent-success`: `#10b981` (Emerald green for active/paid status)
  - `accent-warn`: `#f59e0b` (Amber for pending/installments)
  - `accent-danger`: `#ef4444` (Crimson for overdue/defaulted)
  
- **Visual Effects**:
  - Glassmorphic card backdrops with `backdrop-filter: blur(16px);`.
  - Border highlight on hover using dynamic transition effects.
  - Consistent border radius of `12px` to `16px`.
  - Custom scrollbar treatments matching the dark palette.
