-- Script para desabilitar temporariamente o trigger problemático
-- Execute este script no SQL Editor do Supabase Dashboard

-- Desabilitar o trigger temporariamente
ALTER TABLE service_requests DISABLE TRIGGER notify_admin_service_request_trigger;

-- Verificar se foi desabilitado
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_orientation,
  action_statement,
  action_condition
FROM information_schema.triggers 
WHERE trigger_name = 'notify_admin_service_request_trigger'; 