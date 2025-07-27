import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testTransparencyUpload() {
  console.log('🧪 Testando upload de documentos de transparência...\n');

  try {
    // Listar buckets existentes
    console.log('📋 Verificando buckets existentes...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError);
      return;
    }

    console.log('✅ Buckets encontrados:', buckets.map(b => b.name));

    // Tentar usar um bucket existente ou criar um novo
    const bucketName = 'transparency-documents';
    let bucket = buckets.find(b => b.name === bucketName);
    
    if (!bucket) {
      console.log(`📝 Bucket ${bucketName} não encontrado`);
      console.log('💡 Para criar o bucket, acesse: https://supabase.com/dashboard/project/murdhrdqqnuntfxmwtqx/storage');
      console.log('   Crie um bucket chamado "transparency-documents" com as seguintes configurações:');
      console.log('   - Public: true');
      console.log('   - Allowed MIME types: application/pdf');
      console.log('   - File size limit: 10MB');
      return;
    }

    console.log(`✅ Bucket ${bucketName} encontrado`);

    // Testar upload de arquivo
    console.log('\n📤 Testando upload de arquivo PDF...');
    
    // Criar um arquivo PDF de teste em memória
    const testContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n364\n%%EOF';
    const testFile = new File([testContent], 'test-transparency.pdf', { type: 'application/pdf' });
    
    const fileName = `test-${Date.now()}.pdf`;
    const filePath = `${fileName}`;
    
    console.log('   Fazendo upload...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, testFile, {
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Erro ao fazer upload:', uploadError);
      console.log('\n💡 Possíveis soluções:');
      console.log('1. Verifique se o bucket existe e está configurado corretamente');
      console.log('2. Verifique as políticas RLS do bucket');
      console.log('3. Certifique-se de que o bucket permite uploads públicos');
      return;
    }

    console.log('✅ Upload funcionando');
    console.log('   Arquivo:', uploadData.path);

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log('   URL pública:', urlData.publicUrl);

    // Testar download
    console.log('\n📥 Testando download...');
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (downloadError) {
      console.error('❌ Erro ao fazer download:', downloadError);
    } else {
      console.log('✅ Download funcionando');
      console.log('   Tamanho:', downloadData.size, 'bytes');
    }

    // Limpar arquivo de teste
    console.log('\n🧹 Limpando arquivo de teste...');
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (deleteError) {
      console.error('⚠️ Erro ao remover arquivo de teste:', deleteError);
    } else {
      console.log('✅ Arquivo de teste removido');
    }

    console.log('\n🎉 Teste concluído com sucesso!');
    console.log('   O upload de documentos PDF está funcionando corretamente');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testTransparencyUpload(); 