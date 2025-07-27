const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Test backup functions
async function testBackupFunctions() {
  console.log('🧪 Testando funções de backup...\n');
  
  try {
    // Test 1: Check if create_system_backup function exists
    console.log('1. Verificando se a função create_system_backup existe...');
    
    const { data: functions, error: funcError } = await supabase
      .from('information_schema.routines')
      .select('routine_name')
      .eq('routine_schema', 'public')
      .eq('routine_name', 'create_system_backup');
    
    if (funcError) {
      console.error('❌ Erro ao verificar funções:', funcError);
      return false;
    }
    
    if (functions && functions.length > 0) {
      console.log('✅ Função create_system_backup encontrada!');
    } else {
      console.log('❌ Função create_system_backup não encontrada');
      return false;
    }
    
    // Test 2: Check if system_backups table exists
    console.log('\n2. Verificando se a tabela system_backups existe...');
    
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'system_backups');
    
    if (tableError) {
      console.error('❌ Erro ao verificar tabelas:', tableError);
      return false;
    }
    
    if (tables && tables.length > 0) {
      console.log('✅ Tabela system_backups encontrada!');
    } else {
      console.log('❌ Tabela system_backups não encontrada');
      return false;
    }
    
    // Test 3: Try to create a backup
    console.log('\n3. Testando criação de backup...');
    
    try {
      const { data: backupId, error: backupError } = await supabase
        .rpc('create_system_backup', {
          backup_type: 'test',
          tables_to_backup: null
        });
      
      if (backupError) {
        console.error('❌ Erro ao criar backup:', backupError);
        return false;
      }
      
      if (backupId) {
        console.log('✅ Backup criado com sucesso! ID:', backupId);
        
        // Test 4: Complete the backup
        console.log('\n4. Testando conclusão de backup...');
        
        const { error: completeError } = await supabase
          .rpc('complete_system_backup', {
            backup_uuid: backupId,
            final_size: 1024 * 1024, // 1MB
            success: true
          });
        
        if (completeError) {
          console.error('❌ Erro ao completar backup:', completeError);
          return false;
        } else {
          console.log('✅ Backup completado com sucesso!');
        }
        
        // Test 5: Get backup stats
        console.log('\n5. Testando estatísticas de backup...');
        
        const { data: stats, error: statsError } = await supabase
          .rpc('get_backup_stats');
        
        if (statsError) {
          console.error('❌ Erro ao obter estatísticas:', statsError);
          return false;
        } else {
          console.log('✅ Estatísticas obtidas com sucesso!');
          console.log('   Total de backups:', stats.total_backups);
          console.log('   Backups bem-sucedidos:', stats.successful_backups);
          console.log('   Tamanho total:', stats.total_size);
        }
        
      } else {
        console.log('❌ Backup ID não retornado');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Erro ao testar backup:', error);
      return false;
    }
    
    console.log('\n🎉 Todos os testes de backup passaram com sucesso!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro geral nos testes:', error);
    return false;
  }
}

// Test maintenance functions
async function testMaintenanceFunctions() {
  console.log('\n🔧 Testando funções de manutenção...\n');
  
  try {
    // Test 1: Check if optimize_database function exists
    console.log('1. Verificando se a função optimize_database existe...');
    
    const { data: functions, error: funcError } = await supabase
      .from('information_schema.routines')
      .select('routine_name')
      .eq('routine_schema', 'public')
      .eq('routine_name', 'optimize_database');
    
    if (funcError) {
      console.error('❌ Erro ao verificar funções:', funcError);
      return false;
    }
    
    if (functions && functions.length > 0) {
      console.log('✅ Função optimize_database encontrada!');
    } else {
      console.log('❌ Função optimize_database não encontrada');
      return false;
    }
    
    // Test 2: Check if vacuum_database function exists
    console.log('\n2. Verificando se a função vacuum_database existe...');
    
    const { data: vacuumFuncs, error: vacuumError } = await supabase
      .from('information_schema.routines')
      .select('routine_name')
      .eq('routine_schema', 'public')
      .eq('routine_name', 'vacuum_database');
    
    if (vacuumError) {
      console.error('❌ Erro ao verificar funções:', vacuumError);
      return false;
    }
    
    if (vacuumFuncs && vacuumFuncs.length > 0) {
      console.log('✅ Função vacuum_database encontrada!');
    } else {
      console.log('❌ Função vacuum_database não encontrada');
      return false;
    }
    
    // Test 3: Check if reindex_database function exists
    console.log('\n3. Verificando se a função reindex_database existe...');
    
    const { data: reindexFuncs, error: reindexError } = await supabase
      .from('information_schema.routines')
      .select('routine_name')
      .eq('routine_schema', 'public')
      .eq('routine_name', 'reindex_database');
    
    if (reindexError) {
      console.error('❌ Erro ao verificar funções:', reindexError);
      return false;
    }
    
    if (reindexFuncs && reindexFuncs.length > 0) {
      console.log('✅ Função reindex_database encontrada!');
    } else {
      console.log('❌ Função reindex_database não encontrada');
      return false;
    }
    
    console.log('\n🎉 Todas as funções de manutenção estão disponíveis!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro geral nos testes:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Iniciando testes de funções...\n');
  
  const backupSuccess = await testBackupFunctions();
  const maintenanceSuccess = await testMaintenanceFunctions();
  
  console.log('\n📋 Resumo dos Testes:');
  console.log(`   Funções de Backup: ${backupSuccess ? '✅' : '❌'}`);
  console.log(`   Funções de Manutenção: ${maintenanceSuccess ? '✅' : '❌'}`);
  
  if (backupSuccess && maintenanceSuccess) {
    console.log('\n🎉 Todos os testes passaram! As funções estão funcionando corretamente.');
  } else {
    console.log('\n⚠️ Alguns testes falharam. Verifique os logs acima.');
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testBackupFunctions,
  testMaintenanceFunctions
}; 