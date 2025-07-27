#!/usr/bin/env node

/**
 * Script para testar o sistema de notificações
 * 
 * Uso:
 * node scripts/test-notifications.js [email|sms|push|all]
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Teste de configurações do sistema
async function testSystemSettings() {
  logInfo('Testando configurações do sistema...');
  
  try {
    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', ['email_notifications', 'sms_notifications', 'push_notifications']);

    if (error) {
      logError(`Erro ao buscar configurações: ${error.message}`);
      return false;
    }

    const config = {};
    settings.forEach(setting => {
      config[setting.key] = setting.value;
    });

    logSuccess('Configurações carregadas:');
    Object.entries(config).forEach(([key, value]) => {
      log(`  ${key}: ${value}`, 'cyan');
    });

    return true;
  } catch (error) {
    logError(`Erro inesperado: ${error.message}`);
    return false;
  }
}

// Teste de email
async function testEmail() {
  logInfo('Testando notificações por email...');
  
  try {
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: testEmail,
        subject: 'Teste de Notificação - Portal de Chipindo',
        body: 'Esta é uma notificação de teste do sistema de notificações.',
        html: `
          <h2>Teste de Notificação</h2>
          <p>Esta é uma notificação de teste do sistema de notificações do Portal de Chipindo.</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-AO')}</p>
          <p><strong>Teste:</strong> Script automatizado</p>
        `
      }
    });

    if (error) {
      logError(`Erro ao enviar email: ${error.message}`);
      return false;
    }

    logSuccess(`Email enviado para: ${testEmail}`);
    return true;
  } catch (error) {
    logError(`Erro inesperado: ${error.message}`);
    return false;
  }
}

// Teste de SMS
async function testSMS() {
  logInfo('Testando notificações por SMS...');
  
  try {
    const testPhone = process.env.TEST_PHONE || '+244123456789';
    
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: {
        to: testPhone,
        message: `Teste de SMS - Portal de Chipindo. Data: ${new Date().toLocaleString('pt-AO')}`,
        from: 'Chipindo'
      }
    });

    if (error) {
      logError(`Erro ao enviar SMS: ${error.message}`);
      return false;
    }

    logSuccess(`SMS enviado para: ${testPhone}`);
    return true;
  } catch (error) {
    logError(`Erro inesperado: ${error.message}`);
    return false;
  }
}

// Teste de push notifications
async function testPush() {
  logInfo('Testando notificações push...');
  
  try {
    // Verificar se há subscrições push
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .limit(1);

    if (error) {
      logError(`Erro ao buscar subscrições: ${error.message}`);
      return false;
    }

    if (!subscriptions || subscriptions.length === 0) {
      logWarning('Nenhuma subscrição push encontrada');
      return false;
    }

    logSuccess(`Encontradas ${subscriptions.length} subscrições push`);
    
    // Aqui você implementaria o envio real de push notifications
    // usando web-push ou similar
    logInfo('Push notifications requerem implementação adicional');
    
    return true;
  } catch (error) {
    logError(`Erro inesperado: ${error.message}`);
    return false;
  }
}

// Teste de estatísticas
async function testStats() {
  logInfo('Testando estatísticas do sistema...');
  
  try {
    const { data, error } = await supabase.rpc('get_system_stats');

    if (error) {
      logError(`Erro ao buscar estatísticas: ${error.message}`);
      return false;
    }

    logSuccess('Estatísticas carregadas:');
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        log(`  ${key}: ${value}`, 'cyan');
      });
    }

    return true;
  } catch (error) {
    logError(`Erro inesperado: ${error.message}`);
    return false;
  }
}

// Teste completo
async function testAll() {
  logInfo('Iniciando testes completos do sistema de notificações...');
  
  const results = {
    settings: await testSystemSettings(),
    email: await testEmail(),
    sms: await testSMS(),
    push: await testPush(),
    stats: await testStats()
  };

  logInfo('Resultados dos testes:');
  Object.entries(results).forEach(([test, success]) => {
    if (success) {
      logSuccess(`${test}: OK`);
    } else {
      logError(`${test}: FALHOU`);
    }
  });

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  logInfo(`Resumo: ${passed}/${total} testes passaram`);

  if (passed === total) {
    logSuccess('Todos os testes passaram! 🎉');
  } else {
    logError('Alguns testes falharam. Verifique a configuração.');
  }
}

// Função principal
async function main() {
  const testType = process.argv[2] || 'all';
  
  log(`🚀 Iniciando testes de notificações: ${testType.toUpperCase()}`, 'bright');
  
  switch (testType.toLowerCase()) {
    case 'email':
      await testEmail();
      break;
    case 'sms':
      await testSMS();
      break;
    case 'push':
      await testPush();
      break;
    case 'settings':
      await testSystemSettings();
      break;
    case 'stats':
      await testStats();
      break;
    case 'all':
    default:
      await testAll();
      break;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    logError(`Erro fatal: ${error.message}`);
    process.exit(1);
  });
}

export { testEmail, testSMS, testPush, testSystemSettings, testStats, testAll }; 