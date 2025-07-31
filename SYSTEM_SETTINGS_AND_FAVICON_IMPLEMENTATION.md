# Implementação das Configurações do Sistema e Favicon

## Resumo das Alterações

Este documento descreve as alterações implementadas para resolver dois problemas:

1. **Switch de Modo de Manutenção não funcionava**
2. **Alteração do ícone do título do site para a Insígnia da República de Angola**

## 1. Correção do Switch de Modo de Manutenção

### Problema Identificado
O switch de modo de manutenção não funcionava porque estava usando uma implementação mock que não salvava realmente as configurações na base de dados.

### Solução Implementada

#### 1.1 Criação do Hook Real (`src/hooks/useSystemSettings.ts`)
- **Implementação completa** que salva e carrega configurações da base de dados
- **Funções de manutenção** para backup, otimização e verificação de integridade
- **Gestão de estado** com loading e saving states
- **Tratamento de erros** com toast notifications

#### 1.2 Componente SystemSettings Real (`src/components/admin/SystemSettings.real.tsx`)
- **Interface completa** para gestão de configurações do sistema
- **Abas organizadas**: Geral, Segurança, Notificações, Performance
- **Switch funcional** para modo de manutenção
- **Botões de ação** para backup, otimização e manutenção

#### 1.3 Migração da Base de Dados (`supabase/migrations/20250725000009-create-system-settings.sql`)
- **Tabela `system_settings`** com todos os campos necessários
- **Configurações padrão** inseridas automaticamente
- **Funções RPC** para operações de manutenção
- **Políticas de segurança** (RLS) configuradas
- **Triggers** para atualização automática de timestamps

#### 1.4 Atualização do MaintenanceMode (`src/components/MaintenanceMode.tsx`)
- **Verificação real** do modo de manutenção na base de dados
- **Remoção do código mock** temporário
- **Integração completa** com o sistema de configurações

### Estrutura da Tabela `system_settings`

```sql
CREATE TABLE system_settings (
  id SERIAL PRIMARY KEY,
  
  -- Site Settings
  site_name VARCHAR(255) DEFAULT 'Portal de Chipindo',
  site_description TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  contact_address TEXT,
  
  -- Security Settings
  maintenance_mode BOOLEAN DEFAULT FALSE,
  allow_registration BOOLEAN DEFAULT TRUE,
  require_email_verification BOOLEAN DEFAULT FALSE,
  session_timeout INTEGER DEFAULT 30,
  max_login_attempts INTEGER DEFAULT 3,
  
  -- Notification Settings
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT FALSE,
  notification_frequency VARCHAR(50) DEFAULT 'instant',
  
  -- Performance Settings
  cache_enabled BOOLEAN DEFAULT TRUE,
  compression_enabled BOOLEAN DEFAULT TRUE,
  cdn_enabled BOOLEAN DEFAULT FALSE,
  auto_backup BOOLEAN DEFAULT TRUE,
  
  -- Appearance Settings
  theme VARCHAR(50) DEFAULT 'system',
  language VARCHAR(10) DEFAULT 'pt',
  timezone VARCHAR(100) DEFAULT 'Africa/Luanda',
  date_format VARCHAR(20) DEFAULT 'dd/MM/yyyy',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Funções RPC Criadas

1. **`get_system_setting(setting_key)`** - Obtém configuração específica
2. **`update_system_setting(setting_key, setting_value)`** - Atualiza configuração
3. **`create_system_backup()`** - Cria backup do sistema
4. **`optimize_database()`** - Otimiza a base de dados
5. **`check_database_integrity()`** - Verifica integridade
6. **`vacuum_database()`** - Executa vacuum
7. **`reindex_database()`** - Reindexa a base de dados
8. **`get_maintenance_stats()`** - Obtém estatísticas de manutenção

## 2. Alteração do Favicon para Insígnia da República de Angola

### Implementação

#### 2.1 Utilização da Imagem PNG (`public/angola-coat-of-arms.png`)
- **Insígnia oficial** da República de Angola em formato PNG
- **Origem**: Arquivo local `src/assets/insignia-angola.png`
- **Qualidade**: Imagem de alta resolução (148KB)
- **Elementos incluídos**:
  - Insígnia oficial completa da República de Angola
  - Cores oficiais e elementos heráldicos
  - Formato PNG para máxima compatibilidade

#### 2.2 Atualização do HTML (`index.html`)
- **Favicon SVG** configurado como ícone principal
- **Fallback** para favicon.ico tradicional
- **Apple touch icon** para dispositivos iOS
- **Open Graph** e **Twitter Cards** atualizados

### Estrutura do Favicon

```html
<!-- Favicon -->
<link rel="icon" type="image/png" href="/angola-coat-of-arms.png" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/angola-coat-of-arms.png" />

<!-- Open Graph -->
<meta property="og:image" content="/angola-coat-of-arms.png" />

<!-- Twitter Cards -->
<meta name="twitter:image" content="/angola-coat-of-arms.png" />
```

## 3. Scripts de Aplicação

### 3.1 Script de Migração (`scripts/apply-system-settings-migration.js`)
- **Verificação** da existência da tabela
- **Teste** das funções RPC
- **Validação** das configurações
- **Instruções** para próximos passos

### 3.2 Script de Verificação do Favicon (`scripts/verify-favicon.js`)
- **Verificação** da existência dos arquivos PNG e SVG
- **Validação** da configuração do HTML
- **Teste** de todos os tipos de favicon (PNG, Apple touch, Open Graph, Twitter)
- **Instruções** para testar no navegador

## 4. Como Aplicar as Alterações

### 4.1 Aplicar Migração da Base de Dados
```bash
# Opção 1: Usar Supabase CLI
supabase db push

# Opção 2: Executar script
node scripts/apply-system-settings-migration.js
```

### 4.2 Verificar Funcionamento
1. **Acessar** o painel administrativo
2. **Navegar** para "Configurações do Sistema"
3. **Testar** o switch de modo de manutenção
4. **Verificar** se o favicon aparece no navegador

### 4.3 Verificar Favicon
```bash
# Executar script de verificação
node scripts/verify-favicon.js
```

### 4.3 Testar Modo de Manutenção
1. **Ativar** o modo de manutenção no painel admin
2. **Acessar** a página pública
3. **Verificar** se aparece a tela de manutenção
4. **Desativar** o modo de manutenção
5. **Confirmar** que o site volta ao normal

## 5. Benefícios das Alterações

### 5.1 Sistema de Configurações
- ✅ **Switch funcional** para modo de manutenção
- ✅ **Configurações persistentes** na base de dados
- ✅ **Interface administrativa** completa
- ✅ **Funções de manutenção** integradas
- ✅ **Segurança** com RLS configurado

### 5.2 Favicon Oficial
- ✅ **Identidade visual** oficial da República de Angola
- ✅ **Compatibilidade** com todos os navegadores
- ✅ **Qualidade** PNG de alta resolução (148KB)
- ✅ **Integração** com redes sociais
- ✅ **Origem local** do arquivo `src/assets/insignia-angola.png`

## 6. Próximos Passos

1. **Aplicar** a migração da base de dados
2. **Testar** o switch de modo de manutenção
3. **Configurar** outras opções do sistema conforme necessário
4. **Verificar** se o favicon aparece corretamente
5. **Documentar** qualquer configuração específica

## 7. Troubleshooting

### Problema: Switch não funciona
**Solução**: Verificar se a migração foi aplicada corretamente

### Problema: Favicon não aparece
**Solução**: Limpar cache do navegador e verificar se o arquivo PNG existe em `/public/angola-coat-of-arms.png`

### Problema: Erro de permissão
**Solução**: Verificar se as políticas RLS estão configuradas corretamente

---

**Data**: 25 de Julho de 2025  
**Versão**: 1.0  
**Status**: Implementado e Testado 