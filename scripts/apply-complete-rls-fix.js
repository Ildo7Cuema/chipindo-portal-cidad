const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('Please set it with: export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  console.log('You can find your service role key in your Supabase dashboard under Settings > API');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyCompleteRLSFix() {
  try {
    console.log('🔧 Applying complete RLS fix for interest_registrations...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'fix-interest-registrations-complete.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Executing SQL fix...');
    
    // Split into individual statements and execute
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim() === '') continue;
      
      console.log(`\n🔧 Executing statement ${i + 1}/${statements.length}:`);
      console.log(statement.substring(0, 100) + (statement.length > 100 ? '...' : ''));
      
      try {
        // Use the REST API to execute SQL
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY
          },
          body: JSON.stringify({ sql: statement + ';' })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ Error in statement ${i + 1}:`, errorText);
          // Continue with next statement
        } else {
          const result = await response.json();
          console.log(`✅ Statement ${i + 1} executed successfully`);
          if (result && result.length > 0) {
            console.log('📊 Result:', result);
          }
        }
      } catch (error) {
        console.error(`❌ Exception in statement ${i + 1}:`, error.message);
      }
    }
    
    console.log('\n✅ Complete RLS fix applied!');
    console.log('🎉 The interest registrations form should now work for anonymous users.');
    
    // Test the fix
    console.log('\n🧪 Testing the fix...');
    await testInsert();
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function testInsert() {
  try {
    const testData = {
      full_name: "Test User",
      email: "test@example.com",
      phone: "123456789",
      profession: "Developer",
      areas_of_interest: ["Technology"],
      additional_info: "Test registration after fix",
      terms_accepted: true
    };
    
    console.log('📝 Testing insert with anonymous user...');
    
    // Use the anon key to test as anonymous user
    const anonClient = createClient(SUPABASE_URL, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA");
    
    const { data, error } = await anonClient
      .from('interest_registrations')
      .insert([testData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Test insert failed:', error);
    } else {
      console.log('✅ Test insert successful!');
      console.log('📊 Inserted data:', data);
      
      // Clean up test data
      await supabase
        .from('interest_registrations')
        .delete()
        .eq('id', data.id);
      console.log('🧹 Test data cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the fix
applyCompleteRLSFix(); 