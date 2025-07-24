-- Create table for interest registrations
CREATE TABLE public.interest_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  profession TEXT,
  experience_years INTEGER,
  areas_of_interest TEXT[] NOT NULL,
  additional_info TEXT,
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.interest_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all interest registrations" 
ON public.interest_registrations 
FOR SELECT 
USING (is_current_user_admin());

CREATE POLICY "Anyone can insert interest registrations" 
ON public.interest_registrations 
FOR INSERT 
WITH CHECK (true);

-- Create table for admin notifications
CREATE TABLE public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'interest_registration', 'new_user', 'news_published', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for notifications
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Admins can manage notifications" 
ON public.admin_notifications 
FOR ALL 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Create trigger to update timestamps
CREATE TRIGGER update_interest_registrations_updated_at
BEFORE UPDATE ON public.interest_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_notifications_updated_at
BEFORE UPDATE ON public.admin_notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to create notification when interest is registered
CREATE OR REPLACE FUNCTION public.create_interest_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_notifications (
    type,
    title,
    message,
    data
  ) VALUES (
    'interest_registration',
    'Novo Registo de Interesse',
    'Nova pessoa registou interesse: ' || NEW.full_name,
    jsonb_build_object(
      'registration_id', NEW.id,
      'full_name', NEW.full_name,
      'email', NEW.email,
      'areas_of_interest', NEW.areas_of_interest
    )
  );
  RETURN NEW;
END;
$$;

-- Create trigger for notifications
CREATE TRIGGER create_interest_notification_trigger
AFTER INSERT ON public.interest_registrations
FOR EACH ROW
EXECUTE FUNCTION public.create_interest_notification();