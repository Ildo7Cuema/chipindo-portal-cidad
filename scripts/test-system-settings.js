// Test script for system settings functionality
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSystemSettings() {
  console.log('🧪 Testing System Settings...\n');

  try {
    // Test 1: Fetch system stats
    console.log('1. Testing get_system_stats function...');
    const { data: stats, error: statsError } = await supabase
      .rpc('get_system_stats');

    if (statsError) {
      console.error('❌ Error fetching stats:', statsError);
    } else {
      console.log('✅ Stats fetched successfully:');
      console.log('   - Total Users:', stats.total_users);
      console.log('   - Active Users:', stats.active_users);
      console.log('   - Database Size:', stats.database_size?.toFixed(2), 'GB');
      console.log('   - Total News:', stats.total_news);
      console.log('   - Published News:', stats.published_news);
      console.log('   - Total Concursos:', stats.total_concursos);
      console.log('   - Published Concursos:', stats.published_concursos);
      console.log('   - Total Notifications:', stats.total_notifications);
      console.log('   - Unread Notifications:', stats.unread_notifications);
    }

    // Test 2: Fetch system settings
    console.log('\n2. Testing system_settings table...');
    const { data: settings, error: settingsError } = await supabase
      .from('system_settings')
      .select('key, value, description, category')
      .order('key');

    if (settingsError) {
      console.error('❌ Error fetching settings:', settingsError);
    } else {
      console.log('✅ Settings fetched successfully:');
      console.log('   - Total Settings:', settings.length);
      settings.forEach(setting => {
        console.log(`   - ${setting.key}: ${setting.value} (${setting.category})`);
      });
    }

    // Test 3: Update a setting
    console.log('\n3. Testing update_system_setting function...');
    const { data: updateResult, error: updateError } = await supabase
      .rpc('update_system_setting', {
        setting_key: 'site_name',
        setting_value: '"Portal de Chipindo - Test"'
      });

    if (updateError) {
      console.error('❌ Error updating setting:', updateError);
    } else {
      console.log('✅ Setting updated successfully');
    }

    // Test 4: Get specific setting
    console.log('\n4. Testing get_system_setting function...');
    const { data: specificSetting, error: getError } = await supabase
      .rpc('get_system_setting', {
        setting_key: 'site_name'
      });

    if (getError) {
      console.error('❌ Error getting specific setting:', getError);
    } else {
      console.log('✅ Specific setting fetched:', specificSetting);
    }

    // Test 5: Insert system stats
    console.log('\n5. Testing system_stats table...');
    const { data: statsInsert, error: statsInsertError } = await supabase
      .from('system_stats')
      .insert({
        metric_name: 'test_metric',
        metric_value: { 
          timestamp: new Date().toISOString(),
          test: true 
        }
      })
      .select();

    if (statsInsertError) {
      console.error('❌ Error inserting stats:', statsInsertError);
    } else {
      console.log('✅ Stats inserted successfully');
    }

    // Test 6: Fetch all stats
    console.log('\n6. Testing system_stats table fetch...');
    const { data: allStats, error: allStatsError } = await supabase
      .from('system_stats')
      .select('metric_name, metric_value, recorded_at')
      .order('recorded_at', { ascending: false })
      .limit(5);

    if (allStatsError) {
      console.error('❌ Error fetching all stats:', allStatsError);
    } else {
      console.log('✅ All stats fetched successfully:');
      console.log('   - Total Stats Records:', allStats.length);
      allStats.forEach(stat => {
        console.log(`   - ${stat.metric_name}: ${JSON.stringify(stat.metric_value)}`);
      });
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSystemSettings(); 