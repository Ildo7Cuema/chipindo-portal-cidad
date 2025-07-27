import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA';

const supabase = createClient(supabaseUrl, supabaseKey);

const testImages = [
  {
    title: 'Chipindo - Terra de Oportunidades',
    description: 'Descubra as maravilhas de Chipindo, uma cidade em constante desenvolvimento com paisagens deslumbrantes e um povo acolhedor.',
    image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
    active: true,
    order_index: 0
  },
  {
    title: 'Agricultura Sustentável',
    description: 'Nossa região é conhecida pela agricultura sustentável e produção de alimentos de qualidade para toda Angola.',
    image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
    active: true,
    order_index: 1
  },
  {
    title: 'Educação e Futuro',
    description: 'Investimos no futuro através da educação, construindo escolas modernas e formando as próximas gerações.',
    image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
    active: true,
    order_index: 2
  },
  {
    title: 'Infraestrutura Moderna',
    description: 'Obras e infraestrutura moderna para melhorar a qualidade de vida de todos os cidadãos de Chipindo.',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
    active: false,
    order_index: 3
  },
  {
    title: 'Turismo e Cultura',
    description: 'Explore nossa rica cultura e tradições, com festivais coloridos e experiências únicas para visitantes.',
    image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
    active: true,
    order_index: 4
  }
];

async function insertTestImages() {
  console.log('🚀 Inserindo imagens de teste no carrossel...\n');

  try {
    // Primeiro, limpar imagens existentes
    console.log('1️⃣ Limpando imagens existentes...');
    const { error: deleteError } = await supabase
      .from('hero_carousel')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('❌ Erro ao limpar imagens:', deleteError);
      return;
    }
    console.log('✅ Imagens existentes removidas\n');

    // Inserir novas imagens
    console.log('2️⃣ Inserindo novas imagens...');
    const { data: newImages, error: insertError } = await supabase
      .from('hero_carousel')
      .insert(testImages)
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir imagens:', insertError);
      return;
    }

    console.log(`✅ ${newImages.length} imagens inseridas com sucesso!\n`);

    // Verificar resultado
    console.log('3️⃣ Verificando resultado...');
    const { data: allImages, error: fetchError } = await supabase
      .from('hero_carousel')
      .select('*')
      .order('order_index', { ascending: true });

    if (fetchError) {
      console.error('❌ Erro ao buscar imagens:', fetchError);
      return;
    }

    console.log('📋 Imagens no carrossel:');
    allImages.forEach((img, index) => {
      console.log(`   ${index + 1}. ${img.title} - Ativa: ${img.active} - Ordem: ${img.order_index}`);
    });

    console.log('\n🎉 Processo concluído com sucesso!');
    console.log('💡 Agora você pode testar a página de gestão do carrossel.');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

insertTestImages(); 