# Configuração de Notificações - Portal de Chipindo

Este documento explica como configurar e usar o sistema de notificações implementado no Portal de Chipindo.

## 📧 Notificações por Email

### Configuração SMTP

Para ativar as notificações por email, configure as seguintes variáveis de ambiente no Supabase:

```bash
# Configurações SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-de-app
SMTP_FROM=noreply@chipindo.gov.ao
```

### Configuração Gmail (Recomendado)

1. Ative a verificação em duas etapas na sua conta Google
2. Gere uma senha de aplicativo:
   - Vá para Configurações da Conta Google
   - Segurança > Verificação em duas etapas
   - Senhas de app > Gerar nova senha
3. Use a senha gerada como `SMTP_PASSWORD`

### Teste de Email

1. Acesse as Configurações do Sistema
2. Vá para a aba "Notificações"
3. Ative "Notificações por Email"
4. Clique em "Testar Email"

## 📱 Notificações SMS

### Configuração Twilio

Para ativar as notificações SMS, configure as seguintes variáveis de ambiente:

```bash
# Configurações Twilio
TWILIO_ACCOUNT_SID=seu-account-sid
TWILIO_AUTH_TOKEN=seu-auth-token
TWILIO_FROM_NUMBER=+244123456789
```

### Configuração Twilio

1. Crie uma conta no [Twilio](https://www.twilio.com/)
2. Obtenha o Account SID e Auth Token do dashboard
3. Compre um número de telefone para envio de SMS
4. Configure as variáveis de ambiente

### Teste de SMS

1. Acesse as Configurações do Sistema
2. Vá para a aba "Notificações"
3. Ative "Notificações SMS"
4. Clique em "Testar SMS"

## 🔔 Notificações Push

### Configuração VAPID

Para ativar as notificações push, gere um par de chaves VAPID:

```bash
# Instale o web-push
npm install web-push

# Gere as chaves
npx web-push generate-vapid-keys
```

Configure as variáveis de ambiente:

```bash
# Chaves VAPID
VITE_VAPID_PUBLIC_KEY=sua-chave-publica-vapid
VAPID_PRIVATE_KEY=sua-chave-privada-vapid
```

### Configuração do Service Worker

O Service Worker já está configurado em `public/sw.js` e inclui:

- Registro automático
- Gerenciamento de cache
- Tratamento de notificações push
- Eventos de clique e fechamento

### Teste de Push Notifications

1. Acesse as Configurações do Sistema
2. Vá para a aba "Notificações"
3. Ative "Notificações Push"
4. Clique em "Testar Push"

## 🚀 Edge Functions

### Deploy das Edge Functions

As Edge Functions para email e SMS estão localizadas em:

```
supabase/functions/send-email/
supabase/functions/send-sms/
```

Para fazer deploy:

```bash
# Deploy das funções
npx supabase functions deploy send-email
npx supabase functions deploy send-sms
```

### Configuração das Funções

Cada função requer suas próprias variáveis de ambiente:

```bash
# Para send-email
supabase secrets set SMTP_HOST=smtp.gmail.com
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_USERNAME=seu-email@gmail.com
supabase secrets set SMTP_PASSWORD=sua-senha-de-app
supabase secrets set SMTP_FROM=noreply@chipindo.gov.ao

# Para send-sms
supabase secrets set TWILIO_ACCOUNT_SID=seu-account-sid
supabase secrets set TWILIO_AUTH_TOKEN=seu-auth-token
supabase secrets set TWILIO_FROM_NUMBER=+244123456789
```

## 📊 Banco de Dados

### Tabelas Criadas

O sistema cria as seguintes tabelas:

1. **push_subscriptions**: Armazena subscrições push dos utilizadores
2. **system_settings**: Configurações do sistema de notificações
3. **system_stats**: Estatísticas de uso das notificações

### Migrações

Execute as migrações para criar as tabelas necessárias:

```bash
# Aplicar migrações
npx supabase db push
```

## 🔧 Configuração no Frontend

### Hook usePushNotifications

O hook `usePushNotifications` gerencia:

- Verificação de suporte do navegador
- Solicitação de permissões
- Subscrição/desubscrição push
- Envio de notificações de teste

### Componente PushNotificationManager

O componente `PushNotificationManager` fornece:

- Interface para gerenciar notificações push
- Status em tempo real
- Testes de funcionalidade
- Configurações avançadas

## 📝 Uso das Notificações

### Envio de Notificações

```typescript
import { notificationManager } from '@/lib/notification-services';

// Email
await notificationManager.sendNotification('email', {
  to: 'user@example.com',
  subject: 'Nova Notícia',
  body: 'Uma nova notícia foi publicada'
});

// SMS
await notificationManager.sendNotification('sms', {
  to: '+244123456789',
  message: 'Nova notícia publicada no Portal de Chipindo'
});

// Push
await notificationManager.sendNotification('push', {
  title: 'Nova Notícia',
  body: 'Uma nova notícia foi publicada',
  icon: '/favicon.ico'
});
```

### Notificações Urgentes

```typescript
// Notificação urgente para todos os canais
await notificationManager.sendUrgentNotification(
  'Manutenção do Sistema',
  'O sistema estará em manutenção das 2h às 4h',
  ['admin@chipindo.gov.ao']
);
```

## 🔒 Segurança

### Permissões

- **Email**: Requer configuração SMTP válida
- **SMS**: Requer conta Twilio ativa
- **Push**: Requer HTTPS e permissão do navegador

### RLS (Row Level Security)

Todas as tabelas têm RLS configurado:

- Utilizadores só podem acessar suas próprias subscrições
- Administradores podem ver todas as subscrições
- Configurações só podem ser alteradas por administradores

## 🧪 Testes

### Teste Automático

```bash
# Teste das notificações
npm run test:notifications
```

### Teste Manual

1. **Email**: Verifique a caixa de entrada
2. **SMS**: Verifique o telefone configurado
3. **Push**: Verifique as notificações do navegador

## 📈 Monitoramento

### Logs

As notificações são registradas em:

- `system_stats` table
- Console do navegador
- Logs do Supabase

### Métricas

O sistema rastreia:

- Taxa de entrega
- Tempo de resposta
- Erros de envio
- Utilização por tipo

## 🚨 Troubleshooting

### Problemas Comuns

1. **Email não enviado**:
   - Verifique as configurações SMTP
   - Confirme a senha de aplicativo
   - Teste a conectividade

2. **SMS não enviado**:
   - Verifique as credenciais Twilio
   - Confirme o número de telefone
   - Verifique o saldo da conta

3. **Push não funcionando**:
   - Verifique se está usando HTTPS
   - Confirme a permissão do navegador
   - Verifique as chaves VAPID

### Logs de Debug

```typescript
// Ativar logs detalhados
localStorage.setItem('debug', 'notifications:*');
```

## 📞 Suporte

Para suporte técnico:

- Email: suporte@chipindo.gov.ao
- Telefone: +244 123 456 789
- Documentação: [Link para docs]

---

**Nota**: Este sistema de notificações é uma implementação completa e funcional que pode ser facilmente expandida para incluir mais tipos de notificações e canais de entrega. 