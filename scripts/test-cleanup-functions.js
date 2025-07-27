import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testCleanupFunctions() {
  console.log('🧪 Testando funcionalidades de limpeza...\n');

  try {
    // Teste 1: Obter estatísticas de storage
    console.log('📊 Teste 1: Obtendo estatísticas de storage...');
    const stats = await getStorageStats();
    if (stats) {
      console.log('✅ Estatísticas obtidas:');
      console.log(`   - Total de arquivos: ${stats.totalFiles}`);
      console.log(`   - Tamanho total: ${stats.totalSizeMB}`);
    } else {
      console.log('❌ Erro ao obter estatísticas');
    }

    // Teste 2: Simular análise de arquivos órfãos
    console.log('\n🗑️ Teste 2: Analisando arquivos órfãos...');
    const orphanedAnalysis = await analyzeOrphanedFiles();
    if (orphanedAnalysis) {
      console.log('✅ Análise de arquivos órfãos:');
      console.log(`   - Arquivos no storage: ${orphanedAnalysis.totalFiles}`);
      console.log(`   - Documentos na base: ${orphanedAnalysis.totalDocuments}`);
      console.log(`   - Arquivos órfãos: ${orphanedAnalysis.orphanedFiles}`);
      console.log(`   - Tamanho órfão: ${orphanedAnalysis.orphanedSizeMB} MB`);
    } else {
      console.log('❌ Erro na análise de arquivos órfãos');
    }

    // Teste 3: Simular análise de arquivos antigos
    console.log('\n⏰ Teste 3: Analisando arquivos antigos...');
    const oldFilesAnalysis = await analyzeOldFiles();
    if (oldFilesAnalysis) {
      console.log('✅ Análise de arquivos antigos:');
      console.log(`   - Arquivos antigos: ${oldFilesAnalysis.oldFiles}`);
      console.log(`   - Tamanho antigo: ${oldFilesAnalysis.oldSizeMB} MB`);
    } else {
      console.log('❌ Erro na análise de arquivos antigos');
    }

    console.log('\n🎉 Testes de limpeza concluídos!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

async function getStorageStats() {
  try {
    const { data: files, error: listError } = await supabase.storage
      .from('transparency-documents')
      .list('transparency-documents');

    if (listError) {
      console.error('Erro ao listar arquivos:', listError);
      return null;
    }

    if (!files || files.length === 0) {
      return {
        totalFiles: 0,
        totalSize: 0,
        totalSizeMB: '0 MB'
      };
    }

    const totalSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    return {
      totalFiles: files.length,
      totalSize,
      totalSizeMB: `${totalSizeMB} MB`
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return null;
  }
}

async function analyzeOrphanedFiles() {
  try {
    // Listar arquivos no storage
    const { data: files, error: listError } = await supabase.storage
      .from('transparency-documents')
      .list('transparency-documents');

    if (listError) {
      console.error('Erro ao listar arquivos:', listError);
      return null;
    }

    // Obter documentos da base de dados
    const { data: documents, error: docsError } = await supabase
      .from('transparency_documents')
      .select('file_url');

    if (docsError) {
      console.error('Erro ao buscar documentos:', docsError);
      return null;
    }

    const documentUrls = documents?.map(doc => doc.file_url).filter(Boolean) || [];

    // Identificar arquivos órfãos
    const orphanedFiles = files.filter(file => {
      const fileUrl = supabase.storage
        .from('transparency-documents')
        .getPublicUrl(`transparency-documents/${file.name}`).data.publicUrl;
      
      return !documentUrls.includes(fileUrl);
    });

    const orphanedSize = orphanedFiles.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
    const orphanedSizeMB = (orphanedSize / (1024 * 1024)).toFixed(2);

    return {
      totalFiles: files.length,
      totalDocuments: documentUrls.length,
      orphanedFiles: orphanedFiles.length,
      orphanedSizeMB: `${orphanedSizeMB} MB`
    };
  } catch (error) {
    console.error('Erro na análise de arquivos órfãos:', error);
    return null;
  }
}

async function analyzeOldFiles() {
  try {
    const { data: files, error: listError } = await supabase.storage
      .from('transparency-documents')
      .list('transparency-documents');

    if (listError) {
      console.error('Erro ao listar arquivos:', listError);
      return null;
    }

    // Filtrar arquivos antigos (mais de 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const oldFiles = files.filter(file => {
      const fileDate = new Date(file.created_at);
      return fileDate < thirtyDaysAgo;
    });

    const oldSize = oldFiles.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
    const oldSizeMB = (oldSize / (1024 * 1024)).toFixed(2);

    return {
      oldFiles: oldFiles.length,
      oldSizeMB: `${oldSizeMB} MB`
    };
  } catch (error) {
    console.error('Erro na análise de arquivos antigos:', error);
    return null;
  }
}

testCleanupFunctions(); 