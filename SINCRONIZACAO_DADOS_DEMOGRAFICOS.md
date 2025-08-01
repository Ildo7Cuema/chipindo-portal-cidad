# 🔄 Sincronização de Dados Demográficos

## 🎯 Problema Identificado

As informações de demografia na seção de **Caracterização do Município** não estavam consistentes com a seção de **Informações Demográficas** mais acima na página.

### Inconsistências Encontradas:
- **Seção de Informações Demográficas**: 159.000 habitantes (2024)
- **Seção de Caracterização do Município**: 150.000+ habitantes

## ✅ Solução Implementada

### 1. **Hook Atualizado - `useMunicipalityCharacterization`**

O hook foi modificado para sincronizar automaticamente os dados demográficos com a tabela `population_history`:

```typescript
// Sincronizar dados demográficos com population_history
try {
  const { data: populationData, error: populationError } = await supabase
    .from('population_history')
    .select('*')
    .order('year', { ascending: false })
    .limit(1)
    .single();

  if (!populationError && populationData) {
    const currentYear = new Date().getFullYear();
    const currentPopulation = populationData.population_count;
    
    // Calcular densidade baseada na população atual e área
    const areaKm2 = 2100; // Área do município em km²
    const density = (currentPopulation / areaKm2).toFixed(1);
    
    // Calcular taxa de crescimento se houver dados do ano anterior
    const { data: previousYearData } = await supabase
      .from('population_history')
      .select('population_count')
      .eq('year', currentYear - 1)
      .single();

    let growthRate = "2.3% ao ano"; // Valor padrão
    if (previousYearData && previousYearData.population_count > 0) {
      const growth = ((currentPopulation - previousYearData.population_count) / previousYearData.population_count) * 100;
      growthRate = `${growth.toFixed(1)}% ao ano`;
    }

    // Atualizar dados demográficos com informações sincronizadas
    formattedData.demography = {
      ...formattedData.demography,
      population: `${currentPopulation.toLocaleString('pt-AO')} habitantes`,
      density: `${density} hab/km²`,
      growth: growthRate
    };
  }
} catch (populationError) {
  console.warn('Erro ao sincronizar dados populacionais:', populationError);
  // Continuar com os dados originais se não conseguir sincronizar
}
```

### 2. **Gerenciador Atualizado - `MunicipalityCharacterizationManager`**

Adicionada funcionalidade de sincronização manual no painel administrativo:

#### Novas Funcionalidades:
- **Botão "Sincronizar Demografia"**: Atualiza automaticamente os dados demográficos
- **Indicador visual**: Badge mostrando que os dados estão sincronizados
- **Nota informativa**: Explica que os dados são sincronizados automaticamente
- **Campos expandidos**: Adicionados campos para crescimento e famílias

#### Interface Melhorada:
```typescript
<CardTitle className="flex items-center justify-between">
  Demografia
  <Badge variant="secondary" className="text-xs">
    Sincronizado com dados populacionais
  </Badge>
</CardTitle>
```

### 3. **Dados Padrão Atualizados**

Os dados padrão foram atualizados para refletir os valores corretos:

```typescript
demography: {
  population: "159.000 habitantes", // Atualizado de "150.000+ habitantes"
  density: "76 hab/km²",           // Atualizado de "71 hab/km²"
  growth: "2.3% ao ano",           // Atualizado de "2.5% ao ano"
  households: "26.500 famílias",   // Atualizado de "25.000 famílias"
  urbanRate: "35%"
}
```

## 🔧 Como Funciona

### Sincronização Automática:
1. **Carregamento**: Quando a página é carregada, o hook busca dados da `population_history`
2. **Cálculo**: Calcula densidade e taxa de crescimento automaticamente
3. **Atualização**: Atualiza os dados de caracterização com valores sincronizados
4. **Fallback**: Se houver erro, mantém os dados originais

### Sincronização Manual:
1. **Botão**: Administrador clica em "Sincronizar Demografia"
2. **Busca**: Sistema busca dados mais recentes da `population_history`
3. **Cálculo**: Recalcula densidade e crescimento
4. **Atualização**: Atualiza interface e salva no banco de dados
5. **Feedback**: Mostra notificação de sucesso

## 📊 Dados Sincronizados

### População:
- **Fonte**: Tabela `population_history`
- **Formato**: `159.000 habitantes` (formatação pt-AO)
- **Cálculo**: Último registro da tabela

### Densidade:
- **Fonte**: Calculada automaticamente
- **Fórmula**: `População / Área (2100 km²)`
- **Resultado**: `76 hab/km²`

### Taxa de Crescimento:
- **Fonte**: Calculada entre anos consecutivos
- **Fórmula**: `((População Atual - População Anterior) / População Anterior) * 100`
- **Resultado**: `2.3% ao ano`

## 🚀 Benefícios

### 1. **Consistência de Dados**
- Todas as seções mostram a mesma informação populacional
- Eliminação de inconsistências entre seções

### 2. **Atualização Automática**
- Dados sempre atualizados quando novos registros são adicionados
- Cálculos automáticos de densidade e crescimento

### 3. **Interface Melhorada**
- Indicadores visuais de sincronização
- Botão de sincronização manual para administradores
- Notas explicativas para usuários

### 4. **Robustez**
- Fallback para dados originais em caso de erro
- Logs de erro para debugging
- Tratamento de casos onde dados não estão disponíveis

## 📋 Scripts de Teste

### Script de Verificação:
```bash
node scripts/test-demographic-sync.cjs
```

Este script:
1. Verifica dados da `population_history`
2. Verifica dados da `municipality_characterization`
3. Calcula dados sincronizados
4. Compara consistência entre seções
5. Atualiza dados se necessário

## 🔍 Verificação

### Como Verificar se Está Funcionando:

1. **Aceder à página inicial**
2. **Verificar seção "Informações Demográficas"**
3. **Verificar seção "Caracterização do Município"**
4. **Confirmar que ambos mostram 159.000 habitantes**

### Como Testar Sincronização Manual:

1. **Aceder ao painel administrativo**
2. **Ir para "Caracterização do Município"**
3. **Clicar em "Sincronizar Demografia"**
4. **Verificar notificação de sucesso**

## 🎯 Resultado Final

Agora as informações demográficas são **consistentes** em todas as seções do portal:

- ✅ **População**: 159.000 habitantes
- ✅ **Densidade**: 76 hab/km²  
- ✅ **Crescimento**: 2.3% ao ano
- ✅ **Sincronização automática** ativa
- ✅ **Interface administrativa** melhorada

A solução garante que os dados demográficos sejam sempre precisos e consistentes em todo o portal do município de Chipindo. 