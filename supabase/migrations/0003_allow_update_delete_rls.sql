-- 0003_allow_update_delete_rls.sql
-- Resilient fix for silent failures on UPDATE and DELETE operations

DROP POLICY IF EXISTS branch_update_policy ON branches;
DROP POLICY IF EXISTS branch_delete_policy ON branches;
DROP POLICY IF EXISTS profile_update_policy ON profiles;
DROP POLICY IF EXISTS profile_delete_policy ON profiles;
DROP POLICY IF EXISTS tenant_update_policy ON tenants;
DROP POLICY IF EXISTS tenant_delete_policy ON tenants;
DROP POLICY IF EXISTS customer_all_policy ON customers;
DROP POLICY IF EXISTS repair_all_policy ON repairs;
DROP POLICY IF EXISTS sales_all_policy ON sales;
DROP POLICY IF EXISTS sales_items_all_policy ON sales_items;
DROP POLICY IF EXISTS contracts_all_policy ON contracts;
DROP POLICY IF EXISTS installments_all_policy ON installments;
DROP POLICY IF EXISTS bills_all_policy ON bills;
DROP POLICY IF EXISTS vendor_bills_all_policy ON vendor_bills;

-- Branches
CREATE POLICY branch_update_policy ON branches FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY branch_delete_policy ON branches FOR DELETE USING (true);

-- Profiles
CREATE POLICY profile_update_policy ON profiles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY profile_delete_policy ON profiles FOR DELETE USING (true);

-- Tenants
CREATE POLICY tenant_update_policy ON tenants FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY tenant_delete_policy ON tenants FOR DELETE USING (true);

-- Open access for other relational tables since they were missing from 0002
CREATE POLICY customer_all_policy ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY repair_all_policy ON repairs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY sales_all_policy ON sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY sales_items_all_policy ON sales_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY contracts_all_policy ON contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY installments_all_policy ON installments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY bills_all_policy ON bills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY vendor_bills_all_policy ON vendor_bills FOR ALL USING (true) WITH CHECK (true);
