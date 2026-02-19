#!/usr/bin/env node
/**
 * Script para fazer deploy da Edge Function create-admin-user
 * Uso: SUPABASE_ACCESS_TOKEN=<seu_token> node deploy-edge-function.js
 * 
 * Obter token em: https://supabase.com/dashboard/account/tokens
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PROJECT_REF = 'murdhrdqqnuntfxmwtqx';
const FUNCTION_NAME = 'create-admin-user';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
    console.error('❌ SUPABASE_ACCESS_TOKEN não definido!');
    console.error('');
    console.error('Como obter o token:');
    console.error('1. Aceda a https://supabase.com/dashboard/account/tokens');
    console.error('2. Clique em "Generate new token"');
    console.error('3. Copie o token gerado');
    console.error('4. Execute: SUPABASE_ACCESS_TOKEN=<token> node deploy-edge-function.js');
    process.exit(1);
}

const functionCode = readFileSync(
    join(__dirname, 'supabase/functions/create-admin-user/index.ts'),
    'utf-8'
);

const payload = JSON.stringify({
    name: FUNCTION_NAME,
    verify_jwt: true,
    body: functionCode
});

const options = {
    hostname: 'api.supabase.com',
    path: `/v1/projects/${PROJECT_REF}/functions/${FUNCTION_NAME}`,
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
    }
};

console.log(`🚀 A fazer deploy da função "${FUNCTION_NAME}" para o projecto ${PROJECT_REF}...`);

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('✅ Edge Function deployada com sucesso!');
            console.log(`   URL: https://${PROJECT_REF}.supabase.co/functions/v1/${FUNCTION_NAME}`);
        } else {
            console.error(`❌ Erro no deploy (HTTP ${res.statusCode}):`);
            try {
                const parsed = JSON.parse(data);
                console.error(JSON.stringify(parsed, null, 2));
            } catch {
                console.error(data);
            }
        }
    });
});

req.on('error', (err) => {
    console.error('❌ Erro de rede:', err.message);
});

req.write(payload);
req.end();
