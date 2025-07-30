import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function checkAcervoImages() {
  console.log('🔍 Verificando imagens e vídeos do acervo...\n');

  try {
    const { data: items, error } = await supabase
      .from('acervo_digital')
      .select('*')
      .eq('is_public', true);

    if (error) {
      console.error('Erro:', error);
      return;
    }

    console.log(`Total de itens públicos: ${items.length}\n`);

    const imageItems = items.filter(item => item.type === 'imagem');
    const videoItems = items.filter(item => item.type === 'video');

    console.log(`Imagens: ${imageItems.length}`);
    console.log(`Vídeos: ${videoItems.length}\n`);

    // Verificar imagens
    console.log('📸 IMAGENS:');
    imageItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   URL: ${item.file_url}`);
      console.log(`   Válido: ${item.file_url && item.file_url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? '✅' : '❌'}`);
      console.log('');
    });

    // Verificar vídeos
    console.log('🎥 VÍDEOS:');
    videoItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   URL: ${item.file_url}`);
      console.log(`   Válido: ${item.file_url && item.file_url.match(/\.(mp4|avi|mov|webm|mkv)$/i) ? '✅' : '❌'}`);
      console.log('');
    });

  } catch (error) {
    console.error('Erro:', error);
  }
}

checkAcervoImages(); 