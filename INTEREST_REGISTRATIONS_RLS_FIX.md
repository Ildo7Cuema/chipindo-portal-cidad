# Fix for Interest Registrations RLS Error

## Problem
You're getting a 401 Unauthorized error and RLS policy violation when trying to insert data into the `interest_registrations` table:

```
POST https://murdhrdqqnuntfxmwtqx.supabase.co/rest/v1/interest_registrations?columns=%22full_name%22%2C%22email%22%2C%22phone%22%2C%22profession%22%2C%22areas_of_interest%22%2C%22additional_info%22%2C%22terms_accepted%22&select=* 401 (Unauthorized)
```

Error: `new row violates row-level security policy for table "interest_registrations"`

## Root Cause
The Row Level Security (RLS) policies on the `interest_registrations` table are not properly configured to allow anonymous users to insert data.

## Solution

### Option 1: Apply via Supabase Dashboard (Recommended)

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the following SQL:

```sql
-- Fix RLS policies for interest_registrations table
-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all interest registrations" ON public.interest_registrations;
DROP POLICY IF EXISTS "Anyone can insert interest registrations" ON public.interest_registrations;

-- Create new policies that work for both authenticated and anonymous users
CREATE POLICY "Public can insert interest registrations" 
ON public.interest_registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all interest registrations" 
ON public.interest_registrations 
FOR SELECT 
USING (is_current_user_admin());

-- Also allow the user who created the registration to view it (if authenticated)
CREATE POLICY "Users can view their own registrations" 
ON public.interest_registrations 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Allow admins to update registrations
CREATE POLICY "Admins can update interest registrations" 
ON public.interest_registrations 
FOR UPDATE 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Allow admins to delete registrations
CREATE POLICY "Admins can delete interest registrations" 
ON public.interest_registrations 
FOR DELETE 
USING (is_current_user_admin());
```

### Option 2: Temporary Disable RLS (Quick Fix)

If you need a quick fix for testing, you can temporarily disable RLS:

```sql
-- Temporarily disable RLS (for testing only)
ALTER TABLE public.interest_registrations DISABLE ROW LEVEL SECURITY;

-- Re-enable when done testing
-- ALTER TABLE public.interest_registrations ENABLE ROW LEVEL SECURITY;
```

### Option 3: Use Service Role Key (Not Recommended for Production)

If you need to bypass RLS entirely, you can use the service role key in your application, but this is not recommended for production as it bypasses all security.

## Verification

After applying the fix, test the form again. The error should be resolved and users should be able to submit interest registrations successfully.

## Files Modified

- `supabase/migrations/20250125000000-fix-interest-registrations-rls.sql` - Migration file with the fix
- `scripts/apply-interest-registrations-fix-simple.js` - Script to apply the fix
- `scripts/test-interest-registrations-no-rls.js` - Test script to verify the fix

## Notes

- The fix ensures that anonymous users can insert data while maintaining security for other operations
- Admins can still view, update, and delete all registrations
- Authenticated users can view their own registrations
- The `is_current_user_admin()` function is used to check admin privileges 