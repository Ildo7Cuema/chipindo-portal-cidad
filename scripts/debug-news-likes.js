// Script de debug para verificar a funcionalidade de curtidas
// Execute este script no console do navegador (F12 > Console)

console.log('🔍 Iniciando diagnóstico das curtidas...');

// 1. Verificar se o Supabase está configurado
async function testSupabaseConnection() {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Testar conexão básica
    const { data, error } = await supabase.from('news').select('id').limit(1);
    
    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error);
      return false;
    }
    
    console.log('✅ Conexão com Supabase funcionando');
    return true;
  } catch (error) {
    console.error('❌ Erro ao importar Supabase:', error);
    return false;
  }
}

// 2. Verificar se a tabela news_likes existe
async function testNewsLikesTable() {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Tentar acessar a tabela
    const { data, error } = await supabase.from('news_likes').select('*').limit(1);
    
    if (error) {
      if (error.message.includes('relation "news_likes" does not exist')) {
        console.log('❌ Tabela news_likes não existe');
        console.log('💡 Execute o script SQL para criar a tabela');
        return false;
      } else {
        console.error('❌ Erro ao acessar tabela news_likes:', error);
        return false;
      }
    }
    
    console.log('✅ Tabela news_likes existe e é acessível');
    return true;
  } catch (error) {
    console.error('❌ Erro ao testar tabela:', error);
    return false;
  }
}

// 3. Testar inserção de curtida
async function testLikeInsertion() {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Testar inserção de curtida pública
    const testNewsId = '00000000-0000-0000-0000-000000000000';
    
    const { data, error } = await supabase
      .from('news_likes')
      .insert({
        news_id: testNewsId,
        user_id: 'anonymous'
      });
    
    if (error) {
      console.error('❌ Erro ao inserir curtida:', error);
      return false;
    }
    
    console.log('✅ Inserção de curtida funcionou');
    
    // Limpar dados de teste
    await supabase
      .from('news_likes')
      .delete()
      .eq('news_id', testNewsId)
      .eq('user_id', 'anonymous');
    
    console.log('✅ Limpeza de dados de teste funcionou');
    return true;
  } catch (error) {
    console.error('❌ Erro ao testar inserção:', error);
    return false;
  }
}

// 4. Verificar localStorage
function testLocalStorage() {
  try {
    const savedLikes = localStorage.getItem('likedNews');
    const savedCounts = localStorage.getItem('newsLikes');
    
    console.log('📦 localStorage - Curtidas salvas:', savedLikes ? JSON.parse(savedLikes) : []);
    console.log('📦 localStorage - Contadores salvos:', savedCounts ? JSON.parse(savedCounts) : {});
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar localStorage:', error);
    return false;
  }
}

// 5. Verificar autenticação
async function testAuthentication() {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      console.log('👤 Usuário autenticado:', user.email);
    } else {
      console.log('👥 Usuário público (não autenticado)');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar autenticação:', error);
    return false;
  }
}

// 6. Executar todos os testes
async function runAllTests() {
  console.log('\n🧪 Executando todos os testes...\n');
  
  const results = {
    connection: await testSupabaseConnection(),
    table: await testNewsLikesTable(),
    insertion: await testLikeInsertion(),
    localStorage: testLocalStorage(),
    auth: await testAuthentication()
  };
  
  console.log('\n📊 Resultados dos testes:');
  console.log('Conexão Supabase:', results.connection ? '✅' : '❌');
  console.log('Tabela news_likes:', results.table ? '✅' : '❌');
  console.log('Inserção de curtidas:', results.insertion ? '✅' : '❌');
  console.log('localStorage:', results.localStorage ? '✅' : '❌');
  console.log('Autenticação:', results.auth ? '✅' : '❌');
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 Todos os testes passaram! As curtidas devem estar funcionando.');
  } else {
    console.log('\n⚠️ Alguns testes falharam. Verifique os erros acima.');
    
    if (!results.table) {
      console.log('\n💡 Para criar a tabela, execute no Supabase SQL Editor:');
      console.log('scripts/create-news-likes-table.sql');
    }
  }
  
  return results;
}

// Executar diagnóstico
runAllTests(); 