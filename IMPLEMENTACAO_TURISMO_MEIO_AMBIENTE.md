# Implementação do Setor de Turismo e Meio Ambiente

## Visão Geral

Este documento descreve a implementação completa do setor de Turismo e Meio Ambiente no Portal do Cidadão de Chipindo, incluindo:

- Página principal do setor com carrossel de imagens
- Área administrativa para gestão de conteúdo
- Estrutura de banco de dados
- Funcionalidades de carrossel de imagens turísticas e ambientais

## Estrutura Implementada

### 1. Banco de Dados

#### Migrações Criadas:

**20250725000012-create-turismo-meio-ambiente.sql**
- Adiciona o setor "Turismo e Meio Ambiente" à tabela `setores_estrategicos`
- Insere dados iniciais: estatísticas, programas, oportunidades, infraestruturas e contactos
- Configura cores e ícones específicos para o setor

**20250725000013-create-turismo-carousel.sql**
- Cria storage bucket `turismo-ambiente` para imagens
- Cria tabela `turismo_ambiente_carousel` com campos:
  - `id`: UUID primário
  - `title`: Título da imagem
  - `description`: Descrição da imagem
  - `image_url`: URL da imagem
  - `category`: Categoria (turismo/ambiente)
  - `location`: Localização da imagem
  - `active`: Status ativo/inativo
  - `order_index`: Ordem de exibição
  - `created_at`/`updated_at`: Timestamps

### 2. Frontend

#### Página Principal: `src/pages/TurismoMeioAmbiente.tsx`

**Características:**
- Carrossel principal com imagens turísticas e ambientais
- Seção de informações do setor (visão, missão)
- Estatísticas do setor
- Tabs organizadas:
  - **Programas**: Programas de turismo sustentável, conservação ambiental, formação turística
  - **Oportunidades**: Vagas para guias turísticos, gestores ambientais, rececionistas
  - **Infraestruturas**: Centros de informação, hotéis, parques naturais

**Funcionalidades:**
- Carrossel responsivo com navegação
- Modais para candidaturas e inscrições
- Filtros por categoria (turismo/ambiente)
- Informações de contacto integradas

#### Hook de Dados: `src/hooks/useTurismoMeioAmbienteData.ts`

**Interface:**
```typescript
export interface TurismoMeioAmbienteInfo {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  visao: string;
  missao: string;
  cor_primaria: string;
  cor_secundaria: string;
  icone: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface TurismoMeioAmbienteCarousel {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  location: string;
  active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}
```

**Funcionalidades:**
- Carregamento de dados do setor
- Busca de estatísticas, programas, oportunidades
- Gestão de imagens do carrossel
- Tratamento de erros e loading states

#### Componente Administrativo: `src/components/admin/TurismoAmbienteCarouselManager.tsx`

**Funcionalidades:**
- Upload de imagens para o storage bucket
- Gestão de categorias (turismo/ambiente)
- Filtros por status e categoria
- Visualização em grid/lista
- Edição inline de imagens
- Ativação/desativação de imagens
- Ordenação por ordem de exibição

**Interface:**
- Formulário completo para adicionar/editar imagens
- Pré-visualização de imagens
- Validação de campos obrigatórios
- Feedback visual com toasts

### 3. Integração na Área Administrativa

#### Adicionado ao Admin.tsx:
- Nova opção de navegação: "Carrossel Turismo"
- Ícone: ImageIcon
- Descrição: "Gerir carrossel turístico e ambiental"
- Integração com o componente TurismoAmbienteCarouselManager

## Dados Iniciais do Setor

### Estatísticas:
- Atrações Turísticas: 15
- Hotéis e Pousadas: 8
- Empregos no Turismo: 120
- Áreas Protegidas: 5
- Visitantes Anuais: 2.500
- Projetos Ambientais: 12

### Programas:
1. **Programa de Turismo Sustentável**
   - Benefícios: Formação, certificação, marketing, networking
   - Requisitos: Empresa turística, compromisso com sustentabilidade

2. **Programa de Conservação Ambiental**
   - Benefícios: Apoio técnico, recursos, formação, certificação verde
   - Requisitos: Projeto ambiental, impacto positivo

3. **Programa de Formação Turística**
   - Benefícios: Cursos gratuitos, certificação, estágios, inserção
   - Requisitos: Idade mínima 16 anos, ensino básico

### Oportunidades:
1. **Guia Turístico** (8 vagas)
2. **Gestor Ambiental** (3 vagas)
3. **Rececionista de Hotel** (12 vagas)

### Infraestruturas:
1. **Centro de Informação Turística** (50 visitantes/dia)
2. **Hotel Municipal** (80 hóspedes)
3. **Parque Natural Municipal** (200 visitantes/dia)
4. **Centro de Formação Turística** (100 formandos)

## Imagens Iniciais do Carrossel

### Turismo:
- Cascata do Chipindo
- Vista Panorâmica da Cidade
- Rio Chipindo

### Ambiente:
- Parque Natural Municipal
- Floresta Tropical
- Jardim Botânico

## Como Aplicar as Migrações

### Opção 1: Supabase Local
```bash
# Iniciar Supabase local
npx supabase start

# Aplicar migrações
npx supabase db push
```

### Opção 2: Supabase Cloud
```bash
# Conectar ao projeto
npx supabase link --project-ref YOUR_PROJECT_REF

# Aplicar migrações
npx supabase db push
```

### Opção 3: Manual via SQL
Executar as migrações diretamente no painel do Supabase:
1. `20250725000012-create-turismo-meio-ambiente.sql`
2. `20250725000013-create-turismo-carousel.sql`

## Rotas Implementadas

- **Página Principal**: `/turismo-meio-ambiente`
- **Área Administrativa**: Integrada no painel admin

## Funcionalidades do Carrossel

### Características:
- **Responsivo**: Adapta-se a diferentes tamanhos de ecrã
- **Navegação**: Botões anterior/próximo
- **Categorização**: Filtros por turismo/ambiente
- **Overlay**: Informações sobrepostas nas imagens
- **Fallback**: Imagens de placeholder em caso de erro

### Gestão Administrativa:
- **Upload**: Suporte para upload de imagens
- **Categorização**: Seleção turismo/ambiente
- **Ordenação**: Controle da ordem de exibição
- **Ativação**: Controle de visibilidade
- **Edição**: Modificação de títulos, descrições, localizações

## Consistência de Dados

### Estrutura de Dados:
- Todas as informações são gerenciadas via área administrativa
- Relacionamentos entre tabelas mantidos via foreign keys
- Timestamps automáticos para auditoria
- Soft deletes para preservação de dados

### Validações:
- Campos obrigatórios validados no frontend
- Verificações de tipo no backend
- Políticas de segurança (RLS) configuradas
- Controle de acesso baseado em roles

## Próximos Passos

1. **Aplicar Migrações**: Executar as migrações no banco de dados
2. **Testar Funcionalidades**: Verificar carrossel e área administrativa
3. **Adicionar Imagens**: Upload de imagens reais via painel admin
4. **Configurar Permissões**: Ajustar políticas de acesso conforme necessário
5. **Otimizar Performance**: Implementar lazy loading se necessário

## Notas Técnicas

- **Storage**: Bucket `turismo-ambiente` configurado para imagens
- **RLS**: Políticas de segurança implementadas
- **Types**: Interfaces TypeScript definidas para type safety
- **Error Handling**: Tratamento de erros em todas as operações
- **Loading States**: Indicadores de carregamento implementados

## Conclusão

A implementação do setor de Turismo e Meio Ambiente está completa e pronta para uso. O sistema oferece:

- Página pública atrativa com carrossel de imagens
- Área administrativa completa para gestão
- Estrutura de dados robusta e escalável
- Interface moderna e responsiva
- Funcionalidades de upload e gestão de imagens

O setor está integrado ao sistema existente e mantém a consistência com os outros setores estratégicos do portal. 