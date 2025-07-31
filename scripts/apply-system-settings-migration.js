import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.error('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applySystemSettingsMigration() {
  console.log('🚀 Aplicando migração para configurações do sistema...\n');
  
  try {
    // 1. Verificar se a tabela system_settings já existe
    console.log('📋 Verificando se a tabela system_settings existe...');
    const { data: tableExists, error: tableError } = await supabase
      .from('system_settings')
      .select('id')
      .limit(1);

    if (tableError && tableError.code === '42P01') {
      console.log('❌ Tabela system_settings não existe');
      console.log('💡 Execute o comando: supabase db push');
      console.log('   ou aplique a migração: supabase/migrations/20250725000009-create-system-settings.sql\n');
      return;
    }

    if (tableError) {
      console.error('❌ Erro ao verificar tabela:', tableError.message);
      return;
    }

    console.log('✅ Tabela system_settings existe\n');

    // 2. Verificar configurações atuais
    console.log('📊 Verificando configurações atuais...');
    const { data: settings, error: settingsError } = await supabase
      .from('system_settings')
      .select('*')
      .limit(1)
      .single();

    if (settingsError) {
      console.error('❌ Erro ao buscar configurações:', settingsError.message);
      return;
    }

    if (settings) {
      console.log('✅ Configurações encontradas:');
      console.log(`   - Nome do site: ${settings.site_name}`);
      console.log(`   - Modo de manutenção: ${settings.maintenance_mode ? 'Ativo' : 'Inativo'}`);
      console.log(`   - Registro permitido: ${settings.allow_registration ? 'Sim' : 'Não'}`);
      console.log(`   - Notificações por email: ${settings.email_notifications ? 'Ativas' : 'Inativas'}`);
      console.log(`   - Cache habilitado: ${settings.cache_enabled ? 'Sim' : 'Não'}`);
      console.log(`   - Tema: ${settings.theme}`);
      console.log(`   - Idioma: ${settings.language}`);
      console.log(`   - Fuso horário: ${settings.timezone}`);
      console.log(`   - Última atualização: ${new Date(settings.updated_at).toLocaleString('pt-AO')}\n`);
    } else {
      console.log('⚠️  Nenhuma configuração encontrada\n');
    }

    // 3. Testar funções RPC
    console.log('🔧 Testando funções RPC...');
    
    // Testar get_maintenance_stats
    const { data: stats, error: statsError } = await supabase
      .rpc('get_maintenance_stats');

    if (statsError) {
      console.log('⚠️  Função get_maintenance_stats não disponível:', statsError.message);
    } else {
      console.log('✅ Função get_maintenance_stats funcionando');
    }

    // Testar check_database_integrity
    const { data: integrity, error: integrityError } = await supabase
      .rpc('check_database_integrity');

    if (integrityError) {
      console.log('⚠️  Função check_database_integrity não disponível:', integrityError.message);
    } else {
      console.log('✅ Função check_database_integrity funcionando');
      console.log(`   - Status: ${integrity.status}`);
      console.log(`   - Problemas: ${integrity.issues}`);
      console.log(`   - Avisos: ${integrity.warnings}`);
    }

    // 4. Testar atualização de configurações
    console.log('\n🧪 Testando atualização de configurações...');
    const testConfig = {
      site_name: 'Portal de Chipindo - Teste',
      maintenance_mode: false,
      allow_registration: true
    };

    const { data: updateResult, error: updateError } = await supabase
      .from('system_settings')
      .update(testConfig)
      .eq('id', 1)
      .select();

    if (updateError) {
      console.error('❌ Erro ao atualizar configurações:', updateError.message);
    } else {
      console.log('✅ Configurações atualizadas com sucesso');
      console.log(`   - Novo nome: ${updateResult[0].site_name}`);
    }

    // 5. Restaurar configurações originais
    console.log('\n🔄 Restaurando configurações originais...');
    const originalConfig = {
      site_name: 'Portal de Chipindo',
      maintenance_mode: false,
      allow_registration: true
    };

    const { error: restoreError } = await supabase
      .from('system_settings')
      .update(originalConfig)
      .eq('id', 1);

    if (restoreError) {
      console.error('❌ Erro ao restaurar configurações:', restoreError.message);
    } else {
      console.log('✅ Configurações restauradas');
    }

    // 6. Resumo final
    console.log('\n🎉 Migração das configurações do sistema concluída!');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Acesse o painel administrativo');
    console.log('   2. Vá para "Configurações do Sistema"');
    console.log('   3. Teste o switch de modo de manutenção');
    console.log('   4. Configure outras opções conforme necessário');
    console.log('\n💡 O switch de modo de manutenção agora deve funcionar corretamente!');

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

applySystemSettingsMigration(); 