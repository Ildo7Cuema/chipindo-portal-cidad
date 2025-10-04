# 📱 Configuração da API de SMS

## 🎯 Objetivo

Configurar a integração com uma API real de SMS para substituir a simulação atual.

## 🔧 Variáveis de Ambiente

### Configuração Básica

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# URL da API de SMS
VITE_SMS_API_URL=https://sua-api-sms.com/send

# Chave da API (se necessário)
VITE_SMS_API_KEY=sua_chave_api_aqui

# Provedor de SMS (opcional, padrão: 'custom')
VITE_SMS_PROVIDER=custom
```

### Configurações para Provedores Específicos

#### Twilio
```env
VITE_SMS_PROVIDER=twilio
VITE_TWILIO_ACCOUNT_SID=seu_account_sid
VITE_TWILIO_AUTH_TOKEN=seu_auth_token
```

#### AWS SNS
```env
VITE_SMS_PROVIDER=aws_sns
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=sua_access_key
VITE_AWS_SECRET_ACCESS_KEY=sua_secret_key
```

#### AfricasTalking
```env
VITE_SMS_PROVIDER=africastalking
VITE_AFRICASTALKING_API_KEY=sua_api_key
```

## 📋 Formatos de API Suportados

### 1. JSON (Padrão)
```json
{
  "phone": "+244123456789",
  "message": "Sua mensagem aqui",
  "timestamp": "2024-12-01T10:30:00.000Z"
}
```

### 2. Form Data
```
phone: +244123456789
message: Sua mensagem aqui
timestamp: 2024-12-01T10:30:00.000Z
```

### 3. URL Encoded
```
phone=%2B244123456789&message=Sua%20mensagem%20aqui&timestamp=2024-12-01T10%3A30%3A00.000Z
```

## 🔧 Configuração Personalizada

Se sua API tem um formato específico, você pode personalizar a configuração:

### 1. Campos Personalizados
```typescript
// No arquivo sms-config.ts, modifique a configuração custom:
custom: {
  apiUrl: import.meta.env.VITE_SMS_API_URL || '',
  method: 'POST' as const,
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'valor'
  },
  bodyFormat: 'json' as const,
  phoneField: 'numero',        // Campo para telefone
  messageField: 'texto',       // Campo para mensagem
  successField: 'sucesso',     // Campo que indica sucesso
  errorField: 'erro',          // Campo que indica erro
  messageIdField: 'id_sms'     // Campo com ID da mensagem
}
```

### 2. Headers Personalizados
```env
# Adicione headers customizados
VITE_SMS_CUSTOM_HEADERS={"X-API-Version": "2.0", "X-Client-ID": "seu_client_id"}
```

## 🧪 Teste da Configuração

### 1. Verificar Variáveis de Ambiente
```javascript
// No console do navegador
console.log('API URL:', import.meta.env.VITE_SMS_API_URL);
console.log('API Key:', import.meta.env.VITE_SMS_API_KEY);
console.log('Provider:', import.meta.env.VITE_SMS_PROVIDER);
```

### 2. Teste Manual da API
```javascript
// Teste direto da API
const response = await fetch('https://sua-api-sms.com/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sua_chave_api'
  },
  body: JSON.stringify({
    phone: '+244123456789',
    message: 'Teste de SMS',
    timestamp: new Date().toISOString()
  })
});

console.log('Status:', response.status);
console.log('Resposta:', await response.json());
```

## 📊 Logs de Debug

O sistema gera logs detalhados para debug:

```javascript
// Logs que aparecem no console
📱 Enviando SMS via API real...
📞 Telefone: +244123456789
📝 Mensagem: Sua mensagem aqui
🔗 API URL: https://sua-api-sms.com/send
⚙️ Configuração: {apiUrl: "...", method: "POST", ...}
📡 Resposta da API: 200 OK
✅ Resposta da API: {success: true, id: "12345"}
```

## 🚨 Problemas Comuns

### 1. Erro 401 - Não Autorizado
```env
# Verificar se a chave da API está correta
VITE_SMS_API_KEY=sua_chave_api_correta
```

### 2. Erro 400 - Bad Request
```javascript
// Verificar formato dos dados enviados
console.log('Dados enviados:', requestData);
```

### 3. Erro CORS
```javascript
// A API precisa permitir requisições do seu domínio
// Adicione headers CORS na sua API
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 4. Telefone Inválido
```javascript
// O sistema limpa automaticamente o número
// Formato esperado: +244123456789
```

## 🔄 Exemplos de Integração

### Exemplo 1: API Simples
```env
VITE_SMS_API_URL=https://api.exemplo.com/sms/send
VITE_SMS_API_KEY=chave123
```

### Exemplo 2: API com Headers Customizados
```env
VITE_SMS_API_URL=https://api.exemplo.com/v2/sms
VITE_SMS_API_KEY=Bearer token123
VITE_SMS_PROVIDER=custom
```

### Exemplo 3: API com Formato Específico
```typescript
// Modificar sms-config.ts
custom: {
  phoneField: 'destinatario',
  messageField: 'conteudo',
  successField: 'status',
  messageIdField: 'codigo'
}
```

## 📋 Checklist de Configuração

- [ ] Variável `VITE_SMS_API_URL` configurada
- [ ] Variável `VITE_SMS_API_KEY` configurada (se necessário)
- [ ] API aceita requisições POST
- [ ] API retorna JSON
- [ ] API aceita campos `phone` e `message`
- [ ] API retorna campo de sucesso
- [ ] CORS configurado na API
- [ ] Teste manual da API funcionando
- [ ] Logs aparecem no console
- [ ] SMS é enviado com sucesso

## 🔧 Configuração Avançada

### Rate Limiting
```javascript
// Adicionar delay entre envios
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
await delay(1000); // 1 segundo entre envios
```

### Retry Logic
```javascript
// Tentar novamente em caso de falha
const maxRetries = 3;
for (let i = 0; i < maxRetries; i++) {
  try {
    const result = await sendSMS(phone, message);
    if (result.success) break;
  } catch (error) {
    console.log(`Tentativa ${i + 1} falhou:`, error);
  }
}
```

### Validação de Telefone
```javascript
// Validar formato do telefone antes de enviar
const phoneRegex = /^\+244[0-9]{9}$/;
if (!phoneRegex.test(phone)) {
  throw new Error('Formato de telefone inválido');
}
```

## 📞 Suporte

Para problemas com a configuração:

1. **Verifique os logs** no console do navegador
2. **Teste a API manualmente** com curl ou Postman
3. **Verifique as variáveis de ambiente** estão carregadas
4. **Confirme o formato** da sua API
5. **Verifique CORS** na sua API

---

**Status**: ✅ **Configurável**
**Última atualização**: Dezembro 2024 