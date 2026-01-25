-- Fix contact_phone column type
-- It seems it might have been created as numeric/integer in some environments
-- We want it to be text/varchar to support formatted numbers like "+244 ..."

ALTER TABLE system_settings 
ALTER COLUMN contact_phone TYPE TEXT USING contact_phone::TEXT;
