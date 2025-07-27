const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Appearance test functions
async function testTheme() {
  console.log('🎨 Testando Tema...');
  
  try {
    const themes = ['light', 'dark', 'auto'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    
    // Update theme setting
    const { error } = await supabase
      .rpc('update_system_setting', {
        setting_key: 'theme_mode',
        setting_value: randomTheme
      });

    if (error) {
      throw error;
    }

    // Log theme change
    await supabase
      .from('system_stats')
      .insert({
        metric_name: 'theme_change',
        metric_value: {
          mode: randomTheme,
          timestamp: new Date().toISOString(),
          user_id: 'test-user'
        }
      });

    console.log(`✅ Tema alterado para: ${randomTheme}`);
    return true;
  } catch (error) {
    console.error('❌ Theme test failed:', error);
    return false;
  }
}

async function testLanguage() {
  console.log('🌍 Testando Idioma...');
  
  try {
    const languages = ['pt', 'en', 'es', 'fr', 'zh'];
    const randomLanguage = languages[Math.floor(Math.random() * languages.length)];
    
    // Update language setting
    const { error } = await supabase
      .rpc('update_system_setting', {
        setting_key: 'language',
        setting_value: randomLanguage
      });

    if (error) {
      throw error;
    }

    // Log language change
    await supabase
      .from('system_stats')
      .insert({
        metric_name: 'language_change',
        metric_value: {
          language_code: randomLanguage,
          timestamp: new Date().toISOString(),
          user_id: 'test-user'
        }
      });

    const languageNames = {
      'pt': 'Português',
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'zh': '中文'
    };

    console.log(`✅ Idioma alterado para: ${languageNames[randomLanguage]}`);
    return true;
  } catch (error) {
    console.error('❌ Language test failed:', error);
    return false;
  }
}

async function testTimezone() {
  console.log('🕐 Testando Fuso Horário...');
  
  try {
    const timezones = [
      'Africa/Luanda',
      'UTC',
      'Europe/London',
      'America/New_York',
      'Europe/Paris',
      'Asia/Tokyo',
      'Australia/Sydney'
    ];
    const randomTimezone = timezones[Math.floor(Math.random() * timezones.length)];
    
    // Update timezone setting
    const { error } = await supabase
      .rpc('update_system_setting', {
        setting_key: 'timezone',
        setting_value: randomTimezone
      });

    if (error) {
      throw error;
    }

    // Log timezone change
    await supabase
      .from('system_stats')
      .insert({
        metric_name: 'timezone_change',
        metric_value: {
          timezone: randomTimezone,
          timestamp: new Date().toISOString(),
          user_id: 'test-user'
        }
      });

    console.log(`✅ Fuso horário alterado para: ${randomTimezone}`);
    return true;
  } catch (error) {
    console.error('❌ Timezone test failed:', error);
    return false;
  }
}

async function testDateFormat() {
  console.log('📅 Testando Formato de Data...');
  
  try {
    const dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
    const randomFormat = dateFormats[Math.floor(Math.random() * dateFormats.length)];
    
    // Update date format setting
    const { error } = await supabase
      .rpc('update_system_setting', {
        setting_key: 'date_format',
        setting_value: randomFormat
      });

    if (error) {
      throw error;
    }

    // Log date format change
    await supabase
      .from('system_stats')
      .insert({
        metric_name: 'date_format_change',
        metric_value: {
          format: randomFormat,
          timestamp: new Date().toISOString(),
          user_id: 'test-user'
        }
      });

    console.log(`✅ Formato de data alterado para: ${randomFormat}`);
    return true;
  } catch (error) {
    console.error('❌ Date format test failed:', error);
    return false;
  }
}

async function testTimeFormat() {
  console.log('⏰ Testando Formato de Hora...');
  
  try {
    const timeFormats = ['12h', '24h'];
    const randomFormat = timeFormats[Math.floor(Math.random() * timeFormats.length)];
    
    // Update time format setting
    const { error } = await supabase
      .rpc('update_system_setting', {
        setting_key: 'time_format',
        setting_value: randomFormat
      });

    if (error) {
      throw error;
    }

    // Log time format change
    await supabase
      .from('system_stats')
      .insert({
        metric_name: 'time_format_change',
        metric_value: {
          format: randomFormat,
          timestamp: new Date().toISOString(),
          user_id: 'test-user'
        }
      });

    console.log(`✅ Formato de hora alterado para: ${randomFormat}`);
    return true;
  } catch (error) {
    console.error('❌ Time format test failed:', error);
    return false;
  }
}

async function testColors() {
  console.log('🎨 Testando Cores...');
  
  try {
    const colors = [
      '#0f172a', '#1e293b', '#334155', '#475569',
      '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af',
      '#10b981', '#059669', '#047857', '#065f46',
      '#f59e0b', '#d97706', '#b45309', '#92400e'
    ];
    
    const randomPrimaryColor = colors[Math.floor(Math.random() * colors.length)];
    const randomAccentColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Update primary color
    await supabase
      .rpc('update_system_setting', {
        setting_key: 'primary_color',
        setting_value: randomPrimaryColor
      });

    // Update accent color
    await supabase
      .rpc('update_system_setting', {
        setting_key: 'accent_color',
        setting_value: randomAccentColor
      });

    console.log(`✅ Cores atualizadas - Primária: ${randomPrimaryColor}, Destaque: ${randomAccentColor}`);
    return true;
  } catch (error) {
    console.error('❌ Colors test failed:', error);
    return false;
  }
}

async function testDeviceStatus() {
  console.log('📱 Testando Status de Dispositivos...');
  
  try {
    const devices = ['desktop', 'tablet', 'mobile'];
    const randomDevice = devices[Math.floor(Math.random() * devices.length)];
    const randomActive = Math.random() > 0.5;
    
    // Log device status change
    await supabase
      .from('system_stats')
      .insert({
        metric_name: 'device_status_change',
        metric_value: {
          device_type: randomDevice,
          active: randomActive,
          timestamp: new Date().toISOString(),
          user_id: 'test-user'
        }
      });

    console.log(`✅ Status de dispositivo atualizado: ${randomDevice} - ${randomActive ? 'Ativo' : 'Inativo'}`);
    return true;
  } catch (error) {
    console.error('❌ Device status test failed:', error);
    return false;
  }
}

async function getAppearanceStats() {
  console.log('📊 Obtendo Estatísticas de Aparência...');
  
  try {
    // Get appearance settings
    const { data: settings, error: settingsError } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', ['theme_mode', 'language', 'timezone', 'date_format', 'time_format', 'primary_color', 'accent_color']);

    if (settingsError) {
      console.error('❌ Error getting settings:', settingsError);
    } else {
      console.log('⚙️ Configurações de Aparência:');
      settings?.forEach(setting => {
        console.log(`   ${setting.key}: ${setting.value}`);
      });
    }

    // Get recent appearance changes
    const { data: stats, error: statsError } = await supabase
      .from('system_stats')
      .select('metric_name, metric_value, created_at')
      .in('metric_name', ['theme_change', 'language_change', 'timezone_change', 'date_format_change', 'time_format_change'])
      .order('created_at', { ascending: false })
      .limit(10);

    if (statsError) {
      console.error('❌ Error getting stats:', statsError);
    } else {
      console.log('📈 Mudanças Recentes:');
      stats?.forEach(stat => {
        const value = stat.metric_value;
        console.log(`   ${stat.metric_name}: ${JSON.stringify(value)}`);
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Error getting appearance stats:', error);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando Testes de Aparência...\n');
  
  const results = {
    theme: false,
    language: false,
    timezone: false,
    dateFormat: false,
    timeFormat: false,
    colors: false,
    deviceStatus: false,
    stats: false
  };
  
  // Run all tests
  results.theme = await testTheme();
  console.log('');
  
  results.language = await testLanguage();
  console.log('');
  
  results.timezone = await testTimezone();
  console.log('');
  
  results.dateFormat = await testDateFormat();
  console.log('');
  
  results.timeFormat = await testTimeFormat();
  console.log('');
  
  results.colors = await testColors();
  console.log('');
  
  results.deviceStatus = await testDeviceStatus();
  console.log('');
  
  results.stats = await getAppearanceStats();
  console.log('');
  
  // Summary
  console.log('📋 Resumo dos Testes:');
  console.log(`   Tema: ${results.theme ? '✅' : '❌'}`);
  console.log(`   Idioma: ${results.language ? '✅' : '❌'}`);
  console.log(`   Fuso Horário: ${results.timezone ? '✅' : '❌'}`);
  console.log(`   Formato de Data: ${results.dateFormat ? '✅' : '❌'}`);
  console.log(`   Formato de Hora: ${results.timeFormat ? '✅' : '❌'}`);
  console.log(`   Cores: ${results.colors ? '✅' : '❌'}`);
  console.log(`   Status de Dispositivo: ${results.deviceStatus ? '✅' : '❌'}`);
  console.log(`   Estatísticas: ${results.stats ? '✅' : '❌'}`);
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n🎯 Resultado: ${successCount}/${totalCount} testes passaram`);
  
  if (successCount === totalCount) {
    console.log('🎉 Todos os testes de aparência foram bem-sucedidos!');
  } else {
    console.log('⚠️ Alguns testes falharam. Verifique os logs acima.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testTheme,
  testLanguage,
  testTimezone,
  testDateFormat,
  testTimeFormat,
  testColors,
  testDeviceStatus,
  getAppearanceStats,
  runAllTests
}; 