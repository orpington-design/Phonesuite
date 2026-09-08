-- Upgrade Customers Table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS title VARCHAR(20),
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS lat NUMERIC(10, 8),
ADD COLUMN IF NOT EXISTS lng NUMERIC(11, 8),
ADD COLUMN IF NOT EXISTS referees JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS id_documents JSONB DEFAULT '[]'::jsonb;

-- Upgrade Tenants Table for Delivery Settings
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS delivery_settings JSONB DEFAULT '{"free_delivery": false, "min_fee": 10.00, "base_miles": 3, "per_mile_rate": 1.50}'::jsonb;

-- Upgrade Sales Table for Trade-ins & Delivery
ALTER TABLE sales
ADD COLUMN IF NOT EXISTS trade_in_items JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS trade_in_total NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_distance NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS fulfillment_method VARCHAR(50) CHECK (fulfillment_method IN ('collection', 'delivery')) DEFAULT 'collection',
ADD COLUMN IF NOT EXISTS fulfillment_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS fulfillment_address TEXT,
ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2);
