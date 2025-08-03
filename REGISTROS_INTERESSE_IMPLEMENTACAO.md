# Implementação de Registros de Interesse e Notificações

## Visão Geral

Esta implementação adiciona funcionalidades completas para gerenciar registros de interesse e programas na área administrativa, incluindo:

1. **Gestão de Registros de Interesse**: Visualização, filtros e busca de registros
2. **Sistema de Notificações**: Notificações automáticas para novos registros
3. **Exportação de Listas**: Exportação organizada de dados em diferentes formatos
4. **Estatísticas**: Dashboard com métricas importantes

## Componentes Criados

### 1. InterestRegistrationsManager
**Arquivo**: `src/components/admin/InterestRegistrationsManager.tsx`

**Funcionalidades**:
- Dashboard com estatísticas (total, este mês, esta semana, hoje, notificações)
- Lista de registros com filtros por área e busca
- Visualização de notificações automáticas
- Interface responsiva e moderna

**Características**:
- Filtros por área de interesse
- Busca por nome, email ou profissão
- Estatísticas em tempo real
- Notificações não lidas destacadas

### 2. ExportRegistrationsList
**Arquivo**: `src/components/admin/ExportRegistrationsList.tsx`

**Funcionalidades**:
- Exportação em CSV, Excel e PDF
- Filtros avançados (área, data, campos específicos)
- Seleção de campos a exportar
- Nomes de arquivo automáticos com timestamp

**Filtros Disponíveis**:
- Área de interesse
- Período de data
- Registros com telefone
- Registros com profissão
- Registros com termos aceites

## Estrutura do Banco de Dados

### Tabela: interest_registrations
```sql
CREATE TABLE public.interest_registrations (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  profession TEXT,
  experience_years INTEGER,
  areas_of_interest TEXT[] NOT NULL,
  additional_info TEXT,
  terms_accepted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Tabela: admin_notifications
```sql
CREATE TABLE public.admin_notifications (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Como Usar

### 1. Acessar a Área Administrativa
1. Faça login como administrador
2. Navegue para a área administrativa
3. Clique em "Registros de Interesse" na seção "Dados"

### 2. Visualizar Registros
- **Dashboard**: Veja estatísticas gerais no topo
- **Filtros**: Use os filtros para encontrar registros específicos
- **Busca**: Digite nomes, emails ou profissões para buscar
- **Detalhes**: Clique nos registros para ver informações completas

### 3. Gerenciar Notificações
- **Tab Notificações**: Veja todas as notificações automáticas
- **Marcar como lida**: Clique no ícone de check para marcar como lida
- **Filtros**: As notificações não lidas são destacadas

### 4. Exportar Listas
1. Clique no botão "Exportar Lista"
2. Configure o formato (CSV, Excel, PDF)
3. Selecione os filtros desejados
4. Escolha os campos a exportar
5. Clique em "Exportar"

## Configuração do Banco de Dados

### Executar Script SQL
Execute o script `scripts/create-interest-registrations-tables.sql` no Supabase:

1. Acesse o Supabase Dashboard
2. Vá para SQL Editor
3. Cole e execute o script completo

### Verificar Configuração
O script irá:
- Criar as tabelas necessárias
- Configurar políticas de segurança (RLS)
- Criar triggers para notificações automáticas
- Mostrar estatísticas das tabelas criadas

## Áreas de Interesse Suportadas

O sistema suporta as seguintes áreas:
- Agricultura
- Educação
- Saúde
- Tecnologia
- Cultura
- Turismo
- Meio Ambiente
- Desenvolvimento Económico
- Energia e Água
- Sector Mineiro
- Programas

## Funcionalidades de Notificação

### Notificações Automáticas
- **Trigger**: Criado automaticamente quando um novo registro é inserido
- **Conteúdo**: Inclui dados do registro (nome, email, áreas de interesse)
- **Status**: Marcadas como não lidas por padrão

### Tipos de Notificação
- `interest_registration`: Novos registros de interesse
- `new_user`: Novos utilizadores (futuro)
- `news_published`: Notícias publicadas (futuro)
- `concurso_created`: Concursos criados (futuro)

## Exportação de Dados

### Formatos Suportados
1. **CSV**: Formato padrão para planilhas
2. **Excel**: Formato .xls para Excel
3. **PDF**: Formato texto para impressão

### Campos Exportáveis
- Nome Completo
- Email
- Telefone
- Profissão
- Anos de Experiência
- Áreas de Interesse
- Informações Adicionais
- Termos Aceites
- Data de Registro

## Segurança e Permissões

### Políticas RLS (Row Level Security)
- **Inserção**: Qualquer pessoa pode inserir registros
- **Visualização**: Apenas administradores podem ver todos os registros
- **Atualização**: Apenas administradores podem atualizar
- **Exclusão**: Apenas administradores podem excluir

### Notificações
- Apenas administradores podem gerenciar notificações
- Notificações são criadas automaticamente via triggers

## Integração com o Sistema

### Navegação
O componente foi integrado ao menu administrativo em:
- **Categoria**: Dados
- **Ícone**: Users
- **Rota**: `/admin` → Tab "Registros de Interesse"

### Responsividade
- Interface adaptável para desktop e mobile
- Componentes responsivos do sistema existente
- Scroll areas para listas longas

## Manutenção e Monitoramento

### Estatísticas Importantes
- Total de registros
- Registros deste mês
- Registros desta semana
- Registros de hoje
- Notificações não lidas

### Limpeza de Dados
- Registros podem ser excluídos individualmente
- Notificações antigas podem ser marcadas como lidas
- Exportação para backup de dados

## Próximas Melhorias

### Funcionalidades Futuras
1. **Email Automático**: Envio de confirmação por email
2. **Relatórios Avançados**: Gráficos e análises
3. **Integração com CRM**: Sincronização com sistemas externos
4. **Notificações Push**: Notificações em tempo real
5. **Templates de Exportação**: Formatos personalizados

### Melhorias Técnicas
1. **Cache**: Implementar cache para melhor performance
2. **Pagininação**: Para listas muito grandes
3. **Busca Avançada**: Filtros mais complexos
4. **API REST**: Endpoints para integração externa

## Troubleshooting

### Problemas Comuns

1. **Erro de RLS**:
   - Verifique se as políticas foram criadas corretamente
   - Execute o script SQL novamente

2. **Notificações não aparecem**:
   - Verifique se o trigger foi criado
   - Teste inserindo um novo registro

3. **Exportação falha**:
   - Verifique se há dados para exportar
   - Teste com filtros menos restritivos

### Logs e Debug
- Use o console do navegador para ver erros
- Verifique os logs do Supabase
- Teste as queries diretamente no SQL Editor

## Correções Implementadas

### 1. Funcionalidade de Eliminação
- **Eliminação Individual**: Cada registro pode ser eliminado através do menu de ações
- **Eliminação em Massa**: Seleção múltipla com checkboxes para eliminar vários registros
- **Confirmação**: Modais de confirmação para evitar eliminações acidentais
- **Feedback**: Notificações de sucesso/erro após eliminação

### 2. Correção dos Filtros por Área
- **Problema Identificado**: Filtros não funcionavam corretamente devido a inconsistências nos dados
- **Solução Implementada**: 
  - Busca case-insensitive nos filtros
  - Verificação de arrays vazios ou nulos
  - Padronização de nomes de áreas
- **Scripts de Correção**: 
  - `scripts/fix-area-filters-simple.sql`: Script simples e seguro (RECOMENDADO)
  - `scripts/fix-area-filters.sql`: Script completo (se necessário)
  - `scripts/test-area-filters.js`: Testa e diagnostica problemas

### 3. Melhorias na Interface
- **Checkboxes**: Seleção múltipla de registros
- **Menu de Ações**: Dropdown com opções para cada registro
- **Botões de Eliminação**: Visíveis apenas quando há seleções
- **Modal de Detalhes**: Visualização completa de cada registro

## Como Aplicar as Correções

### 1. Executar Script de Correção
```sql
-- Execute no Supabase SQL Editor
-- Use o script simples e seguro:
\i scripts/fix-area-filters-simple.sql

-- OU execute diretamente o conteúdo do script
-- (copie e cole o conteúdo de scripts/fix-area-filters-simple.sql)
```

### 2. Verificar Resultados
- Os filtros por área devem funcionar corretamente
- Todos os registros devem ter pelo menos uma área de interesse
- Nomes das áreas devem estar padronizados

### 3. Testar Funcionalidades
- Testar filtros por diferentes áreas
- Testar eliminação individual e em massa
- Verificar se as notificações aparecem corretamente
- **Testar exportação com filtros** (corrigido)

### 4. Problema de Exportação Resolvido
- **Problema**: Exportação não encontrava registros mesmo com dados existentes
- **Causa**: Diferença entre lógica de filtro do componente principal e exportação
- **Solução**: Unificada a lógica de filtro usando busca case-insensitive no frontend
- **Script de teste**: `scripts/test-export-filters.js` para diagnosticar problemas
- **Debug melhorado**: Logs detalhados no console e botão de teste no modal

### 5. Como Debuggar Problemas de Exportação

#### Passo 1: Verificar Dados no Banco
```sql
-- Execute no Supabase SQL Editor
\i scripts/verify-export-data.sql
```

#### Passo 2: Usar Botão de Teste
1. Abra o modal de exportação
2. Configure os filtros desejados
3. Clique no botão "Testar"
4. Verifique o console do navegador

#### Passo 3: Verificar Logs de Exportação
1. Abra o console do navegador (F12)
2. Tente exportar com filtros
3. Verifique os logs detalhados

#### Passo 4: Problemas Comuns
- **Caracteres especiais**: Verificar se "Saúde" está escrito corretamente
- **Case sensitivity**: O filtro agora é case-insensitive
- **Arrays vazios**: Registros sem áreas são marcados como "Programa"
- **Nomes de áreas**: "Setor de Saúde" vs "Saúde" - use o script de padronização

#### Passo 5: Padronizar Nomes das Áreas
Se os filtros não funcionarem, execute este script no Supabase SQL Editor:
```sql
\i scripts/fix-area-names.sql
```

Este script padroniza:
- "Setor de Saúde" → "Saúde"
- "Administração Pública" → "Administração"  
- "Tecnologias de Informação" → "Tecnologia"

### 6. Integração com Gestão de Direcções

#### Áreas Dinâmicas
- **Fonte**: As áreas nos dropdowns agora vêm da tabela `departamentos`
- **Gestão**: Use a página "Gestão de Direcções" para adicionar/editar áreas
- **Sincronização**: Todas as páginas usam as mesmas áreas automaticamente

#### Componentes Atualizados
- `ExportRegistrationsList`: Usa áreas da tabela `departamentos`
- `InterestRegistrationsManager`: Usa áreas da tabela `departamentos`
- `RegisterInterest`: Usa áreas da tabela `departamentos`
- `CandidaturaForm`: Usa áreas da tabela `departamentos`

#### Hook Centralizado
- `useInterestAreas`: Busca áreas da tabela `departamentos`
- Converte automaticamente `departamentos` para formato de áreas
- Filtra apenas direcções ativas (`ativo = true`)

## Conclusão

Esta implementação fornece uma solução completa para gerenciar registros de interesse e programas, com interface moderna, funcionalidades avançadas de exportação, sistema de notificações automáticas e funcionalidades completas de eliminação. O sistema é escalável e pode ser facilmente estendido para incluir novas funcionalidades conforme necessário.

### ✅ **Funcionalidades Implementadas:**
- ✅ Gestão completa de registros de interesse
- ✅ Sistema de notificações automáticas
- ✅ Exportação em múltiplos formatos
- ✅ **Eliminação individual e em massa**
- ✅ **Filtros por área corrigidos**
- ✅ Interface responsiva e moderna
- ✅ Estatísticas em tempo real 