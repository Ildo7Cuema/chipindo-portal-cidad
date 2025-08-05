import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

const parseCategoriasDisponiveis = (categorias) => {
  if (!categorias) return [];
  if (Array.isArray(categorias)) return categorias;
  if (typeof categorias === 'string') {
    try {
      const parsed = JSON.parse(categorias);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

async function testConcursosData() {
  try {
    console.log('Testing concursos data structure...');

    // Fetch all concursos
    const { data: concursos, error } = await supabase
      .from('concursos')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching concursos:', error);
      return;
    }

    console.log(`Found ${concursos.length} published concursos`);

    if (concursos.length > 0) {
      const firstConcurso = concursos[0];
      console.log('First concurso structure:', Object.keys(firstConcurso));
      console.log('Raw categorias_disponiveis value:', firstConcurso.categorias_disponiveis);
      console.log('Raw categorias_disponiveis type:', typeof firstConcurso.categorias_disponiveis);
      console.log('Raw Is array?', Array.isArray(firstConcurso.categorias_disponiveis));
      
      // Test the parsing function
      const parsedCategorias = parseCategoriasDisponiveis(firstConcurso.categorias_disponiveis);
      console.log('Parsed categorias_disponiveis:', parsedCategorias);
      console.log('Parsed type:', typeof parsedCategorias);
      console.log('Parsed Is array?', Array.isArray(parsedCategorias));
      
      // Test the map function on parsed data
      if (parsedCategorias && Array.isArray(parsedCategorias)) {
        console.log('✅ categorias_disponiveis is now an array and can be mapped');
        parsedCategorias.map(cat => console.log('Category:', cat));
      } else {
        console.log('❌ categorias_disponiveis is still not an array');
      }
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testConcursosData(); 