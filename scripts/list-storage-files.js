import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function listStorageFiles() {
  console.log('📁 Listando arquivos no storage...\n');

  try {
    // Listar todos os arquivos no bucket
    const { data: files, error } = await supabase.storage
      .from('acervo-digital')
      .list('', {
        limit: 1000,
        offset: 0
      });

    if (error) {
      console.error('Erro ao listar arquivos:', error);
      return;
    }

    console.log(`Total de arquivos encontrados: ${files.length}\n`);

    if (files.length === 0) {
      console.log('❌ Nenhum arquivo encontrado no bucket acervo-digital');
      return;
    }

    // Agrupar por diretório
    const filesByFolder = {};
    files.forEach(file => {
      const path = file.name.split('/');
      const folder = path.length > 1 ? path[0] : 'root';
      if (!filesByFolder[folder]) {
        filesByFolder[folder] = [];
      }
      filesByFolder[folder].push(file);
    });

    // Mostrar arquivos por pasta
    Object.keys(filesByFolder).forEach(folder => {
      console.log(`📂 Pasta: ${folder}`);
      filesByFolder[folder].forEach(file => {
        console.log(`   📄 ${file.name} (${file.metadata?.size || 'N/A'} bytes)`);
      });
      console.log('');
    });

    // Mostrar URLs públicos de exemplo
    console.log('🔗 URLs públicos de exemplo:');
    files.slice(0, 3).forEach(file => {
      const { data: { publicUrl } } = supabase.storage
        .from('acervo-digital')
        .getPublicUrl(file.name);
      console.log(`   ${file.name}: ${publicUrl}`);
    });

  } catch (error) {
    console.error('Erro geral:', error);
  }
}

listStorageFiles(); 