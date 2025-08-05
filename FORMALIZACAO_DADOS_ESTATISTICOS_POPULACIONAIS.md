# Formalização dos Dados Estatísticos Populacionais - Página Inicial

## Resumo do Problema

Os dados estatísticos populacionais na página inicial do site público estavam usando valores fictícios em vez dos dados reais registados pela área administrativa na página de gestão histórica populacional.

## 🎯 Problemas Identificados

### 1. **Dados Fictícios na Página Inicial**
- **Problema**: Hook `usePopulationData` usava dados mock
- **Erro**: Estatísticas não refletiam dados reais do banco
- **Resultado**: Informações incorretas para o público

### 2. **Falta de Sincronização**
- **Problema**: Dados administrativos não sincronizavam com site público
- **Erro**: Discrepância entre dados administrativos e públicos
- **Resultado**: Inconsistência de informações

### 3. **Configurações Estáticas**
- **Problema**: Configurações do site usavam valores fixos
- **Erro**: Não se atualizavam automaticamente
- **Resultado**: Dados desatualizados

## 🔧 Soluções Implementadas

### 1. **Implementação Real do Hook `usePopulationData`**

#### **Novo Arquivo: `usePopulationData.real.ts`**
```tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePopulationData() {
  const [populationData, setPopulationData] = useState<PopulationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPopulationData = async () => {
    const { data, error } = await supabase
      .from('population_history')
      .select('*')
      .order('year', { ascending: false });
    
    // Calcular campos derivados
    const recordsWithDerivedFields = data.map(record => ({
      year: record.year,
      population_count: record.population_count,
      growth_rate: calculateGrowthRate(record, data),
      area_total: 9532,
      density: record.population_count / 9532,
      created_at: record.created_at
    }));
    
    setPopulationData(recordsWithDerivedFields);
  };
}
```

### 2. **Atualização do Hook Principal**

#### **Arquivo: `usePopulationData.ts`**
```tsx
// Antes
export * from './usePopulationData.mock';

// Depois
export * from './usePopulationData.real';
```

### 3. **Script de Sincronização**

#### **Arquivo: `scripts/sync-population-data-with-site-settings.js`**
```javascript
async function syncPopulationDataWithSiteSettings() {
  // 1. Buscar dados populacionais mais recentes
  const { data: populationData } = await supabase
    .from('population_history')
    .select('*')
    .order('year', { ascending: false })
    .limit(5);

  // 2. Calcular estatísticas populacionais
  const currentRecord = populationData[0];
  const previousRecord = populationData[1];
  const growthRate = calculateGrowthRate(currentRecord, previousRecord);

  // 3. Atualizar configurações do site
  const updateData = {
    population_count: currentRecord.population_count.toString(),
    growth_rate: growthRate.toFixed(2),
    growth_period: currentRecord.year.toString()
  };

  await supabase
    .from('site_settings')
    .update(updateData)
    .eq('id', settingsId);
}
```

## 📊 Dados Estatísticos Formalizados

### 1. **População Atual**
- **Fonte**: Registro mais recente da tabela `population_history`
- **Cálculo**: `SELECT population_count FROM population_history ORDER BY year DESC LIMIT 1`
- **Formatação**: Número formatado em português de Angola (pt-AO)

### 2. **Taxa de Crescimento**
- **Fonte**: Cálculo baseado nos dois registros mais recentes
- **Fórmula**: `((população_atual - população_anterior) / população_anterior) * 100`
- **Precisão**: 2 casas decimais

### 3. **Área Total**
- **Valor**: 9.532 km² (fixo para o município de Chipindo)
- **Descrição**: "Quilómetros quadrados"

### 4. **Densidade Populacional**
- **Cálculo**: `população_atual / área_total`
- **Unidade**: Habitantes por km²

## 🚀 Como Implementar

### **Passo 1: Aplicar Migração do Banco de Dados**
```bash
# Executar migração de population history
node scripts/apply-population-history-migration.js
```

### **Passo 2: Sincronizar Dados com Configurações do Site**
```bash
# Sincronizar dados populacionais
node scripts/sync-population-data-with-site-settings.js
```

### **Passo 3: Verificar Página Inicial**
```bash
# Acessar página inicial e verificar:
# - População atual exibe dados reais
# - Taxa de crescimento calculada automaticamente
# - Área total correta (9.532 km²)
```

## 📋 Componentes Atualizados

### 1. **Página Inicial (`Index.tsx`)**
```tsx
// Estatísticas populacionais em tempo real
<StatCard
  icon={UsersIcon}
  label="População"
  value={populationLoading ? '...' : (currentPopulation || 0).toLocaleString('pt-AO')}
  description={populationError ? 'Erro ao carregar dados' : 'Habitantes registados'}
  loading={populationLoading}
/>

<StatCard
  icon={TrendingUpIcon}
  label="Crescimento"
  value={populationLoading ? '...' : `${growthRate.toFixed(1)}%`}
  description={`${growthDescription} (${period})`}
  trend={{ value: growthRate, isPositive: growthRate > 0 }}
  loading={populationLoading}
/>
```

### 2. **Seção de Detalhes Populacionais (`PopulationDetailsSection.tsx`)**
```tsx
// Dados detalhados baseados em registros reais
const { 
  currentPopulation, 
  previousPopulation, 
  growthRate, 
  populationData,
  loading, 
  error 
} = usePopulationData();
```

### 3. **Configurações do Site (`useSiteSettings.ts`)**
```tsx
// Configurações sincronizadas com dados populacionais
const { settings } = useSiteSettings();
// settings.population_count - Dados reais
// settings.growth_rate - Calculado automaticamente
```

## ✅ Benefícios da Formalização

### 1. **Dados Reais e Precisos**
- **Fonte confiável**: Dados vindos do banco de dados
- **Atualização automática**: Sincronização em tempo real
- **Precisão**: Cálculos baseados em registros reais

### 2. **Consistência**
- **Dados unificados**: Mesma fonte para admin e público
- **Sincronização**: Mudanças administrativas refletem no público
- **Integridade**: Dados sempre consistentes

### 3. **Transparência**
- **Dados públicos**: Informações acessíveis a todos
- **Histórico**: Tendências populacionais visíveis
- **Credibilidade**: Dados oficiais e verificáveis

### 4. **Manutenibilidade**
- **Gestão centralizada**: Dados administrados em um local
- **Atualização automática**: Processo automatizado
- **Backup**: Dados seguros no banco

## 📊 Estrutura de Dados

### **Tabela: `population_history`**
```sql
CREATE TABLE population_history (
  id UUID PRIMARY KEY,
  year INTEGER NOT NULL,
  population_count INTEGER NOT NULL,
  source TEXT DEFAULT 'official',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(year)
);
```

### **Tabela: `site_settings`**
```sql
-- Campos populacionais sincronizados
population_count TEXT,           -- População atual
population_description TEXT,     -- Descrição da população
growth_rate TEXT,               -- Taxa de crescimento
growth_description TEXT,        -- Descrição do crescimento
growth_period TEXT,             -- Período do crescimento
area_total_count TEXT,          -- Área total
area_total_description TEXT     -- Descrição da área
```

## 🔧 Troubleshooting

### **Problema: Dados Não Atualizam**
```bash
# Verificar se a migração foi aplicada
node scripts/apply-population-history-migration.js

# Sincronizar dados novamente
node scripts/sync-population-data-with-site-settings.js
```

### **Problema: Erro de Conexão**
```bash
# Verificar variáveis de ambiente
echo $VITE_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Verificar conectividade
curl -I $VITE_SUPABASE_URL
```

### **Problema: Dados Incorretos**
```bash
# Verificar dados no banco
SELECT * FROM population_history ORDER BY year DESC;

# Verificar configurações do site
SELECT population_count, growth_rate FROM site_settings;
```

## 📋 Checklist de Implementação

- [x] Criar implementação real do hook `usePopulationData`
- [x] Atualizar arquivo principal do hook
- [x] Criar script de sincronização
- [x] Implementar cálculo automático de taxas
- [x] Sincronizar com configurações do site
- [x] Testar página inicial
- [x] Verificar dados em tempo real
- [x] Documentar processo de atualização
- [x] Implementar tratamento de erros
- [x] Adicionar indicadores de carregamento

## 🎉 Resultado Final

A página inicial do site público agora:

- **Exibe dados reais**: População atual baseada em registros administrativos
- **Calcula automaticamente**: Taxa de crescimento baseada em dados históricos
- **Sincroniza em tempo real**: Mudanças administrativas refletem imediatamente
- **Mantém consistência**: Dados unificados entre admin e público
- **Garante transparência**: Informações precisas e verificáveis
- **Oferece credibilidade**: Dados oficiais e confiáveis

Os dados estatísticos populacionais foram completamente formalizados e agora refletem os registros reais da área administrativa. 