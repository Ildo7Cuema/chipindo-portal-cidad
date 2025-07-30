# 📏 Implementação dos Campos de Área Total

## 🎯 Problema Identificado

Na área administrativa do portal, não existia um campo configurável para inserir a área total do município em quilômetros quadrados. O valor estava hardcoded como "2.100" na página inicial.

## ✅ Solução Implementada

### 1. **Base de Dados**
- ✅ Adicionados campos `area_total_count` e `area_total_description` na tabela `site_settings`
- ✅ Valores padrão: "2.100" e "Quilómetros quadrados"

### 2. **Interface TypeScript**
- ✅ Atualizada interface `SiteSettings` no hook `useSiteSettings.ts`
- ✅ Adicionados campos com fallbacks para compatibilidade

### 3. **Área Administrativa**
- ✅ Adicionados campos na seção "Estatísticas" do `SiteContentManager`
- ✅ Interface intuitiva com ícones e validação

### 4. **Página Inicial**
- ✅ Atualizada para usar valores configuráveis em vez de hardcoded
- ✅ Fallback para valores padrão se não configurados

## 🚀 Como Implementar

### Passo 1: Executar Script SQL
Execute o seguinte script no SQL Editor do Supabase:

```sql
-- Adicionar campos de área total
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS area_total_count TEXT DEFAULT '2.100',
ADD COLUMN IF NOT EXISTS area_total_description TEXT DEFAULT 'Quilómetros quadrados';

-- Atualizar registros existentes
UPDATE public.site_settings 
SET 
  area_total_count = '2.100',
  area_total_description = 'Quilómetros quadrados'
WHERE id IS NOT NULL 
  AND (area_total_count IS NULL OR area_total_description IS NULL);
```

### Passo 2: Testar Implementação
Execute o script de teste:

```bash
node scripts/test-area-total-fields.js
```

### Passo 3: Configurar na Interface
1. Aceda à área administrativa do portal
2. Vá para **"Gestão de Conteúdo do Site"**
3. Na aba **"Página Inicial"**, procure pela seção **"Estatísticas"**
4. Configure os campos:
   - **Área Total (Número)**: Ex: "2.100"
   - **Área Total (Descrição)**: Ex: "Quilómetros quadrados"
5. Clique em **"Guardar Alterações"**

## 📋 Campos Adicionados

| Campo | Tipo | Descrição | Valor Padrão |
|-------|------|-----------|--------------|
| `area_total_count` | TEXT | Número da área total | "2.100" |
| `area_total_description` | TEXT | Descrição da unidade | "Quilómetros quadrados" |

## 🎨 Interface Administrativa

### Localização
- **Menu**: Administração → Gestão de Conteúdo do Site
- **Aba**: Página Inicial
- **Seção**: Estatísticas

### Campos Disponíveis
- **Área Total (Número)**: Campo de texto para inserir o valor
- **Área Total (Descrição)**: Campo de texto para a descrição/unit

### Validação
- ✅ Campos são opcionais
- ✅ Valores padrão são aplicados automaticamente
- ✅ Interface mostra status de modificação

## 🔧 Arquivos Modificados

1. **`supabase/migrations/20250725000006-add-area-total-fields.sql`**
   - Nova migração para adicionar campos

2. **`src/hooks/useSiteSettings.ts`**
   - Interface `SiteSettings` atualizada
   - Fallbacks para compatibilidade

3. **`src/components/admin/SiteContentManager.tsx`**
   - Campos adicionados na seção de estatísticas
   - Interface administrativa completa

4. **`src/pages/Index.tsx`**
   - Página inicial atualizada para usar valores configuráveis

5. **`scripts/apply-area-total-fields.sql`**
   - Script SQL para execução manual

6. **`scripts/test-area-total-fields.js`**
   - Script de teste para validar implementação

## 🎯 Resultado Final

Após a implementação, os administradores poderão:

- ✅ Configurar a área total do município através da interface administrativa
- ✅ Alterar tanto o valor numérico quanto a descrição
- ✅ Ver as alterações refletidas imediatamente na página inicial
- ✅ Manter valores padrão caso não sejam configurados

## 🔍 Verificação

Para verificar se a implementação está funcionando:

1. **Execute o script de teste**:
   ```bash
   node scripts/test-area-total-fields.js
   ```

2. **Verifique na interface administrativa**:
   - Aceda à área administrativa
   - Vá para "Gestão de Conteúdo do Site"
   - Confirme que os campos estão visíveis na seção "Estatísticas"

3. **Teste na página inicial**:
   - Altere os valores na área administrativa
   - Guarde as alterações
   - Verifique se os novos valores aparecem na página inicial

## 📝 Notas Importantes

- Os campos são opcionais e têm valores padrão
- A implementação é retrocompatível
- Não há necessidade de migração de dados existentes
- A interface administrativa é intuitiva e consistente com o resto do sistema 