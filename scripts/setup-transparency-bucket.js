import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function setupTransparencyBucket() {
  console.log('🔧 Configurando bucket para documentos de transparência...\n');

  try {
    // Listar buckets existentes
    console.log('📋 Verificando buckets existentes...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError);
      return;
    }

    console.log('✅ Buckets encontrados:', buckets.map(b => b.name));

    // Verificar se o bucket transparency-documents existe
    const transparencyBucket = buckets.find(b => b.name === 'transparency-documents');
    
    if (transparencyBucket) {
      console.log('✅ Bucket transparency-documents já existe');
    } else {
      console.log('📝 Criando bucket transparency-documents...');
      
      // Criar o bucket
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('transparency-documents', {
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 10 * 1024 * 1024 // 10MB
      });

      if (createError) {
        console.error('❌ Erro ao criar bucket:', createError);
        return;
      }

      console.log('✅ Bucket transparency-documents criado com sucesso');
    }

    // Testar upload de arquivo
    console.log('\n🧪 Testando upload de arquivo...');
    
    // Criar um arquivo PDF de teste em memória
    const testContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n364\n%%EOF';
    const testFile = new File([testContent], 'test.pdf', { type: 'application/pdf' });
    
    const fileName = `test-${Date.now()}.pdf`;
    const filePath = `transparency-documents/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('transparency-documents')
      .upload(filePath, testFile, {
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Erro ao fazer upload de teste:', uploadError);
      return;
    }

    console.log('✅ Upload de teste funcionando');
    console.log('   Arquivo:', uploadData.path);

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('transparency-documents')
      .getPublicUrl(filePath);

    console.log('   URL pública:', urlData.publicUrl);

    // Limpar arquivo de teste
    const { error: deleteError } = await supabase.storage
      .from('transparency-documents')
      .remove([filePath]);

    if (deleteError) {
      console.error('⚠️ Erro ao remover arquivo de teste:', deleteError);
    } else {
      console.log('✅ Arquivo de teste removido');
    }

    console.log('\n🎉 Configuração concluída com sucesso!');
    console.log('   O bucket transparency-documents está pronto para uso');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

setupTransparencyBucket(); 