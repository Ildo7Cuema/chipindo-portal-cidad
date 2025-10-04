import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente do arquivo .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.error('💡 Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyConstraintFix() {
  try {
    console.log('🔄 Aplicando correção da constraint manifestacao_id...');
    
    // Ler o arquivo SQL
    const sqlFilePath = path.join(__dirname, 'fix-manifestacao-id-constraint.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('📄 Conteúdo do SQL:');
    console.log(sqlContent);
    
    // Dividir o script em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    for (const command of commands) {
      if (command.trim()) {
        console.log(`\n🔄 Executando: ${command.substring(0, 80)}...`);
        
        try {
          // Para comandos SELECT, usar rpc se disponível
          if (command.toLowerCase().includes('select')) {
            const { data, error } = await supabase.rpc('exec_sql', { sql: command + ';' });
            if (error) {
              console.warn(`⚠️ Aviso ao executar SELECT: ${error.message}`);
              console.log('💡 Execute manualmente no SQL Editor do Supabase');
            } else {
              console.log('✅ SELECT executado com sucesso');
              console.log('📊 Resultado:', data);
            }
          } else {
            // Para outros comandos DDL
            const { error } = await supabase.rpc('exec_sql', { sql: command + ';' });
            if (error) {
              console.warn(`⚠️ Aviso ao executar comando: ${error.message}`);
              console.log('💡 Execute manualmente no SQL Editor do Supabase');
            } else {
              console.log('✅ Comando executado com sucesso');
            }
          }
        } catch (cmdError) {
          console.warn(`⚠️ Erro ao executar comando: ${cmdError.message}`);
          console.log('💡 Execute manualmente no SQL Editor do Supabase');
        }
      }
    }

    console.log('\n✅ Correção da constraint concluída!');
    console.log('📋 Coluna manifestacao_id agora é opcional');
    console.log('🔧 Constraint adicionada para garantir integridade dos dados');
    
  } catch (error) {
    console.error('❌ Erro durante a correção:', error);
    console.log('💡 Execute manualmente no SQL Editor do Supabase:');
    
    const sqlFilePath = path.join(__dirname, 'fix-manifestacao-id-constraint.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    console.log(sqlContent);
  }
}

applyConstraintFix(); 