-- Fix events table RLS policies with correct ordering
-- This migration must run AFTER the events table is created

-- Remove existing restrictive policies if they exist
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Authenticated users can manage events" ON events;
DROP POLICY IF EXISTS "Enable read access for all users" ON events;
DROP POLICY IF EXISTS "Enable insert access for all users" ON events;
DROP POLICY IF EXISTS "Enable update access for all users" ON events;
DROP POLICY IF EXISTS "Enable delete access for all users" ON events;

-- Create new permissive policies
-- These policies allow full CRUD operations for all users during development
-- In production, these should be restricted to admin/content_manager roles

CREATE POLICY "events_select_policy" ON events
    FOR SELECT USING (true);

CREATE POLICY "events_insert_policy" ON events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "events_update_policy" ON events
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "events_delete_policy" ON events
    FOR DELETE USING (true);

-- Grant necessary permissions to both anon and authenticated roles
GRANT SELECT, INSERT, UPDATE, DELETE ON events TO anon, authenticated;
GRANT USAGE ON SEQUENCE events_id_seq TO anon, authenticated;
