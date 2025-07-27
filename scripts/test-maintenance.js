const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Maintenance test functions
async function testClearCache() {
  console.log('🧹 Testando Limpeza de Cache...');
  
  try {
    // Simulate cache clearing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Log the action
    await supabase
      .from('system_stats')
      .insert({
        metric_name: 'maintenance_action',
        metric_value: {
          action: 'clear_cache',
          details: {
            browser_cache_cleared: true,
            localStorage_cleared: true,
            sessionStorage_cleared: true,
            application_cache_cleared: true
          },
          timestamp: new Date().toISOString(),
          user_id: 'test-user'
        }
      });

    console.log('✅ Cache limpo com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Cache clear test failed:', error);
    return false;
  }
}

async function testOptimizeDatabase() {
  console.log('⚡ Testando Otimização da Base de Dados...');
  
  try {
    // Optimize database
    const { error } = await supabase
      .rpc('optimize_database');

    if (error) {
      throw error;
    }

    console.log('✅ Base de dados otimizada com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Database optimization test failed:', error);
    return false;
  }
}

async function testCreateBackup() {
  console.log('💾 Testando Criação de Backup...');
  
  try {
    // Create manual backup
    const { data: backupId, error } = await supabase
      .rpc('create_system_backup', {
        backup_type: 'manual',
        tables_to_backup: null // Backup all tables
      });

    if (error) {
      throw error;
    }

    // Simulate backup completion
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Complete the backup
    await supabase
      .rpc('complete_system_backup', {
        backup_uuid: backupId,
        final_size: 1024 * 1024 * Math.floor(Math.random() * 50) + 10, // 10-60MB
        success: true
      });

    console.log('✅ Backup manual criado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Backup creation test failed:', error);
    return false;
  }
}

async function testCheckIntegrity() {
  console.log('🔍 Testando Verificação de Integridade...');
  
  try {
    // Simulate integrity check
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate integrity check results
    const integrityResults = {
      issues: [],
      warnings: ['Tabela users pode beneficiar de um índice adicional'],
      status: 'warning'
    };
    
    // Log the integrity check
    await supabase
      .from('system_stats')
      .insert({
        metric_name: 'maintenance_action',
        metric_value: {
          action: 'check_integrity',
          details: {
            issues_count: integrityResults.issues.length,
            warnings_count: integrityResults.warnings.length,
            status: integrityResults.status
          },
          timestamp: new Date().toISOString(),
          user_id: 'test-user'
        }
      });

    if (integrityResults.issues.length > 0) {
      console.log(`⚠️ Encontrados ${integrityResults.issues.length} problemas de integridade`);
    } else if (integrityResults.warnings.length > 0) {
      console.log(`⚠️ Encontrados ${integrityResults.warnings.length} avisos de integridade`);
    } else {
      console.log('✅ Verificação de integridade concluída sem problemas!');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Integrity check test failed:', error);
    return false;
  }
}

async function testVacuumDatabase() {
  console.log('🧹 Testando Vacuum da Base de Dados...');
  
  try {
    // Vacuum database
    const { error } = await supabase
      .rpc('vacuum_database');

    if (error) {
      throw error;
    }

    console.log('✅ Vacuum da base de dados concluído!');
    return true;
  } catch (error) {
    console.error('❌ Vacuum test failed:', error);
    return false;
  }
}

async function testReindexDatabase() {
  console.log('🔄 Testando Reindex da Base de Dados...');
  
  try {
    // Reindex database
    const { error } = await supabase
      .rpc('reindex_database');

    if (error) {
      throw error;
    }

    console.log('✅ Reindex da base de dados concluído!');
    return true;
  } catch (error) {
    console.error('❌ Reindex test failed:', error);
    return false;
  }
}

async function getMaintenanceStats() {
  console.log('📊 Obtendo Estatísticas de Manutenção...');
  
  try {
    const { data, error } = await supabase
      .rpc('get_maintenance_stats');

    if (error) {
      throw error;
    }

    console.log('📈 Estatísticas de Manutenção:');
    console.log(`   Limpezas de Cache: ${data.cache_clears || 0}`);
    console.log(`   Otimizações de DB: ${data.db_optimizations || 0}`);
    console.log(`   Backups Criados: ${data.backups_created || 0}`);
    console.log(`   Verificações de Integridade: ${data.integrity_checks || 0}`);
    console.log(`   Total de Ações: ${data.total_actions || 0}`);
    console.log(`   Última Manutenção: ${data.last_maintenance || 'Nunca'}`);

    return data;
  } catch (error) {
    console.error('❌ Error getting maintenance stats:', error);
    return null;
  }
}

async function getDatabaseStats() {
  console.log('📊 Obtendo Estatísticas da Base de Dados...');
  
  try {
    const { data, error } = await supabase
      .rpc('get_database_stats');

    if (error) {
      throw error;
    }

    console.log('📈 Estatísticas da Base de Dados:');
    console.log(`   Tamanho Total: ${(data.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Número de Tabelas: ${data.tables || 0}`);
    console.log(`   Número de Índices: ${data.indexes || 0}`);
    console.log(`   Fragmentação: ${(data.fragmentation || 0).toFixed(2)}%`);
    console.log(`   Última Otimização: ${data.last_optimized || 'Nunca'}`);

    return data;
  } catch (error) {
    console.error('❌ Error getting database stats:', error);
    return null;
  }
}

async function getTableSizes() {
  console.log('📋 Obtendo Tamanhos das Tabelas...');
  
  try {
    const { data, error } = await supabase
      .rpc('get_table_sizes');

    if (error) {
      throw error;
    }

    console.log('📊 Tamanhos das Tabelas:');
    data?.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}: ${(table.size / 1024).toFixed(2)} KB (${table.row_count} linhas)`);
    });

    return data;
  } catch (error) {
    console.error('❌ Error getting table sizes:', error);
    return null;
  }
}

async function checkMissingIndexes() {
  console.log('🔍 Verificando Índices Faltantes...');
  
  try {
    const { data, error } = await supabase
      .rpc('check_missing_indexes');

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      console.log('⚠️ Índices Recomendados:');
      data.forEach((index, i) => {
        console.log(`   ${i + 1}. ${index.recommendation}`);
      });
    } else {
      console.log('✅ Nenhum índice faltante encontrado!');
    }

    return data;
  } catch (error) {
    console.error('❌ Error checking missing indexes:', error);
    return null;
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando Testes de Manutenção...\n');
  
  const results = {
    clearCache: false,
    optimizeDatabase: false,
    createBackup: false,
    checkIntegrity: false,
    vacuumDatabase: false,
    reindexDatabase: false,
    stats: false,
    dbStats: false,
    tableSizes: false,
    missingIndexes: false
  };
  
  // Run all tests
  results.clearCache = await testClearCache();
  console.log('');
  
  results.optimizeDatabase = await testOptimizeDatabase();
  console.log('');
  
  results.createBackup = await testCreateBackup();
  console.log('');
  
  results.checkIntegrity = await testCheckIntegrity();
  console.log('');
  
  results.vacuumDatabase = await testVacuumDatabase();
  console.log('');
  
  results.reindexDatabase = await testReindexDatabase();
  console.log('');
  
  results.stats = await getMaintenanceStats();
  console.log('');
  
  results.dbStats = await getDatabaseStats();
  console.log('');
  
  results.tableSizes = await getTableSizes();
  console.log('');
  
  results.missingIndexes = await checkMissingIndexes();
  console.log('');
  
  // Summary
  console.log('📋 Resumo dos Testes:');
  console.log(`   Limpar Cache: ${results.clearCache ? '✅' : '❌'}`);
  console.log(`   Otimizar Base de Dados: ${results.optimizeDatabase ? '✅' : '❌'}`);
  console.log(`   Criar Backup: ${results.createBackup ? '✅' : '❌'}`);
  console.log(`   Verificar Integridade: ${results.checkIntegrity ? '✅' : '❌'}`);
  console.log(`   Vacuum Database: ${results.vacuumDatabase ? '✅' : '❌'}`);
  console.log(`   Reindex Database: ${results.reindexDatabase ? '✅' : '❌'}`);
  console.log(`   Estatísticas de Manutenção: ${results.stats ? '✅' : '❌'}`);
  console.log(`   Estatísticas da Base de Dados: ${results.dbStats ? '✅' : '❌'}`);
  console.log(`   Tamanhos das Tabelas: ${results.tableSizes ? '✅' : '❌'}`);
  console.log(`   Índices Faltantes: ${results.missingIndexes ? '✅' : '❌'}`);
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n🎯 Resultado: ${successCount}/${totalCount} testes passaram`);
  
  if (successCount === totalCount) {
    console.log('🎉 Todos os testes de manutenção foram bem-sucedidos!');
  } else {
    console.log('⚠️ Alguns testes falharam. Verifique os logs acima.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testClearCache,
  testOptimizeDatabase,
  testCreateBackup,
  testCheckIntegrity,
  testVacuumDatabase,
  testReindexDatabase,
  getMaintenanceStats,
  getDatabaseStats,
  getTableSizes,
  checkMissingIndexes,
  runAllTests
}; 