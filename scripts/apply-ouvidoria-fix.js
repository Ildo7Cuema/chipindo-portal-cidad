import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Usar as credenciais corretas do projeto
const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyOuvidoriaFix() {
  console.log('🔧 Aplicando correções das funções da ouvidoria...\n');

  try {
    // Ler o arquivo SQL
    const sqlContent = fs.readFileSync('scripts/apply-ouvidoria-fix.sql', 'utf8');
    
    // Dividir em comandos individuais
    const commands = sqlContent.split(';').filter(cmd => cmd.trim());
    
    for (const command of commands) {
      if (command.trim()) {
        console.log('Executando comando SQL...');
        const { error } = await supabase.rpc('exec_sql', { sql: command.trim() });
        
        if (error) {
          console.error('❌ Erro ao executar comando:', error);
        } else {
          console.log('✅ Comando executado com sucesso');
        }
      }
    }

    console.log('\n🎉 Correções aplicadas!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar correções
applyOuvidoriaFix(); 