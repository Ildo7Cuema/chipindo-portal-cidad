import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyAdminMigrations() {
  console.log('🚀 Aplicando migrações para gestão administrativa...\n');

  try {
    // 1. Verificar se a tabela municipality_characterization existe
    console.log('📋 Verificando tabela municipality_characterization...');
    const { data: characterizationData, error: characterizationError } = await supabase
      .from('municipality_characterization')
      .select('*')
      .limit(1);

    if (characterizationError) {
      console.log('⚠️  Tabela municipality_characterization não encontrada');
      console.log('   Execute primeiro: npm run apply-municipality-characterization-migration');
    } else {
      console.log('✅ Tabela municipality_characterization encontrada');
      console.log(`   Registros: ${characterizationData?.length || 0}`);
    }

    // 2. Verificar se a tabela events existe
    console.log('\n📋 Verificando tabela events...');
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(1);

    if (eventsError) {
      console.log('⚠️  Tabela events não encontrada');
      console.log('   Criando tabela events...');
      
      // Criar tabela events se não existir
      const { error: createEventsError } = await supabase.rpc('create_events_table');
      
      if (createEventsError) {
        console.log('❌ Erro ao criar tabela events:', createEventsError.message);
      } else {
        console.log('✅ Tabela events criada com sucesso');
      }
    } else {
      console.log('✅ Tabela events encontrada');
      console.log(`   Registros: ${eventsData?.length || 0}`);
    }

    // 3. Verificar se a tabela system_settings existe
    console.log('\n📋 Verificando tabela system_settings...');
    const { data: settingsData, error: settingsError } = await supabase
      .from('system_settings')
      .select('*')
      .limit(1);

    if (settingsError) {
      console.log('⚠️  Tabela system_settings não encontrada');
      console.log('   Execute primeiro: npm run apply-system-settings-migration');
    } else {
      console.log('✅ Tabela system_settings encontrada');
      console.log(`   Registros: ${settingsData?.length || 0}`);
    }

    // 4. Verificar se a tabela population_history existe
    console.log('\n📋 Verificando tabela population_history...');
    const { data: populationData, error: populationError } = await supabase
      .from('population_history')
      .select('*')
      .limit(1);

    if (populationError) {
      console.log('⚠️  Tabela population_history não encontrada');
      console.log('   Execute primeiro: npm run apply-population-growth-migration');
    } else {
      console.log('✅ Tabela population_history encontrada');
      console.log(`   Registros: ${populationData?.length || 0}`);
    }

    // 5. Testar funcionalidades administrativas
    console.log('\n🧪 Testando funcionalidades administrativas...');

    // Testar RPC functions
    const rpcFunctions = [
      'get_municipality_characterization',
      'update_municipality_characterization',
      'get_system_setting',
      'update_system_setting',
      'calculate_population_growth_rate',
      'get_current_population_growth_rate'
    ];

    for (const func of rpcFunctions) {
      try {
        const { error } = await supabase.rpc(func);
        if (error) {
          console.log(`⚠️  Função ${func}: ${error.message}`);
        } else {
          console.log(`✅ Função ${func}: Disponível`);
        }
      } catch (err) {
        console.log(`❌ Função ${func}: Não disponível`);
      }
    }

    // 6. Verificar permissões de administrador
    console.log('\n🔐 Verificando permissões...');
    
    // Verificar se existe pelo menos um usuário administrador
    const { data: adminUsers, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('role', 'admin');

    if (adminError) {
      console.log('⚠️  Não foi possível verificar usuários administradores');
    } else {
      console.log(`✅ Usuários administradores: ${adminUsers?.length || 0}`);
    }

    // 7. Resumo final
    console.log('\n📊 Resumo da Gestão Administrativa:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const status = {
      'Caracterização do Município': !characterizationError,
      'Gestão de Eventos': !eventsError,
      'Configurações do Sistema': !settingsError,
      'Histórico Populacional': !populationError,
      'Funções RPC': rpcFunctions.length > 0,
      'Usuários Administradores': (adminUsers?.length || 0) > 0
    };

    Object.entries(status).forEach(([feature, available]) => {
      const icon = available ? '✅' : '❌';
      console.log(`${icon} ${feature}`);
    });

    console.log('\n🎯 Próximos Passos:');
    console.log('1. Acesse a área administrativa em /admin');
    console.log('2. Verifique as permissões do seu usuário');
    console.log('3. Teste as funcionalidades de gestão');
    console.log('4. Configure dados iniciais se necessário');

    console.log('\n✅ Migrações administrativas concluídas!');

  } catch (error) {
    console.error('❌ Erro durante a aplicação das migrações:', error);
    process.exit(1);
  }
}

// Executar migrações
applyAdminMigrations(); 