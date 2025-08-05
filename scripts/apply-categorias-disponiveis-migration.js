import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyCategoriasDisponiveisMigration() {
  try {
    console.log('Checking concursos table structure...');

    // Let's check the current data structure by fetching a sample record
    const { data: sampleData, error: sampleError } = await supabase
      .from('concursos')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.error('Error fetching sample data:', sampleError);
      return;
    }

    if (sampleData && sampleData.length > 0) {
      console.log('Current concursos table structure:', Object.keys(sampleData[0]));
      
      // Check if categorias_disponiveis field exists
      if ('categorias_disponiveis' in sampleData[0]) {
        console.log('✅ Column categorias_disponiveis exists');
        console.log('Current value:', sampleData[0].categorias_disponiveis);
      } else {
        console.log('❌ Column categorias_disponiveis does not exist');
        console.log('Please run the migration manually in your Supabase dashboard:');
        console.log('ALTER TABLE public.concursos ADD COLUMN categorias_disponiveis TEXT[] DEFAULT \'{}\';');
      }
    } else {
      console.log('No data found in concursos table');
    }

  } catch (error) {
    console.error('Migration check failed:', error);
  }
}

applyCategoriasDisponiveisMigration(); 