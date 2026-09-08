-- 0004_add_branch_geolocation.sql
-- Add latitude and longitude to branches for geolocation

ALTER TABLE branches ADD COLUMN lat NUMERIC(10, 8);
ALTER TABLE branches ADD COLUMN lng NUMERIC(11, 8);
