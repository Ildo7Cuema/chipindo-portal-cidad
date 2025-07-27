# Guia de Configuração - Funcionalidades de Aparência

## 📋 Visão Geral

Este guia explica como configurar e otimizar as funcionalidades de aparência implementadas no Portal de Chipindo:

- **Tema**: Configuração de tema claro, escuro e automático
- **Idioma**: Suporte a múltiplos idiomas com bandeiras
- **Fuso Horário**: Configuração de fusos horários globais
- **Formato de Data/Hora**: Personalização de formatos de data e hora
- **Cores Personalizadas**: Personalização de cores primária e de destaque

## 🔧 Configuração Inicial

### 1. Configurações do Banco de Dados

Execute as configurações iniciais:

```sql
-- Inserir configurações padrão de aparência
INSERT INTO system_settings (key, value, description, category) VALUES
('theme_mode', 'auto', 'Modo do tema (light/dark/auto)', 'appearance'),
('language', 'pt', 'Idioma do sistema', 'appearance'),
('timezone', 'Africa/Luanda', 'Fuso horário', 'appearance'),
('date_format', 'DD/MM/YYYY', 'Formato de data', 'appearance'),
('time_format', '24h', 'Formato de hora', 'appearance'),
('primary_color', '#0f172a', 'Cor primária', 'appearance'),
('accent_color', '#3b82f6', 'Cor de destaque', 'appearance')
ON CONFLICT (key) DO NOTHING;
```

### 2. Configurações do Sistema

As configurações são gerenciadas através da tabela `system_settings`:

```sql
-- Verificar configurações atuais
SELECT * FROM system_settings WHERE category = 'appearance';

-- Atualizar configuração específica
UPDATE system_settings 
SET value = 'dark' 
WHERE key = 'theme_mode';
```

## 🚀 Configuração Detalhada

### Tema

#### Configuração Básica
```typescript
// Em src/lib/appearance-services.ts
const themeConfig = {
  mode: 'auto', // 'light' | 'dark' | 'auto'
  primaryColor: '#0f172a',
  accentColor: '#3b82f6',
  borderRadius: 6,
  fontFamily: 'Inter',
  fontSize: 'medium'
};
```

#### Aplicação Automática
```typescript
// Aplicar tema automaticamente
const applyTheme = (mode: 'light' | 'dark' | 'auto') => {
  const root = document.documentElement;
  
  if (mode === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', mode === 'dark');
  }
};
```

#### Monitoramento
```sql
-- Verificar estatísticas de tema
SELECT 
  metric_value->>'mode' as theme_mode,
  COUNT(*) as usage_count
FROM system_stats 
WHERE metric_name = 'theme_change'
GROUP BY metric_value->>'mode'
ORDER BY usage_count DESC;
```

### Idioma

#### Configuração Básica
```typescript
// Em src/lib/appearance-services.ts
const supportedLanguages = [
  { code: 'pt', name: 'Português', flag: '🇦🇴', direction: 'ltr' },
  { code: 'en', name: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', direction: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', direction: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', direction: 'ltr' }
];
```

#### Aplicação no Documento
```typescript
// Aplicar idioma automaticamente
const applyLanguage = (code: string) => {
  document.documentElement.lang = code;
  document.documentElement.dir = 'ltr'; // ou 'rtl' para árabe/hebraico
};
```

#### Monitoramento
```sql
-- Verificar estatísticas de idioma
SELECT 
  metric_value->>'language_code' as language_code,
  COUNT(*) as usage_count
FROM system_stats 
WHERE metric_name = 'language_change'
GROUP BY metric_value->>'language_code'
ORDER BY usage_count DESC;
```

### Fuso Horário

#### Configuração Básica
```typescript
// Em src/lib/appearance-services.ts
const supportedTimezones = [
  { value: 'Africa/Luanda', label: '🌍 Luanda (GMT+1)', offset: '+01:00' },
  { value: 'UTC', label: '🌐 UTC (GMT+0)', offset: '+00:00' },
  { value: 'Europe/London', label: '🇬🇧 London (GMT+0)', offset: '+00:00' },
  { value: 'America/New_York', label: '🇺🇸 New York (GMT-5)', offset: '-05:00' },
  { value: 'Europe/Paris', label: '🇫🇷 Paris (GMT+1)', offset: '+01:00' },
  { value: 'Asia/Tokyo', label: '🇯🇵 Tokyo (GMT+9)', offset: '+09:00' },
  { value: 'Australia/Sydney', label: '🇦🇺 Sydney (GMT+10)', offset: '+10:00' }
];
```

#### Formatação de Data/Hora
```typescript
// Formatar data baseado no fuso horário
const formatDate = (date: Date, format: string = 'DD/MM/YYYY') => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  switch (format) {
    case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY': return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
    default: return `${day}/${month}/${year}`;
  }
};

// Formatar hora baseado no formato
const formatTime = (date: Date, format: '12h' | '24h' = '24h') => {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  if (format === '12h') {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${period}`;
  } else {
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
};
```

#### Monitoramento
```sql
-- Verificar estatísticas de fuso horário
SELECT 
  metric_value->>'timezone' as timezone,
  COUNT(*) as usage_count
FROM system_stats 
WHERE metric_name = 'timezone_change'
GROUP BY metric_value->>'timezone'
ORDER BY usage_count DESC;
```

### Cores Personalizadas

#### Configuração CSS Variables
```css
/* Em src/index.css ou tailwind.config.ts */
:root {
  --primary: #0f172a;
  --accent: #3b82f6;
}

.dark {
  --primary: #f8fafc;
  --accent: #3b82f6;
}
```

#### Aplicação Dinâmica
```typescript
// Aplicar cores dinamicamente
const applyColors = (primary: string, accent: string) => {
  document.documentElement.style.setProperty('--primary', primary);
  document.documentElement.style.setProperty('--accent', accent);
};
```

#### Paleta de Cores Recomendada
```typescript
const colorPalettes = {
  default: {
    primary: '#0f172a',
    accent: '#3b82f6'
  },
  blue: {
    primary: '#1e3a8a',
    accent: '#3b82f6'
  },
  green: {
    primary: '#14532d',
    accent: '#10b981'
  },
  purple: {
    primary: '#581c87',
    accent: '#8b5cf6'
  },
  orange: {
    primary: '#7c2d12',
    accent: '#f59e0b'
  }
};
```

## 🔍 Testes e Validação

### Teste Automático
```bash
# Executar todos os testes de aparência
node scripts/test-appearance.js
```

### Teste Manual na Interface
1. Acesse **Admin > Configurações do Sistema**
2. Vá para a aba **Aparência**
3. Teste cada funcionalidade usando os selects disponíveis

### Validação de Configurações
```bash
# Verificar configurações atuais
curl -X GET https://api.chipindo.ao/system-settings/appearance

# Testar aplicação de tema
curl -X POST https://api.chipindo.ao/system-settings/theme \
  -H "Content-Type: application/json" \
  -d '{"mode": "dark"}'
```

## 📊 Monitoramento e Alertas

### Métricas Importantes
- **Uso de Temas**: Distribuição entre claro, escuro e automático
- **Uso de Idiomas**: Frequência de cada idioma
- **Uso de Fusos Horários**: Fusos mais utilizados
- **Mudanças de Configuração**: Frequência de alterações

### Alertas Configuráveis
```sql
-- Configurar alertas para mudanças frequentes
INSERT INTO system_settings (key, value, description) VALUES
('appearance_alert_theme_changes', '10', 'Alerta se mudanças de tema > 10/dia'),
('appearance_alert_language_changes', '5', 'Alerta se mudanças de idioma > 5/dia'),
('appearance_alert_timezone_changes', '3', 'Alerta se mudanças de fuso > 3/dia')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

## 🔧 Otimizações Avançadas

### Temas Dinâmicos
```typescript
// Tema baseado na hora do dia
const getDynamicTheme = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 18) {
    return 'light';
  } else {
    return 'dark';
  }
};
```

### Idiomas Inteligentes
```typescript
// Detectar idioma do navegador
const detectBrowserLanguage = () => {
  const browserLang = navigator.language.split('-')[0];
  const supported = ['pt', 'en', 'es', 'fr', 'zh'];
  return supported.includes(browserLang) ? browserLang : 'pt';
};
```

### Fusos Horários Adaptativos
```typescript
// Detectar fuso horário do usuário
const detectUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
```

### Cores Responsivas
```typescript
// Cores que se adaptam ao tema
const getResponsiveColors = (theme: 'light' | 'dark') => {
  return theme === 'dark' 
    ? { primary: '#f8fafc', accent: '#3b82f6' }
    : { primary: '#0f172a', accent: '#3b82f6' };
};
```

## 🚨 Troubleshooting

### Problemas Comuns

#### Tema não está aplicando
```bash
# Verificar configuração
SELECT value FROM system_settings WHERE key = 'theme_mode';

# Verificar classes CSS
document.documentElement.classList.contains('dark')
```

#### Idioma não está funcionando
```bash
# Verificar configuração
SELECT value FROM system_settings WHERE key = 'language';

# Verificar atributos do documento
document.documentElement.lang
```

#### Fuso horário incorreto
```bash
# Verificar configuração
SELECT value FROM system_settings WHERE key = 'timezone';

# Testar formatação
new Date().toLocaleString('pt-AO', { timeZone: 'Africa/Luanda' })
```

#### Cores não estão aplicando
```bash
# Verificar CSS variables
getComputedStyle(document.documentElement).getPropertyValue('--primary')

# Verificar configuração
SELECT value FROM system_settings WHERE key = 'primary_color';
```

## 📈 Melhorias Contínuas

### Análise de Uso
```sql
-- Relatório de uso de aparência semanal
SELECT 
  DATE_TRUNC('week', created_at) as week,
  metric_name,
  COUNT(*) as changes_count
FROM system_stats 
WHERE metric_name LIKE '%_change'
GROUP BY DATE_TRUNC('week', created_at), metric_name
ORDER BY week DESC, changes_count DESC;
```

### Otimizações Baseadas em Dados
- **Ajustar temas** baseado no padrão de uso
- **Priorizar idiomas** mais utilizados
- **Configurar fusos** para regiões com mais usuários
- **Otimizar cores** baseado na preferência dos usuários

## ✅ Checklist de Configuração

- [ ] **Configurações padrão** inseridas no banco
- [ ] **Tema automático** configurado
- [ ] **Idiomas suportados** definidos
- [ ] **Fusos horários** configurados
- [ ] **Formatos de data/hora** definidos
- [ ] **Cores padrão** configuradas
- [ ] **Testes executados** com sucesso
- [ ] **Monitoramento** configurado
- [ ] **Alertas** configurados
- [ ] **Documentação** atualizada

## 🎯 Resultados Esperados

Com todas as funcionalidades configuradas corretamente, você deve ver:

- **Tema responsivo** que se adapta às preferências
- **Suporte multilíngue** com bandeiras e nomes nativos
- **Fusos horários** globais com formatação correta
- **Cores personalizáveis** que se aplicam automaticamente
- **Monitoramento completo** de todas as métricas
- **Interface intuitiva** com feedback visual

As funcionalidades de aparência estão prontas para uso em produção! 