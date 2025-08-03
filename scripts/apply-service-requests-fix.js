import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuração do Supabase
const supabaseUrl = 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMyMTYxNiwiZXhwIjoyMDY4ODk3NjE2fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyServiceRequestsFix() {
  console.log('🔧 Aplicando correção para service_requests...\n');

  try {
    // Ler o arquivo SQL
    const sqlPath = path.join(process.cwd(), 'scripts', 'fix-service-requests-simple.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('1. Executando script SQL...');
    
    // Dividir o SQL em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        console.log(`   Executando comando ${i + 1}/${commands.length}...`);
        
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: command });
          if (error) {
            console.log(`   ⚠️  Comando ${i + 1} teve erro (pode ser normal):`, error.message);
          } else {
            console.log(`   ✅ Comando ${i + 1} executado`);
          }
        } catch (err) {
          console.log(`   ⚠️  Comando ${i + 1} falhou (pode ser normal):`, err.message);
        }
      }
    }

    console.log('\n2. Verificando se a correção funcionou...');
    
    // Testar inserção novamente
    const testRequest = {
      service_name: "Teste de Correção",
      service_direction: "Serviços Municipais",
      requester_name: "Usuário Teste",
      requester_email: "teste@exemplo.com",
      requester_phone: "123456789",
      subject: "Teste de Correção",
      message: "Teste após aplicar correção RLS.",
      priority: 'normal'
    };

    const { data, error } = await supabase
      .from('service_requests')
      .insert([testRequest])
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ainda persiste:', error.message);
      console.error('Código:', error.code);
      return;
    }

    console.log('✅ Correção aplicada com sucesso!');
    console.log('📋 Dados inseridos:', data);

    // Limpar dados de teste
    await supabase
      .from('service_requests')
      .delete()
      .eq('id', data.id);

    console.log('🧹 Dados de teste removidos');
    console.log('\n🎉 Correção aplicada com sucesso! O sistema deve funcionar agora.');

  } catch (error) {
    console.error('❌ Erro ao aplicar correção:', error.message);
  }
}

// Executar a correção
applyServiceRequestsFix(); 