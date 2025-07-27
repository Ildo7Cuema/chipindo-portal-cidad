import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function createTransparencyBucket() {
  console.log('🔧 Criando bucket para documentos de transparência...\n');

  try {
    // Primeiro, vamos verificar se já existe algum bucket
    console.log('📋 Verificando buckets existentes...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError);
      return;
    }

    console.log('✅ Buckets encontrados:', buckets.map(b => b.name));

    // Verificar se o bucket já existe
    const existingBucket = buckets.find(b => b.name === 'transparency-documents');
    if (existingBucket) {
      console.log('✅ Bucket transparency-documents já existe');
      console.log('   Configurações:', {
        public: existingBucket.public,
        file_size_limit: existingBucket.file_size_limit,
        allowed_mime_types: existingBucket.allowed_mime_types
      });
      return;
    }

    // Tentar criar o bucket
    console.log('📝 Criando bucket transparency-documents...');
    
    // Como não podemos criar via API client, vamos usar um bucket existente ou criar manualmente
    console.log('💡 O bucket precisa ser criado manualmente no painel do Supabase');
    console.log('   Acesse: https://supabase.com/dashboard/project/murdhrdqqnuntfxmwtqx/storage');
    console.log('   Clique em "New bucket" e configure:');
    console.log('   - Name: transparency-documents');
    console.log('   - Public: true');
    console.log('   - File size limit: 10MB');
    console.log('   - Allowed MIME types: application/pdf');
    
    // Vamos tentar usar um bucket existente como fallback
    if (buckets.length > 0) {
      const fallbackBucket = buckets[0];
      console.log(`\n🔄 Usando bucket existente como fallback: ${fallbackBucket.name}`);
      
      // Testar upload no bucket existente
      await testUploadInBucket(fallbackBucket.name);
    } else {
      console.log('\n❌ Nenhum bucket encontrado');
      console.log('   Crie um bucket no painel do Supabase primeiro');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

async function testUploadInBucket(bucketName) {
  console.log(`\n🧪 Testando upload no bucket: ${bucketName}`);
  
  try {
    // Criar um arquivo PDF de teste
    const testContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n364\n%%EOF';
    const testFile = new File([testContent], 'test-transparency.pdf', { type: 'application/pdf' });
    
    const fileName = `transparency-test-${Date.now()}.pdf`;
    
    console.log('   Fazendo upload de teste...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, testFile, {
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      console.log('💡 Verifique as políticas RLS do bucket');
      return;
    }

    console.log('✅ Upload funcionando');
    console.log('   Arquivo:', uploadData.path);

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log('   URL pública:', urlData.publicUrl);

    // Limpar arquivo de teste
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (deleteError) {
      console.error('⚠️ Erro ao remover arquivo de teste:', deleteError);
    } else {
      console.log('✅ Arquivo de teste removido');
    }

    console.log(`\n🎉 Upload funcionando no bucket: ${bucketName}`);
    console.log('   Você pode usar este bucket temporariamente até criar o transparency-documents');

  } catch (error) {
    console.error('❌ Erro no teste de upload:', error);
  }
}

createTransparencyBucket(); 