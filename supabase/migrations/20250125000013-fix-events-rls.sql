-- Fix events table RLS policies
-- Remove existing restrictive policies
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Authenticated users can manage events" ON events;

-- Create new permissive policies for development
CREATE POLICY "Enable read access for all users" ON events
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON events
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON events
    FOR DELETE USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON events TO anon, authenticated;
GRANT USAGE ON SEQUENCE events_id_seq TO anon, authenticated; 