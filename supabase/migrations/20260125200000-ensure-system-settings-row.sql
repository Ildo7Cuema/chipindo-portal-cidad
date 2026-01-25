-- Ensure we have at least one row with the correct key
DO $$
DECLARE
  count_rows INTEGER;
BEGIN
  -- Check if we have the row with the specific key
  SELECT COUNT(*) INTO count_rows FROM system_settings WHERE key = 'system_config';
  
  IF count_rows = 0 THEN
    -- Try to find ANY row to update first
    SELECT COUNT(*) INTO count_rows FROM system_settings;
    
    IF count_rows > 0 THEN
      -- Update the first existing row to have our key
      UPDATE system_settings 
      SET 
        key = 'system_config',
        value = COALESCE(value, '{}'::jsonb)
      WHERE id = (SELECT id FROM system_settings LIMIT 1);
    ELSE
      -- Insert a completely new default row
      INSERT INTO system_settings (
        key, 
        value,
        site_name,
        site_description,
        contact_email,
        contact_phone,
        maintenance_mode,
        allow_registration
      ) VALUES (
        'system_config',
        '{}'::jsonb,
        'Portal de Chipindo',
        'Portal oficial da Administração Municipal de Chipindo',
        'admin@chipindo.gov.ao',
        '+244 923 123 456',
        FALSE,
        TRUE
      );
    END IF;
  END IF;
END $$;
