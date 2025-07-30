import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  console.log('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSetoresDatabase() {
  console.log('🚀 Configurando banco de dados dos Setores Estratégicos...\n');

  try {
    // 1. Ler e executar migração de criação das tabelas
    console.log('📋 Criando tabelas...');
    const createTablesSQL = fs.readFileSync(
      path.join(process.cwd(), 'supabase/migrations/20250125000001-create-setores-estrategicos.sql'),
      'utf8'
    );

    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
    
    if (createError) {
      console.log('⚠️  Tabelas podem já existir ou erro na criação:', createError.message);
    } else {
      console.log('✅ Tabelas criadas com sucesso!');
    }

    // 2. Ler e executar migração de inserção de dados
    console.log('\n📊 Inserindo dados iniciais...');
    const insertDataSQL = fs.readFileSync(
      path.join(process.cwd(), 'supabase/migrations/20250125000002-insert-setores-data.sql'),
      'utf8'
    );

    const { error: insertError } = await supabase.rpc('exec_sql', { sql: insertDataSQL });
    
    if (insertError) {
      console.log('⚠️  Dados podem já existir ou erro na inserção:', insertError.message);
    } else {
      console.log('✅ Dados inseridos com sucesso!');
    }

    // 3. Verificar se os dados foram inseridos
    console.log('\n🔍 Verificando dados inseridos...');
    const { data: setores, error: checkError } = await supabase
      .from('setores_estrategicos')
      .select('*')
      .eq('ativo', true)
      .order('ordem');

    if (checkError) {
      console.error('❌ Erro ao verificar dados:', checkError.message);
    } else {
      console.log(`✅ ${setores?.length || 0} setores encontrados no banco de dados`);
      
      if (setores && setores.length > 0) {
        console.log('\n📋 Setores configurados:');
        setores.forEach((setor, index) => {
          console.log(`${index + 1}. ${setor.nome} (${setor.slug})`);
        });
      }
    }

    console.log('\n🎉 Configuração do banco de dados concluída!');
    console.log('\n📝 Próximos passos:');
    console.log('1. Acesse: http://localhost:8082/admin');
    console.log('2. Faça login na área administrativa');
    console.log('3. Vá para "Setores Estratégicos" no menu lateral');
    console.log('4. Gerencie os setores com dados persistentes no banco!');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error);
    console.log('\n💡 Alternativa: Execute as migrações manualmente no Supabase Dashboard');
    console.log('1. Acesse o Supabase Dashboard');
    console.log('2. Vá para SQL Editor');
    console.log('3. Execute os arquivos SQL das migrações');
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupSetoresDatabase();
}

export { setupSetoresDatabase }; 