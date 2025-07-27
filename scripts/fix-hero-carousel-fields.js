import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixHeroCarouselFields() {
  console.log('🔧 Corrigindo campos da tabela hero_carousel...\n');

  try {
    // Primeiro, vamos verificar a estrutura atual
    console.log('1️⃣ Verificando estrutura atual da tabela...');
    const { data: currentData, error: fetchError } = await supabase
      .from('hero_carousel')
      .select('*')
      .limit(1);

    if (fetchError) {
      console.error('❌ Erro ao verificar tabela:', fetchError);
      return;
    }

    console.log('✅ Tabela acessível');
    if (currentData.length > 0) {
      console.log('📋 Campos atuais:', Object.keys(currentData[0]));
    }

    // Vamos tentar inserir uma imagem com os novos campos
    console.log('\n2️⃣ Testando inserção com campos extras...');
    const testImage = {
      title: 'Teste Campos Extras',
      description: 'Teste para verificar se os campos extras funcionam',
      image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
      active: true,
      order_index: 999,
      // Vamos tentar os campos extras
      link_url: 'https://exemplo.com',
      button_text: 'Saiba Mais',
      overlay_opacity: 0.7
    };

    const { data: newImage, error: insertError } = await supabase
      .from('hero_carousel')
      .insert([testImage])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao inserir com campos extras:', insertError);
      
      // Se falhou, vamos tentar sem os campos extras
      console.log('\n3️⃣ Tentando inserção sem campos extras...');
      const simpleImage = {
        title: 'Teste Campos Básicos',
        description: 'Teste apenas com campos básicos',
        image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
        active: true,
        order_index: 998
      };

      const { data: simpleNewImage, error: simpleInsertError } = await supabase
        .from('hero_carousel')
        .insert([simpleImage])
        .select()
        .single();

      if (simpleInsertError) {
        console.error('❌ Erro ao inserir imagem simples:', simpleInsertError);
        return;
      }

      console.log('✅ Inserção simples bem-sucedida');
      console.log('📋 Imagem inserida:', simpleNewImage);

      // Limpar imagem de teste
      const { error: deleteError } = await supabase
        .from('hero_carousel')
        .delete()
        .eq('id', simpleNewImage.id);

      if (deleteError) {
        console.error('❌ Erro ao limpar imagem de teste:', deleteError);
      } else {
        console.log('✅ Imagem de teste removida');
      }

      console.log('\n⚠️  Os campos extras não estão disponíveis na tabela.');
      console.log('💡 Você precisa adicionar os campos manualmente no Supabase Dashboard:');
      console.log('   - link_url (TEXT)');
      console.log('   - button_text (TEXT)');
      console.log('   - overlay_opacity (DECIMAL(3,2))');
      
    } else {
      console.log('✅ Inserção com campos extras bem-sucedida!');
      console.log('📋 Imagem inserida:', {
        id: newImage.id,
        title: newImage.title,
        link_url: newImage.link_url,
        button_text: newImage.button_text,
        overlay_opacity: newImage.overlay_opacity
      });

      // Limpar imagem de teste
      const { error: deleteError } = await supabase
        .from('hero_carousel')
        .delete()
        .eq('id', newImage.id);

      if (deleteError) {
        console.error('❌ Erro ao limpar imagem de teste:', deleteError);
      } else {
        console.log('✅ Imagem de teste removida');
      }

      console.log('\n🎉 Campos extras já estão disponíveis na tabela!');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

fixHeroCarouselFields(); 