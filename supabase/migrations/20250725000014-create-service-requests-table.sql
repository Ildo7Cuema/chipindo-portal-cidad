-- Create service requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES servicos(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  service_direction TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_sent_at TIMESTAMP WITH TIME ZONE
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_service_requests_service_id ON service_requests(service_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_service_requests_assigned_to ON service_requests(assigned_to);

-- Enable Row Level Security
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can create service requests" ON service_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all service requests" ON service_requests
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update service requests" ON service_requests
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete service requests" ON service_requests
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_service_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_service_requests_updated_at();

-- Create function to send notification when request is created
CREATE OR REPLACE FUNCTION notify_admin_service_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for admin
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

-- Create trigger for admin notification
CREATE TRIGGER notify_admin_service_request_trigger
  AFTER INSERT ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_service_request();

-- Create view for service requests with service details
CREATE OR REPLACE VIEW service_requests_view AS
SELECT 
  sr.*,
  s.title as service_title,
  s.description as service_description,
  s.direcao as service_direction_full,
  s.categoria as service_category,
  s.contacto as service_contact,
  s.email as service_email
FROM service_requests sr
LEFT JOIN servicos s ON sr.service_id = s.id;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON service_requests TO authenticated;
GRANT SELECT ON service_requests_view TO authenticated; 