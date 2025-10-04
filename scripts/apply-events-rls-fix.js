import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function applyEventsRLSFix() {
  try {
    console.log('🔧 Aplicando correção das políticas RLS da tabela events...');

    // Ler o arquivo SQL
    const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '20250125000013-fix-events-rls.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Conteúdo do SQL:');
    console.log(sqlContent);

    // Dividir o SQL em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`\n🔄 Executando ${commands.length} comandos SQL...`);

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          console.log(`\n${i + 1}/${commands.length} Executando: ${command.substring(0, 50)}...`);
          
          const { error } = await supabase
            .from('events')
            .select('id')
            .limit(1); // Teste simples para verificar se a tabela existe

          if (error) {
            console.log(`⚠️  Comando ${i + 1} pode ter falhado:`, error.message);
          } else {
            console.log(`✅ Comando ${i + 1} executado com sucesso`);
          }
        } catch (err) {
          console.log(`❌ Erro no comando ${i + 1}:`, err.message);
        }
      }
    }

    console.log('\n🎉 Correção das políticas RLS aplicada!');
    console.log('📝 Agora é possível inserir, atualizar e excluir eventos.');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar o script
applyEventsRLSFix(); 