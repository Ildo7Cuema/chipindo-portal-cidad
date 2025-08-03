-- Script para corrigir o trigger de admin_notifications
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Remover o trigger antigo
DROP TRIGGER IF EXISTS notify_admin_service_request_trigger ON service_requests;

-- 2. Remover a função antiga
DROP FUNCTION IF EXISTS notify_admin_service_request();

-- 3. Criar a função corrigida (sem a coluna priority)
CREATE OR REPLACE FUNCTION notify_admin_service_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for admin (sem a coluna priority)
  INSERT INTO admin_notifications (
    title,
    message,
    type,
    data
  ) VALUES (
    'Nova Solicitação de Serviço',
    'Nova solicitação recebida para: ' || NEW.service_name,
    'service_request',
    jsonb_build_object(
      'request_id', NEW.id,
      'service_name', NEW.service_name,
      'requester_name', NEW.requester_name,
      'requester_email', NEW.requester_email,
      'subject', NEW.subject,
      'priority', NEW.priority
    )
  );
  
  -- Mark notification as sent
  UPDATE service_requests 
  SET notification_sent = TRUE, notification_sent_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Recriar o trigger
CREATE TRIGGER notify_admin_service_request_trigger
  AFTER INSERT ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_service_request();

-- 5. Verificar se a correção funcionou
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'notify_admin_service_request_trigger'; 