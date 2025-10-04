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
  console.error('📋 Variáveis encontradas:', {
    VITE_SUPABASE_URL: supabaseUrl ? '✅ Definida' : '❌ Ausente',
    VITE_SUPABASE_ANON_KEY: supabaseServiceKey ? '✅ Definida' : '❌ Ausente'
  });
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('🔄 Aplicando migração para adicionar coluna request_id...');
    
    // Ler o arquivo SQL
    const sqlFilePath = path.join(__dirname, 'update-forward-logs-add-request-id.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('📄 Conteúdo do SQL:');
    console.log(sqlContent);
    
    // Executar a migração
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Erro ao aplicar migração:', error);
      
      // Tentar executar diretamente via REST API
      console.log('🔄 Tentando método alternativo...');
      
      const { data: result, error: restError } = await supabase
        .from('ouvidoria_forward_logs')
        .select('*')
        .limit(1);
      
      if (restError) {
        console.error('❌ Erro ao acessar tabela:', restError);
        return;
      }
      
      console.log('✅ Tabela acessível via REST API');
      console.log('💡 Execute manualmente no SQL Editor do Supabase:');
      console.log(sqlContent);
      
    } else {
      console.log('✅ Migração aplicada com sucesso!');
      console.log('📊 Resultado:', data);
    }
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    console.log('💡 Execute manualmente no SQL Editor do Supabase:');
    
    const sqlFilePath = path.join(__dirname, 'update-forward-logs-add-request-id.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    console.log(sqlContent);
  }
}

applyMigration(); 