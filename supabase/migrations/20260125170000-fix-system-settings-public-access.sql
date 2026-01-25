-- Allow public read access to system settings
DROP POLICY IF EXISTS "Allow read access to system settings" ON system_settings;

CREATE POLICY "Allow public read access to system settings"
ON system_settings
FOR SELECT
USING (true);

-- Grant select permission to anon role explicitly
GRANT SELECT ON system_settings TO anon, authenticated;
