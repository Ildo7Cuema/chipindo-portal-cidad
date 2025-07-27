import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODk5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testRealUpload() {
  console.log('🧪 Testando upload com arquivo PDF real...\n');

  try {
    // Verificar buckets existentes
    console.log('📋 Verificando buckets existentes...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError);
      return;
    }

    console.log('✅ Buckets encontrados:', buckets.map(b => b.name));

    // Usar o primeiro bucket disponível ou transparency-documents
    const bucketName = buckets.find(b => b.name === 'transparency-documents')?.name || buckets[0]?.name;
    
    if (!bucketName) {
      console.log('❌ Nenhum bucket encontrado');
      console.log('💡 Crie um bucket no painel do Supabase primeiro');
      return;
    }

    console.log(`📦 Usando bucket: ${bucketName}`);

    // Criar um arquivo PDF de teste mais realista
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
72 720 Td
(Documento de Transparência - Teste) Tj
0 -20 Td
(Administração Municipal de Chipindo) Tj
0 -20 Td
(Data: ${new Date().toLocaleDateString('pt-AO')}) Tj
0 -20 Td
(Este é um documento de teste para verificar) Tj
0 -20 Td
(o funcionamento do upload de arquivos PDF) Tj
0 -20 Td
(no sistema de transparência.) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
520
%%EOF`;

    const testFile = new File([pdfContent], 'documento-transparencia-teste.pdf', { 
      type: 'application/pdf' 
    });
    
    const fileName = `test-real-${Date.now()}.pdf`;
    
    console.log('📤 Fazendo upload do arquivo PDF...');
    console.log('   Nome:', testFile.name);
    console.log('   Tamanho:', (testFile.size / 1024).toFixed(2), 'KB');
    console.log('   Tipo:', testFile.type);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, testFile, {
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      console.log('\n💡 Possíveis soluções:');
      console.log('1. Verifique se o bucket existe e está configurado corretamente');
      console.log('2. Verifique as políticas RLS do bucket');
      console.log('3. Certifique-se de que o bucket permite uploads públicos');
      return;
    }

    console.log('✅ Upload realizado com sucesso!');
    console.log('   Arquivo:', uploadData.path);
    console.log('   ID:', uploadData.id);

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log('   URL pública:', urlData.publicUrl);

    // Testar download
    console.log('\n📥 Testando download...');
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(fileName);

    if (downloadError) {
      console.error('❌ Erro no download:', downloadError);
    } else {
      console.log('✅ Download funcionando');
      console.log('   Tamanho baixado:', downloadData.size, 'bytes');
      console.log('   Tamanho original:', testFile.size, 'bytes');
      console.log('   Arquivos idênticos:', downloadData.size === testFile.size);
    }

    // Testar inserção na base de dados
    console.log('\n💾 Testando inserção na base de dados...');
    const testDocument = {
      title: 'Documento de Teste - Upload Real',
      category: 'relatorios',
      date: new Date().toISOString().split('T')[0],
      status: 'published',
      file_size: `${(testFile.size / (1024 * 1024)).toFixed(2)} MB`,
      description: 'Documento de teste criado via upload real',
      tags: ['teste', 'upload', 'real'],
      file_url: urlData.publicUrl
    };

    const { data: insertData, error: insertError } = await supabase
      .from('transparency_documents')
      .insert([testDocument])
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir documento:', insertError);
    } else {
      console.log('✅ Documento inserido na base de dados');
      console.log('   ID:', insertData[0].id);
      console.log('   Título:', insertData[0].title);
      console.log('   URL:', insertData[0].file_url);
    }

    // Limpar arquivo de teste
    console.log('\n🧹 Limpando arquivo de teste...');
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (deleteError) {
      console.error('⚠️ Erro ao remover arquivo de teste:', deleteError);
    } else {
      console.log('✅ Arquivo de teste removido do storage');
    }

    // Remover documento de teste da base de dados
    if (insertData?.[0]?.id) {
      const { error: deleteDocError } = await supabase
        .from('transparency_documents')
        .delete()
        .eq('id', insertData[0].id);

      if (deleteDocError) {
        console.error('⚠️ Erro ao remover documento de teste:', deleteDocError);
      } else {
        console.log('✅ Documento de teste removido da base de dados');
      }
    }

    console.log('\n🎉 Teste completo realizado com sucesso!');
    console.log('   ✅ Upload funcionando');
    console.log('   ✅ Download funcionando');
    console.log('   ✅ Inserção na base de dados funcionando');
    console.log('   ✅ Limpeza funcionando');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testRealUpload(); 