-- Update the existing user to be admin using text type since enum doesn't exist yet
UPDATE public.profiles 
SET role = 'admin'
WHERE user_id = '6504ed04-8b1f-4436-a166-00fe47282271';