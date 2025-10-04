-- Fix 406 error in event_registrations table
-- The issue is that the current RLS policy only allows viewing confirmed registrations
-- but the code needs to check for existing registrations regardless of status

-- Remove restrictive policy
DROP POLICY IF EXISTS "Public can view confirmed registrations" ON event_registrations;

-- Create more permissive policy that allows checking existing registrations
CREATE POLICY "Public can check registrations" ON event_registrations
    FOR SELECT USING (true);

-- Ensure other policies exist
DROP POLICY IF EXISTS "Public can register for events" ON event_registrations;
CREATE POLICY "Public can register for events" ON event_registrations
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin has full access to registrations" ON event_registrations;
CREATE POLICY "Admin has full access to registrations" ON event_registrations
    FOR ALL USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'admin' OR
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- Ensure RLS is enabled
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON event_registrations TO anon, authenticated;
GRANT USAGE ON SEQUENCE event_registrations_id_seq TO anon, authenticated; 