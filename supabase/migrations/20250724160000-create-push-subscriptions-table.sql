-- Create push_subscriptions table
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for push_subscriptions
CREATE POLICY "Users can manage their own push subscriptions" 
ON public.push_subscriptions 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all push subscriptions" 
ON public.push_subscriptions 
FOR SELECT 
USING (is_current_user_admin());

-- Create trigger to update timestamps
CREATE TRIGGER update_push_subscriptions_updated_at
BEFORE UPDATE ON public.push_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to send push notifications
CREATE OR REPLACE FUNCTION public.send_push_notification(
  title TEXT,
  body TEXT,
  icon TEXT DEFAULT NULL,
  badge TEXT DEFAULT NULL,
  tag TEXT DEFAULT NULL,
  data JSONB DEFAULT '{}',
  actions JSONB DEFAULT '[]',
  require_interaction BOOLEAN DEFAULT FALSE,
  silent BOOLEAN DEFAULT FALSE,
  vibrate INTEGER[] DEFAULT NULL,
  sound TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function would be called by the application to send push notifications
  -- The actual sending would be handled by the application layer
  -- This is just a placeholder for the database function
  
  -- Log the notification attempt
  INSERT INTO public.system_stats (metric_name, metric_value)
  VALUES (
    'push_notification_sent',
    jsonb_build_object(
      'title', title,
      'body', body,
      'timestamp', now(),
      'user_id', auth.uid()
    )
  );
  
  RETURN TRUE;
END;
$$;

-- Create function to get push subscriptions for a user
CREATE OR REPLACE FUNCTION public.get_user_push_subscriptions(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  subscription JSONB,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ps.id,
    ps.subscription,
    ps.created_at
  FROM public.push_subscriptions ps
  WHERE ps.user_id = user_uuid;
END;
$$;

-- Create function to delete expired push subscriptions
CREATE OR REPLACE FUNCTION public.cleanup_expired_push_subscriptions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete subscriptions older than 30 days
  DELETE FROM public.push_subscriptions 
  WHERE created_at < now() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the cleanup
  INSERT INTO public.system_stats (metric_name, metric_value)
  VALUES (
    'push_subscriptions_cleanup',
    jsonb_build_object(
      'deleted_count', deleted_count,
      'timestamp', now()
    )
  );
  
  RETURN deleted_count;
END;
$$; 