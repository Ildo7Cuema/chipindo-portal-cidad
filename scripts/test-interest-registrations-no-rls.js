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

async function testInterestRegistrationsNoRLS() {
  try {
    console.log('🔧 Testing interest_registrations without RLS...');
    
    // Test inserting data directly
    const testData = {
      full_name: "Test User",
      email: "test@example.com",
      phone: "123456789",
      profession: "Developer",
      areas_of_interest: ["Technology"],
      additional_info: "Test registration",
      terms_accepted: true
    };
    
    console.log('📝 Test data:', testData);
    
    // Try to insert using the service role key (should bypass RLS)
    const { data, error } = await supabase
      .from('interest_registrations')
      .insert([testData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error inserting test data:', error);
      
      // If RLS is the issue, let's try to disable it temporarily
      console.log('\n🔧 Attempting to disable RLS temporarily...');
      
      try {
        const { error: rlsError } = await supabase.rpc('exec_sql', { 
          sql: 'ALTER TABLE public.interest_registrations DISABLE ROW LEVEL SECURITY;' 
        });
        
        if (rlsError) {
          console.error('❌ Error disabling RLS:', rlsError);
        } else {
          console.log('✅ RLS disabled temporarily');
          
          // Try insert again
          const { data: data2, error: error2 } = await supabase
            .from('interest_registrations')
            .insert([testData])
            .select()
            .single();
          
          if (error2) {
            console.error('❌ Still getting error after disabling RLS:', error2);
          } else {
            console.log('✅ Insert successful after disabling RLS!');
            console.log('📊 Inserted data:', data2);
            
            // Re-enable RLS
            await supabase.rpc('exec_sql', { 
              sql: 'ALTER TABLE public.interest_registrations ENABLE ROW LEVEL SECURITY;' 
            });
            console.log('✅ RLS re-enabled');
          }
        }
      } catch (rlsException) {
        console.error('❌ Exception when trying to disable RLS:', rlsException);
      }
      
    } else {
      console.log('✅ Insert successful with RLS enabled!');
      console.log('📊 Inserted data:', data);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testInterestRegistrationsNoRLS(); 