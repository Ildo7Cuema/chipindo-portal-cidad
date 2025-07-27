import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyHeroCarouselFields() {
  console.log('🔧 Aplicando campos extras à tabela hero_carousel...\n');

  try {
    // SQL para adicionar os campos
    const sql = `
      -- Add extra fields to hero_carousel table
      ALTER TABLE public.hero_carousel 
      ADD COLUMN IF NOT EXISTS link_url TEXT,
      ADD COLUMN IF NOT EXISTS button_text TEXT,
      ADD COLUMN IF NOT EXISTS overlay_opacity DECIMAL(3,2) DEFAULT 0.5;

      -- Add comments for documentation
      COMMENT ON COLUMN public.hero_carousel.link_url IS 'Optional URL for the carousel image link';
      COMMENT ON COLUMN public.hero_carousel.button_text IS 'Optional text for the call-to-action button';
      COMMENT ON COLUMN public.hero_carousel.overlay_opacity IS 'Opacity of the overlay on the image (0.0 to 1.0)';
    `;

    console.log('1️⃣ Executando SQL de alteração da tabela...');
    
    // Executar o SQL usando RPC
    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('❌ Erro ao executar SQL:', error);
      return;
    }

    console.log('✅ Campos adicionados com sucesso!\n');

    // Verificar a estrutura da tabela
    console.log('2️⃣ Verificando estrutura da tabela...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('hero_carousel')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Erro ao verificar tabela:', tableError);
      return;
    }

    console.log('✅ Tabela verificada com sucesso');
    console.log('📋 Estrutura atual:', Object.keys(tableInfo[0] || {}));

    // Testar inserção com novos campos
    console.log('\n3️⃣ Testando inserção com novos campos...');
    const testImage = {
      title: 'Teste com Novos Campos',
      description: 'Teste para verificar se os novos campos funcionam',
      image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=85',
      active: true,
      order_index: 999,
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
      console.error('❌ Erro ao inserir imagem de teste:', insertError);
      return;
    }

    console.log('✅ Inserção de teste bem-sucedida!');
    console.log('📋 Imagem inserida:', {
      id: newImage.id,
      title: newImage.title,
      link_url: newImage.link_url,
      button_text: newImage.button_text,
      overlay_opacity: newImage.overlay_opacity
    });

    // Limpar imagem de teste
    console.log('\n4️⃣ Limpando imagem de teste...');
    const { error: deleteError } = await supabase
      .from('hero_carousel')
      .delete()
      .eq('id', newImage.id);

    if (deleteError) {
      console.error('❌ Erro ao limpar imagem de teste:', deleteError);
    } else {
      console.log('✅ Imagem de teste removida');
    }

    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('💡 Agora você pode usar os campos link_url, button_text e overlay_opacity no carrossel.');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

applyHeroCarouselFields(); 