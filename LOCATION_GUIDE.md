# 📍 Guia de Configuração de Localizações Municipais

## 🗄️ Estrutura da Tabela `municipality_locations`

A tabela `municipality_locations` já está criada e deve ser preenchida pelos administradores com as coordenadas precisas dos locais municipais.

### 📋 Campos Obrigatórios

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `name` | TEXT | Nome da localização | "Administração Municipal" |
| `latitude` | DECIMAL | Coordenada de latitude (WGS84) | -15.1167 |
| `longitude` | DECIMAL | Coordenada de longitude (WGS84) | 12.9167 |
| `type` | TEXT | Tipo da localização | "administrativo" |
| `active` | BOOLEAN | Se a localização está ativa | true |

### 📋 Campos Opcionais

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `description` | TEXT | Descrição detalhada |
| `address` | TEXT | Endereço completo |
| `phone` | TEXT | Telefone de contacto |
| `email` | TEXT | Email de contacto |
| `opening_hours` | TEXT | Horário de funcionamento |

## 🎯 Tipos de Localização Suportados

- `administrativo` - Prédios da administração municipal
- `servicos` - Centros de atendimento ao cidadão
- `saude` - Hospitais, centros de saúde, postos médicos
- `educacao` - Escolas, universidades, bibliotecas
- `seguranca` - Posto policial, bombeiros, defesa civil

## 📊 Exemplos de Inserção

```sql
-- Administração Municipal Principal
INSERT INTO municipality_locations (
  name, 
  description, 
  latitude, 
  longitude, 
  type, 
  address, 
  phone, 
  email, 
  opening_hours, 
  active
) VALUES (
  'Administração Municipal de Chipindo',
  'Sede principal da administração municipal',
  -15.1167,
  12.9167,
  'administrativo',
  'Rua Principal, Bairro Central, Chipindo',
  '+244 XXX XXX XXX',
  'admin@chipindo.gov.ao',
  'Segunda a Sexta: 08:00 - 16:00',
  true
);

-- Hospital Municipal
INSERT INTO municipality_locations (
  name, 
  description, 
  latitude, 
  longitude, 
  type, 
  address, 
  phone, 
  opening_hours, 
  active
) VALUES (
  'Hospital Municipal de Chipindo',
  'Principal unidade de saúde do município',
  -15.1200,
  12.9200,
  'saude',
  'Rua da Saúde, Bairro Médico, Chipindo',
  '+244 XXX XXX XXX',
  '24 horas - Emergências',
  true
);

-- Escola Primária Central
INSERT INTO municipality_locations (
  name, 
  latitude, 
  longitude, 
  type, 
  address, 
  active
) VALUES (
  'Escola Primária Central',
  -15.1150,
  12.9180,
  'educacao',
  'Rua das Escolas, Bairro Educacional, Chipindo',
  true
);
```

## 🔍 Como Obter Coordenadas Precisas

### 1. **Google Maps**
1. Acesse [Google Maps](https://maps.google.com)
2. Procure o local desejado
3. Clique com o botão direito no ponto exato
4. Copie as coordenadas que aparecem

### 2. **GPS Mobile**
- Use aplicativos como GPS Essentials ou Compass
- Vá até o local físico
- Anote as coordenadas precisas

### 3. **Ferramentas Online**
- [LatLong.net](https://www.latlong.net/)
- [GPS Coordinates](https://www.gps-coordinates.net/)

## 🎯 Funcionalidades da Nova Interface

### 📍 **Mapa Interativo Simplificado**
- Visualização em tempo real das localizações cadastradas sem necessidade de API externa
- Marcadores clicáveis com informações detalhadas baseados nas coordenadas GPS
- Sistema de zoom e navegação próprio usando Canvas HTML5
- Não requer API Key do Mapbox ou outras dependências externas

### 🔍 **Sistema de Busca**
- Busca por nome da localização
- Busca por coordenadas (latitude, longitude)
- Busca por endereço
- Filtros por tipo de localização

### 📊 **Estatísticas em Tempo Real**
- Total de localizações cadastradas
- Número de localizações ativas
- Quantidade de tipos diferentes

### 🏷️ **Cards Interativos**
- Cards clicáveis para cada localização
- Informações completas: coordenadas, telefone, horários
- Botões para direções e contacto direto

## ⚙️ **Para Administradores**

### ✅ **Checklist de Configuração**
- [ ] Verificar se a tabela `municipality_locations` existe
- [ ] Cadastrar localização principal da administração
- [ ] Adicionar principais serviços públicos
- [ ] Configurar coordenadas precisas (6 casas decimais)
- [ ] Testar funcionalidade no mapa
- [ ] Verificar informações de contacto

### 🔧 **Comandos Úteis**

```sql
-- Verificar localizações cadastradas
SELECT name, latitude, longitude, type, active 
FROM municipality_locations 
ORDER BY type, name;

-- Atualizar coordenadas
UPDATE municipality_locations 
SET latitude = -15.1167, longitude = 12.9167 
WHERE name = 'Administração Municipal de Chipindo';

-- Ativar/Desativar localização
UPDATE municipality_locations 
SET active = false 
WHERE id = 'id-da-localizacao';
```

## 🌟 **Benefícios da Implementação**

### 👥 **Para os Cidadãos**
- Encontrar facilmente os serviços municipais
- Coordenadas precisas para GPS
- Informações de contacto atualizadas
- Horários de funcionamento claros

### 🏛️ **Para a Administração**
- Melhor organização das informações
- Atualização centralizada de dados
- Controle de visibilidade das localizações
- Estatísticas de uso dos serviços

## 📱 **Compatibilidade**

- ✅ Sistemas GPS (Google Maps, Waze, etc.)
- ✅ Dispositivos móveis e desktop
- ✅ Coordenadas padrão WGS84
- ✅ Integração com aplicativos de navegação
- ✅ Funciona sem APIs externas ou conexão com serviços de terceiros
- ✅ Renderização local usando Canvas HTML5

## 🎨 **Vantagens do Sistema Simplificado**

### 🚀 **Performance**
- **Carregamento Instantâneo**: Sem dependência de APIs externas
- **Sem Limitações**: Não há limite de visualizações ou requisições
- **Offline Ready**: Funciona mesmo com conexão limitada
- **Leve**: Não carrega bibliotecas pesadas de mapas

### 🔒 **Privacidade e Segurança**
- **Sem Rastreamento**: Não envia dados para serviços externos
- **Dados Locais**: Todas as informações ficam no seu servidor
- **Sem API Keys**: Não necessita configuração de chaves externas
- **Controle Total**: Sistema completamente autônomo

### 💰 **Económico**
- **Sem Custos**: Não há taxas de uso de APIs
- **Escalável**: Funciona independente do número de usuários
- **Manutenção Simples**: Sem dependências externas para gerir

## 🆘 **Suporte**

Para dúvidas sobre configuração:
1. Consulte a documentação técnica
2. Contacte o suporte técnico
3. Verifique os logs do sistema

---

## 🚀 **Instruções de Uso**

### 👤 **Para Cidadãos**
1. **Visualizar Localizações**: O mapa mostra automaticamente todas as localizações cadastradas
2. **Interagir com Marcadores**: Clique nos ícones coloridos para ver detalhes
3. **Zoom e Navegação**: Use os botões de zoom (+/-) e o botão de reset
4. **Ver Informações**: Use o botão "Mostrar/Ocultar Info" para ver detalhes
5. **Legenda**: Consulte a legenda no canto superior esquerdo para entender os tipos

### ⚙️ **Para Administradores**
1. **Cadastrar Localizações**: Insira dados na tabela `municipality_locations`
2. **Coordenadas Precisas**: Use pelo menos 4 casas decimais para precisão
3. **Teste Imediato**: As alterações aparecem automaticamente no mapa
4. **Sem Configuração**: O sistema funciona sem qualquer configuração adicional

### 📝 **Notas Importantes**
- ✅ **Sem API Keys**: O sistema não precisa de chaves externas
- ✅ **Instantâneo**: Mudanças no banco aparecem imediatamente
- ✅ **Offline**: Funciona sem internet (após carregamento inicial)
- ✅ **Rápido**: Renderização local usando Canvas HTML5

---

*Este guia garante que todas as localizações municipais sejam exibidas corretamente no mapa interativo simplificado da página de contactos.* 