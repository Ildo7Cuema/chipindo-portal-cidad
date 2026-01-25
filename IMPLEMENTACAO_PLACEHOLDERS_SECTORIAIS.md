# Implementação de Placeholders Específicos por Setor

## Resumo da Implementação

Foi implementado um sistema de placeholders dinâmicos que se adaptam automaticamente ao setor do administrador logado, proporcionando exemplos e orientações específicas para cada área de atuação.

## Funcionalidades Implementadas

### 1. Sistema de Placeholders Dinâmicos

- **Detecção Automática**: Identifica o setor do administrador logado
- **Personalização**: Placeholders específicos para cada setor
- **Exemplos Relevantes**: Sugestões de cargos e categorias por área
- **Informações de Contacto**: Dados de contacto específicos do setor

### 2. Setores Suportados

#### Educação (`educacao`)
- **Título**: "Ex: Concurso Público para Professor de Matemática"
- **Área**: "Ex: Direcção de Educação e Ensino"
- **Descrição**: Foco em cargos de ensino e gestão educacional
- **Requisitos**: Licenciatura em Educação, experiência em ensino
- **Categorias**: Professor de Matemática, Professor de Português, Director de Escola
- **Salário**: 200.000 - 300.000 Kz

#### Saúde (`saude`)
- **Título**: "Ex: Concurso Público para Enfermeiro"
- **Área**: "Ex: Direcção de Saúde Pública"
- **Descrição**: Foco em cargos da área da saúde
- **Requisitos**: Licenciatura em Enfermagem, registro profissional
- **Categorias**: Enfermeiro, Médico, Técnico de Laboratório, Farmacêutico
- **Salário**: 250.000 - 350.000 Kz

#### Agricultura (`agricultura`)
- **Título**: "Ex: Concurso Público para Técnico Agrícola"
- **Área**: "Ex: Direcção de Agricultura e Desenvolvimento Rural"
- **Descrição**: Foco em cargos da área agrícola
- **Requisitos**: Licenciatura em Agronomia, experiência em extensão rural
- **Categorias**: Técnico Agrícola, Engenheiro Agrónomo, Extensionista Rural
- **Salário**: 180.000 - 250.000 Kz

#### Setor Mineiro (`sector-mineiro`)
- **Título**: "Ex: Concurso Público para Técnico de Minas"
- **Área**: "Ex: Direcção de Recursos Minerais"
- **Descrição**: Foco em cargos da área mineira
- **Requisitos**: Licenciatura em Engenharia de Minas, experiência em exploração
- **Categorias**: Técnico de Minas, Engenheiro de Minas, Geólogo
- **Salário**: 300.000 - 400.000 Kz

#### Desenvolvimento Económico (`desenvolvimento-economico`)
- **Título**: "Ex: Concurso Público para Economista"
- **Área**: "Ex: Direcção de Desenvolvimento Económico"
- **Descrição**: Foco em cargos da área económica
- **Requisitos**: Licenciatura em Economia, experiência em planeamento económico
- **Categorias**: Economista, Analista Económico, Técnico de Planeamento
- **Salário**: 250.000 - 350.000 Kz

#### Cultura (`cultura`)
- **Título**: "Ex: Concurso Público para Animador Cultural"
- **Área**: "Ex: Direcção de Cultura e Turismo"
- **Descrição**: Foco em cargos da área cultural
- **Requisitos**: Licenciatura em Artes ou Cultura, experiência em animação cultural
- **Categorias**: Animador Cultural, Técnico de Museu, Gestor Cultural
- **Salário**: 150.000 - 220.000 Kz

#### Tecnologia (`tecnologia`)
- **Título**: "Ex: Concurso Público para Técnico de Informática"
- **Área**: "Ex: Direcção de Tecnologia e Inovação"
- **Descrição**: Foco em cargos da área tecnológica
- **Requisitos**: Licenciatura em Informática, experiência em desenvolvimento
- **Categorias**: Técnico de Informática, Desenvolvedor, Analista de Sistemas
- **Salário**: 200.000 - 300.000 Kz

#### Energia e Água (`energia-agua`)
- **Título**: "Ex: Concurso Público para Técnico de Energia"
- **Área**: "Ex: Direcção de Energia e Águas"
- **Descrição**: Foco em cargos da área de energia e águas
- **Requisitos**: Licenciatura em Engenharia Electrotécnica, experiência em distribuição
- **Categorias**: Técnico de Energia, Técnico de Águas, Engenheiro Electrotécnico
- **Salário**: 220.000 - 320.000 Kz

### 3. Campos Personalizados

#### Título do Concurso
- Placeholder específico por setor
- Exemplos de cargos relevantes
- Formato padronizado

#### Direcção/Área Responsável
- Nome da direcção específica do setor
- Estrutura organizacional adequada

#### Descrição
- Orientações específicas por área
- Foco nas responsabilidades do setor

#### Requisitos
- Qualificações específicas do setor
- Experiências relevantes
- Certificações necessárias

#### Localização
- Locais de trabalho específicos do setor
- Instalações relevantes

#### Faixa Salarial
- Salários adequados ao setor
- Faixas salariais realistas

#### Informações de Contacto
- Contactos específicos do setor
- Emails institucionais
- Telefones da direcção

#### Categorias Disponíveis
- Sugestões de cargos específicos
- Categorias relevantes ao setor

## Implementação Técnica

### Função de Placeholders
```typescript
const getSectorPlaceholders = () => {
  const currentSector = getCurrentSector();
  const currentSectorName = getCurrentSectorName();
  
  const placeholders = {
    title: "Ex: Concurso Público para Professor de Educação Primária",
    area: "Ex: Direcção de Educação, Direcção de Saúde, etc.",
    description: "Descreva detalhadamente o concurso, suas finalidades e objectivos...",
    requirements: "Liste os requisitos necessários para o concurso...",
    contact_info: "Telefone, email, endereço para mais informações...",
    location: "Ex: Chipindo Sede",
    salary_range: "Ex: 150.000 - 200.000 Kz",
    nova_categoria: "Digite uma categoria (ex: Professor Primário, Enfermeiro, etc.)"
  };

  // Personalizar placeholders baseado no setor
  switch (currentSector) {
    case 'educacao':
      return {
        title: "Ex: Concurso Público para Professor de Matemática",
        area: "Ex: Direcção de Educação e Ensino",
        // ... outros campos específicos
      };
    // ... outros setores
    default:
      return placeholders;
  }
};
```

### Aplicação nos Campos
```typescript
<Input
  id="title"
  value={formData.title}
  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
  placeholder={sectorPlaceholders.title}
  className="h-10"
  required
/>
```

## Benefícios da Implementação

### 1. Experiência do Usuário
- **Relevância**: Placeholders específicos para cada setor
- **Orientação**: Exemplos práticos e realistas
- **Eficiência**: Reduz tempo de preenchimento

### 2. Consistência
- **Padronização**: Formato consistente entre setores
- **Qualidade**: Informações adequadas ao contexto
- **Profissionalismo**: Apresentação profissional

### 3. Especificidade
- **Cargos Relevantes**: Sugestões específicas por área
- **Salários Adequados**: Faixas salariais realistas
- **Contactos Corretos**: Informações de contacto específicas

### 4. Flexibilidade
- **Detecção Automática**: Identifica setor automaticamente
- **Fallback**: Placeholders genéricos para setores não mapeados
- **Extensibilidade**: Fácil adição de novos setores

## Arquivos Modificados

### `src/components/admin/ConcursosManager.tsx`
- ✅ Adicionada função `getSectorPlaceholders()`
- ✅ Implementados placeholders específicos para 8 setores
- ✅ Atualizados todos os campos do formulário
- ✅ Integração com sistema de controle de acesso

## Exemplos de Uso

### Administrador de Educação
- **Título**: "Ex: Concurso Público para Professor de Matemática"
- **Categorias**: Professor de Matemática, Professor de Português, Director de Escola
- **Salário**: 200.000 - 300.000 Kz

### Administrador de Saúde
- **Título**: "Ex: Concurso Público para Enfermeiro"
- **Categorias**: Enfermeiro, Médico, Técnico de Laboratório, Farmacêutico
- **Salário**: 250.000 - 350.000 Kz

### Administrador de Agricultura
- **Título**: "Ex: Concurso Público para Técnico Agrícola"
- **Categorias**: Técnico Agrícola, Engenheiro Agrónomo, Extensionista Rural
- **Salário**: 180.000 - 250.000 Kz

## Próximos Passos

1. **Validação Avançada**: Adicionar validação específica por setor
2. **Templates**: Criar templates pré-definidos por setor
3. **Histórico**: Manter histórico de concursos por setor
4. **Relatórios**: Relatórios específicos por setor
5. **Notificações**: Notificações personalizadas por setor 