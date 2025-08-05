# Correção do Erro: selectedConcurso.categorias_disponiveis.map is not a function

## Problema Identificado

O erro ocorria porque o campo `categorias_disponiveis` estava sendo retornado do banco de dados como uma **string** (`"[]"`) em vez de um **array** (`[]`). Quando o código tentava chamar `.map()` em uma string, gerava o erro:

```
selectedConcurso.categorias_disponiveis.map is not a function
```

## Causa Raiz

O PostgreSQL estava serializando o array `TEXT[]` como uma string JSON quando retornado via Supabase, em vez de manter o formato de array nativo.

## Solução Implementada

### 1. Função de Parsing

Criada uma função `parseCategoriasDisponiveis` que converte a string JSON de volta para array:

```typescript
const parseCategoriasDisponiveis = (categorias: any): string[] => {
  if (!categorias) return [];
  if (Array.isArray(categorias)) return categorias;
  if (typeof categorias === 'string') {
    try {
      const parsed = JSON.parse(categorias);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};
```

### 2. Aplicação da Função

A função foi aplicada em dois locais:

#### Frontend (src/pages/Concursos.tsx)
```typescript
const concursosWithCategories = data?.map((item, index) => ({
  ...item,
  category: getCategoryByIndex(index),
  views: Math.floor(Math.random() * 1000) + 50,
  applications: Math.floor(Math.random() * 200) + 10,
  categorias_disponiveis: parseCategoriasDisponiveis(item.categorias_disponiveis)
})) || [];
```

#### Admin (src/components/admin/ConcursosManager.tsx)
```typescript
const enrichedData = filteredData.map((item, index) => ({
  ...item,
  // ... outros campos
  categorias_disponiveis: parseCategoriasDisponiveis(item.categorias_disponiveis)
}));
```

### 3. Verificações de Segurança

Adicionadas verificações de segurança usando optional chaining (`?.`) e `Array.isArray()`:

```typescript
{selectedConcurso?.categorias_disponiveis && Array.isArray(selectedConcurso.categorias_disponiveis) && selectedConcurso.categorias_disponiveis.length > 0 ? (
  selectedConcurso.categorias_disponiveis.map((cat: string) => (
    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
  ))
) : (
  <div className="text-xs text-muted-foreground p-2">Nenhuma categoria cadastrada para este concurso.</div>
)}
```

## Arquivos Modificados

1. `src/pages/Concursos.tsx` - Adicionada função de parsing e verificações de segurança
2. `src/components/admin/ConcursosManager.tsx` - Adicionada função de parsing
3. `scripts/test-concursos-data.js` - Script de teste para verificar a correção

## Teste da Correção

O script de teste confirma que a correção funciona:

```bash
node scripts/test-concursos-data.js
```

**Resultado:**
- Raw value: `"[]"` (string)
- Parsed value: `[]` (array)
- ✅ categorias_disponiveis is now an array and can be mapped

## Prevenção Futura

Para evitar problemas similares, sempre verificar o tipo de dados retornados do banco de dados e implementar funções de parsing quando necessário para campos que deveriam ser arrays mas são retornados como strings. 