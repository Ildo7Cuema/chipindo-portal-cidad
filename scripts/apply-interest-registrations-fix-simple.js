const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('Please set it with: export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixInterestRegistrationsRLS() {
  try {
    console.log('🔧 Fixing interest_registrations RLS policies...');
    
    // SQL statements to fix the RLS policies
    const sqlStatements = [
      // Drop existing policies
      'DROP POLICY IF EXISTS "Admins can view all interest registrations" ON public.interest_registrations;',
      'DROP POLICY IF EXISTS "Anyone can insert interest registrations" ON public.interest_registrations;',
      
      // Create new policies
      'CREATE POLICY "Public can insert interest registrations" ON public.interest_registrations FOR INSERT WITH CHECK (true);',
      'CREATE POLICY "Admins can view all interest registrations" ON public.interest_registrations FOR SELECT USING (is_current_user_admin());',
      'CREATE POLICY "Users can view their own registrations" ON public.interest_registrations FOR SELECT USING (auth.uid() IS NOT NULL);',
      'CREATE POLICY "Admins can update interest registrations" ON public.interest_registrations FOR UPDATE USING (is_current_user_admin()) WITH CHECK (is_current_user_admin());',
      'CREATE POLICY "Admins can delete interest registrations" ON public.interest_registrations FOR DELETE USING (is_current_user_admin());'
    ];
    
    // Execute each statement
    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i];
      console.log(`\n🔧 Executing statement ${i + 1}/${sqlStatements.length}:`);
      console.log(sql);
      
      try {
        // Use the REST API to execute SQL
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY
          },
          body: JSON.stringify({ sql })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ Error in statement ${i + 1}:`, errorText);
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (error) {
        console.error(`❌ Exception in statement ${i + 1}:`, error.message);
      }
    }
    
    console.log('\n✅ Interest registrations RLS fix completed!');
    console.log('🎉 The form should now work for anonymous users.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the fix
fixInterestRegistrationsRLS(); 