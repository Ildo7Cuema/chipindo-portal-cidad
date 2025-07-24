-- Update the notification function to include all relevant fields
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
      'phone', NEW.phone,
      'profession', NEW.profession,
      'experience_years', NEW.experience_years,
      'areas_of_interest', NEW.areas_of_interest,
      'additional_info', NEW.additional_info
    )
  );
  RETURN NEW;
END;
$$;