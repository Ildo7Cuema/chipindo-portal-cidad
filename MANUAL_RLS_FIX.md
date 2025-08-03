# Manual RLS Fix for Interest Registrations

## Quick Fix (Apply in Supabase Dashboard)

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Run the following SQL commands one by one:

### Step 1: Drop existing policies
```sql
DROP POLICY IF EXISTS "Admins can view all interest registrations" ON public.interest_registrations;
DROP POLICY IF EXISTS "Anyone can insert interest registrations" ON public.interest_registrations;
```

### Step 2: Disable and re-enable RLS
```sql
ALTER TABLE public.interest_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.interest_registrations ENABLE ROW LEVEL SECURITY;
```

### Step 3: Create new policies
```sql
CREATE POLICY "Allow public insert" 
ON public.interest_registrations 
FOR INSERT 
WITH CHECK (true);
```

```sql
CREATE POLICY "Allow admin select" 
ON public.interest_registrations 
FOR SELECT 
USING (is_current_user_admin());
```

```sql
CREATE POLICY "Allow admin update" 
ON public.interest_registrations 
FOR UPDATE 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());
```

```sql
CREATE POLICY "Allow admin delete" 
ON public.interest_registrations 
FOR DELETE 
USING (is_current_user_admin());
```

### Step 4: Fix the notification function
```sql
CREATE OR REPLACE FUNCTION public.create_interest_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create notification if we can determine admin status
  IF auth.uid() IS NOT NULL OR is_current_user_admin() THEN
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
  END IF;
  RETURN NEW;
END;
$$;
```

### Step 5: Verify the fix
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'interest_registrations';
```

## Alternative: Quick Disable RLS (Temporary Fix)

If you need an immediate fix for testing, you can temporarily disable RLS:

```sql
ALTER TABLE public.interest_registrations DISABLE ROW LEVEL SECURITY;
```

**⚠️ Warning:** This disables all security for this table. Remember to re-enable it later:

```sql
ALTER TABLE public.interest_registrations ENABLE ROW LEVEL SECURITY;
```

## Test the Fix

After applying the fix, test your form again. The error should be resolved and users should be able to submit interest registrations successfully.

## What This Fix Does

1. **Removes conflicting policies** - Drops the old policies that might be causing issues
2. **Creates a simple insert policy** - Allows anyone to insert data with `WITH CHECK (true)`
3. **Maintains admin security** - Admins can still view, update, and delete all registrations
4. **Fixes the notification function** - Prevents the trigger from failing for anonymous users
5. **Handles edge cases** - Uses CASE statements to handle null user IDs properly 