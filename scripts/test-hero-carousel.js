import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testHeroCarousel() {
  console.log('🔍 Testando tabela hero_carousel...\n');

  try {
    // Test 1: Verificar se a tabela existe
    console.log('1️⃣ Verificando estrutura da tabela...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('hero_carousel')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Erro ao acessar tabela:', tableError);
      return;
    }
    console.log('✅ Tabela acessível\n');

    // Test 2: Contar registros
    console.log('2️⃣ Contando registros...');
    const { count, error: countError } = await supabase
      .from('hero_carousel')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Erro ao contar registros:', countError);
      return;
    }
    console.log(`📊 Total de registros: ${count}\n`);

    // Test 3: Buscar todas as imagens
    console.log('3️⃣ Buscando todas as imagens...');
    const { data: allImages, error: allError } = await supabase
      .from('hero_carousel')
      .select('*')
      .order('order_index', { ascending: true });

    if (allError) {
      console.error('❌ Erro ao buscar imagens:', allError);
      return;
    }

    console.log(`📋 Imagens encontradas: ${allImages.length}`);
    allImages.forEach((img, index) => {
      console.log(`   ${index + 1}. ${img.title} (ID: ${img.id}) - Ativa: ${img.active}`);
    });
    console.log();

    // Test 4: Buscar apenas imagens ativas
    console.log('4️⃣ Buscando apenas imagens ativas...');
    const { data: activeImages, error: activeError } = await supabase
      .from('hero_carousel')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true });

    if (activeError) {
      console.error('❌ Erro ao buscar imagens ativas:', activeError);
      return;
    }

    console.log(`📋 Imagens ativas: ${activeImages.length}`);
    activeImages.forEach((img, index) => {
      console.log(`   ${index + 1}. ${img.title} (ID: ${img.id})`);
    });
    console.log();

    // Test 5: Verificar bucket de storage
    console.log('5️⃣ Verificando bucket hero-carousel...');
    const { data: bucketFiles, error: bucketError } = await supabase.storage
      .from('hero-carousel')
      .list();

    if (bucketError) {
      console.error('❌ Erro ao acessar bucket:', bucketError);
    } else {
      console.log(`📁 Arquivos no bucket: ${bucketFiles.length}`);
      bucketFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.name} (${file.metadata?.size || 'N/A'} bytes)`);
      });
    }
    console.log();

    // Test 6: Inserir imagem de teste se não houver nenhuma
    if (allImages.length === 0) {
      console.log('6️⃣ Inserindo imagem de teste...');
      const testImage = {
        title: 'Imagem de Teste',
        description: 'Esta é uma imagem de teste para o carrossel',
        image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
        active: true,
        order_index: 0
      };

      const { data: newImage, error: insertError } = await supabase
        .from('hero_carousel')
        .insert([testImage])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Erro ao inserir imagem de teste:', insertError);
      } else {
        console.log('✅ Imagem de teste inserida:', newImage.title);
      }
    } else {
      console.log('6️⃣ Pulando inserção de teste (já existem imagens)');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testHeroCarousel(); 