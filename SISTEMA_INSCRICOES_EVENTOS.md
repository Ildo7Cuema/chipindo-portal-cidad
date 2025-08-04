# Sistema de Inscrições em Eventos - Portal de Chipindo

## 📋 Visão Geral

O sistema de inscrições em eventos permite que os cidadãos se inscrevam em eventos municipais através de um modal interativo, com gestão completa na área administrativa.

## 🏗️ Arquitetura do Sistema

### 1. Base de Dados

#### **Tabela: event_registrations**
```sql
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    participant_name VARCHAR(255) NOT NULL,
    participant_email VARCHAR(255) NOT NULL,
    participant_phone VARCHAR(100),
    participant_age INTEGER,
    participant_gender VARCHAR(50),
    participant_address TEXT,
    participant_occupation VARCHAR(255),
    participant_organization VARCHAR(255),
    special_needs TEXT,
    dietary_restrictions TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(100),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Índices e Constraints**
- Índice único: `(event_id, participant_email)` - Evita inscrições duplicadas
- Índices de performance para busca e filtros
- RLS (Row Level Security) configurado

### 2. Funções RPC

#### **register_for_event()**
- Registra um participante em um evento
- Valida disponibilidade de vagas
- Previne inscrições duplicadas
- Atualiza contador de participantes

#### **get_event_registrations()**
- Lista inscrições com filtros
- Suporte para filtros por evento e status

#### **update_registration_status()**
- Atualiza status da inscrição
- Gerencia contadores automaticamente

## 🎨 Interface do Usuário

### 1. Modal de Inscrição (`EventRegistrationModal`)

#### **Características:**
- **Design responsivo** e moderno
- **Processo em 3 etapas** para melhor UX
- **Validação em tempo real** dos campos
- **Indicadores visuais** de vagas disponíveis

#### **Etapas do Formulário:**

**Etapa 1: Informações Pessoais**
- Nome completo (obrigatório)
- Email (obrigatório)
- Telefone (obrigatório)
- Endereço (opcional)

**Etapa 2: Informações Adicionais**
- Idade (obrigatório)
- Género (obrigatório)
- Profissão/Ocupação (obrigatório)
- Organização/Instituição (opcional)
- Contacto de emergência (opcional)
- Necessidades especiais (opcional)
- Restrições alimentares (opcional)

**Etapa 3: Confirmação e Termos**
- Resumo da inscrição
- Aceitação de termos e condições
- Autorização para comunicações
- Informações importantes

#### **Funcionalidades:**
- **Progress indicator** visual
- **Validação por etapa**
- **Navegação entre etapas**
- **Confirmação final**
- **Feedback visual** de sucesso/erro

### 2. Página de Eventos Atualizada

#### **Melhorias Implementadas:**
- **Botão "Participar"** abre modal de inscrição
- **Contadores de vagas** em tempo real
- **Status de lotação** dos eventos
- **Indicadores visuais** de disponibilidade

#### **Estados do Botão:**
- **"Participar"** - Evento com vagas disponíveis
- **"Evento Lotado"** - Evento sem vagas
- **Desabilitado** - Quando não há vagas

## 🔧 Área Administrativa

### 1. Gestor de Inscrições (`EventRegistrationsManager`)

#### **Funcionalidades Principais:**

**Dashboard de Estatísticas**
- Total de inscrições
- Inscrições confirmadas
- Inscrições pendentes
- Inscrições canceladas
- Participantes presentes

**Filtros e Busca**
- Pesquisa por nome, email ou telefone
- Filtro por status da inscrição
- Filtro por evento específico

**Gestão de Inscrições**
- Visualização detalhada de cada inscrição
- Atualização de status (Pendente → Confirmado → Presente)
- Adição de notas administrativas
- Envio de notificações aos participantes

**Exportação de Dados**
- Exportação em CSV
- Relatórios personalizados
- Dados para análise

#### **Status de Inscrições:**
- **Pendente** - Inscrição realizada, aguardando confirmação
- **Confirmado** - Inscrição aprovada pela administração
- **Cancelado** - Inscrição cancelada
- **Presente** - Participante compareceu ao evento

### 2. Notificações Automáticas

#### **Tipos de Notificação:**
- **Confirmação de inscrição** - Email automático
- **Lembrete do evento** - 24h antes
- **Alterações no evento** - Mudanças de data/local
- **Cancelamento** - Quando aplicável

## 🔒 Segurança e Privacidade

### 1. Row Level Security (RLS)
- **Público**: Pode visualizar apenas inscrições confirmadas
- **Participantes**: Podem atualizar suas próprias inscrições
- **Administradores**: Acesso completo a todas as inscrições

### 2. Validação de Dados
- **Validação no frontend** para UX
- **Validação no backend** para segurança
- **Sanitização** de inputs
- **Prevenção de SQL injection**

### 3. Proteção de Privacidade
- **Dados pessoais** protegidos por RLS
- **Consentimento explícito** para tratamento de dados
- **Política de privacidade** integrada
- **Direito de cancelamento** de inscrição

## 📊 Relatórios e Analytics

### 1. Métricas Disponíveis
- **Taxa de conversão** (visualizações → inscrições)
- **Taxa de presença** (inscritos → presentes)
- **Distribuição por idade e género**
- **Eventos mais populares**
- **Tendências temporais**

### 2. Exportação de Dados
- **Formato CSV** para análise externa
- **Filtros personalizáveis**
- **Dados anonimizados** para relatórios públicos

## 🚀 Implementação

### 1. Arquivos Criados/Modificados

#### **Novos Arquivos:**
- `src/components/ui/event-registration-modal.tsx`
- `src/components/admin/EventRegistrationsManager.tsx`
- `supabase/migrations/20250125000012-create-event-registrations.sql`
- `scripts/apply-event-registrations-migration.js`

#### **Arquivos Modificados:**
- `src/pages/Events.tsx` - Integração do modal
- `supabase/migrations/20250725000011-create-events-table.sql` - Atualização da tabela events

### 2. Como Aplicar as Migrações

```bash
# Aplicar migração das inscrições
node scripts/apply-event-registrations-migration.js

# Ou executar manualmente no Supabase
# 1. Acessar o dashboard do Supabase
# 2. Ir para SQL Editor
# 3. Executar o conteúdo de 20250125000012-create-event-registrations.sql
```

### 3. Configuração do Frontend

```tsx
// Importar o modal na página de eventos
import EventRegistrationModal from "@/components/ui/event-registration-modal";

// Usar o componente
<EventRegistrationModal
  event={selectedEvent}
  isOpen={showRegistrationModal}
  onClose={() => setShowRegistrationModal(false)}
  onRegistrationSuccess={handleRegistrationSuccess}
/>
```

## 🎯 Benefícios do Sistema

### 1. Para os Cidadãos
- **Processo simples** e intuitivo
- **Confirmação imediata** da inscrição
- **Informações claras** sobre o evento
- **Flexibilidade** para necessidades especiais

### 2. Para a Administração
- **Gestão centralizada** das inscrições
- **Controle de capacidade** dos eventos
- **Comunicação direta** com participantes
- **Relatórios detalhados** para planeamento

### 3. Para o Município
- **Maior participação** nos eventos
- **Dados demográficos** dos participantes
- **Otimização** de recursos
- **Transparência** na gestão de eventos

## 🔮 Funcionalidades Futuras

### 1. Melhorias Planeadas
- **Sistema de fila de espera** para eventos lotados
- **Inscrições em grupo** para organizações
- **Integração com WhatsApp** para notificações
- **QR Code** para check-in no evento
- **Certificados digitais** de participação

### 2. Integrações
- **Sistema de pagamentos** para eventos pagos
- **Integração com redes sociais** para divulgação
- **API pública** para parceiros
- **Sincronização** com calendários externos

## 📞 Suporte e Manutenção

### 1. Monitorização
- **Logs de inscrições** para auditoria
- **Alertas automáticos** para problemas
- **Métricas de performance** em tempo real

### 2. Backup e Recuperação
- **Backup automático** diário dos dados
- **Recuperação de dados** em caso de falha
- **Versionamento** das migrações

### 3. Documentação
- **Guia do usuário** para administradores
- **Documentação técnica** para desenvolvedores
- **FAQ** para participantes

---

**Sistema desenvolvido para o Portal de Chipindo - Administração Municipal** 