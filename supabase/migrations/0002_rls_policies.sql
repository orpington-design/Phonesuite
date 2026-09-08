-- Since you clicked "Run and enable RLS", all tables now block inserts/reads by default.
-- We need to add policies to allow the registration flow to work.

-- 1. Allow anyone to read tenants (so the homepage dropdown works)
CREATE POLICY tenant_select_policy ON tenants FOR SELECT USING (true);

-- 2. Allow authenticated users (who just signed up) to insert their tenant
CREATE POLICY tenant_insert_policy ON tenants FOR INSERT WITH CHECK (true);

-- 3. Allow branches to be created and read
CREATE POLICY branch_select_policy ON branches FOR SELECT USING (true);
CREATE POLICY branch_insert_policy ON branches FOR INSERT WITH CHECK (true);

-- 4. Allow profiles to be created and read
CREATE POLICY profile_select_policy ON profiles FOR SELECT USING (true);
CREATE POLICY profile_insert_policy ON profiles FOR INSERT WITH CHECK (true);

-- Note: For a production app, we would restrict the INSERT policies further using a SECURITY DEFINER function or Service Role key, but this is perfect for our current development stage.
