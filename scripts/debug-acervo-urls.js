const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function debugAcervoUrls() {
  console.log('🔍 Iniciando debug dos URLs do acervo digital...\n');

  try {
    // Buscar todos os itens públicos
    const { data: items, error } = await supabase
      .from('acervo_digital')
      .select('*')
      .eq('is_public', true);

    if (error) {
      console.error('❌ Erro ao buscar itens:', error);
      return;
    }

    console.log(`📊 Total de itens públicos encontrados: ${items.length}\n`);

    const problems = [];
    const validItems = [];

    for (const item of items) {
      console.log(`\n📁 Item: ${item.title}`);
      console.log(`   Tipo: ${item.type}`);
      console.log(`   URL: ${item.file_url}`);
      console.log(`   Thumbnail: ${item.thumbnail_url}`);

      // Verificar se o URL é válido
      let isValidUrl = false;
      try {
        if (item.file_url) {
          new URL(item.file_url);
          isValidUrl = true;
        }
      } catch (e) {
        console.log('   ❌ URL inválido');
      }

      // Verificar se é uma imagem válida
      const isValidImage = item.file_url && item.file_url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
      
      // Verificar se é um vídeo válido
      const isValidVideo = item.file_url && item.file_url.match(/\.(mp4|avi|mov|webm|mkv)$/i);

      if (!isValidUrl) {
        problems.push({
          item,
          issue: 'URL inválido',
          type: 'invalid_url'
        });
        console.log('   ❌ Problema: URL inválido');
      } else if (item.type === 'imagem' && !isValidImage) {
        problems.push({
          item,
          issue: 'Tipo imagem mas URL não é de imagem',
          type: 'wrong_extension'
        });
        console.log('   ❌ Problema: Tipo imagem mas URL não é de imagem');
      } else if (item.type === 'video' && !isValidVideo) {
        problems.push({
          item,
          issue: 'Tipo vídeo mas URL não é de vídeo',
          type: 'wrong_extension'
        });
        console.log('   ❌ Problema: Tipo vídeo mas URL não é de vídeo');
      } else {
        validItems.push(item);
        console.log('   ✅ Item válido');
      }
    }

    console.log('\n📈 RESUMO:');
    console.log(`✅ Itens válidos: ${validItems.length}`);
    console.log(`❌ Itens com problemas: ${problems.length}`);

    if (problems.length > 0) {
      console.log('\n🔧 ITENS COM PROBLEMAS:');
      problems.forEach((problem, index) => {
        console.log(`\n${index + 1}. ${problem.item.title}`);
        console.log(`   Problema: ${problem.issue}`);
        console.log(`   ID: ${problem.item.id}`);
        console.log(`   URL: ${problem.item.file_url}`);
      });

      console.log('\n💡 SUGESTÕES DE CORREÇÃO:');
      console.log('1. Verificar se os arquivos foram carregados corretamente no Supabase Storage');
      console.log('2. Verificar se as políticas de acesso estão configuradas corretamente');
      console.log('3. Verificar se os URLs estão sendo gerados corretamente');
      console.log('4. Verificar se os tipos de arquivo estão corretos');
    }

    // Testar acesso aos arquivos
    console.log('\n🧪 TESTANDO ACESSO AOS ARQUIVOS...');
    for (const item of validItems.slice(0, 3)) { // Testar apenas os primeiros 3
      try {
        const response = await fetch(item.file_url);
        if (response.ok) {
          console.log(`✅ ${item.title}: Arquivo acessível (${response.status})`);
        } else {
          console.log(`❌ ${item.title}: Erro ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.log(`❌ ${item.title}: Erro ao acessar - ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

async function fixAcervoUrls() {
  console.log('🔧 Iniciando correção dos URLs do acervo digital...\n');

  try {
    // Buscar itens com problemas
    const { data: items, error } = await supabase
      .from('acervo_digital')
      .select('*')
      .eq('is_public', true);

    if (error) {
      console.error('❌ Erro ao buscar itens:', error);
      return;
    }

    let fixedCount = 0;

    for (const item of items) {
      // Verificar se o URL precisa ser corrigido
      if (item.file_url && !item.file_url.startsWith('https://')) {
        console.log(`🔧 Corrigindo URL para: ${item.title}`);
        
        // Tentar gerar novo URL público
        try {
          const fileName = item.file_url.split('/').pop();
          if (fileName) {
            const { data: { publicUrl } } = supabase.storage
              .from('acervo-digital')
              .getPublicUrl(fileName);

            if (publicUrl && publicUrl !== item.file_url) {
              const { error: updateError } = await supabase
                .from('acervo_digital')
                .update({ file_url: publicUrl })
                .eq('id', item.id);

              if (updateError) {
                console.log(`❌ Erro ao atualizar: ${updateError.message}`);
              } else {
                console.log(`✅ URL corrigido: ${publicUrl}`);
                fixedCount++;
              }
            }
          }
        } catch (error) {
          console.log(`❌ Erro ao corrigir URL: ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Correção concluída. ${fixedCount} URLs corrigidos.`);

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar debug por padrão
if (process.argv.includes('--fix')) {
  fixAcervoUrls();
} else {
  debugAcervoUrls();
} 