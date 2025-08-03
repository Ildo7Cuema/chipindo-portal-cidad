const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function applyInterestRegistrationsFix() {
  try {
    console.log('🔧 Applying interest_registrations RLS fix...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'fix-interest-registrations-rls.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 SQL content to execute:');
    console.log(sqlContent);
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\n🔧 Executing statement ${i + 1}/${statements.length}:`);
      console.log(statement);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error);
          // Continue with next statement
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (stmtError) {
        console.error(`❌ Exception in statement ${i + 1}:`, stmtError);
      }
    }
    
    console.log('\n✅ Interest registrations RLS fix completed!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the fix
applyInterestRegistrationsFix(); 