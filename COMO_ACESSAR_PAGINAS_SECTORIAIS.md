# 🎯 Como Acessar as Páginas Setoriais - Portal Cidadão de Chipindo

## 🌐 **URLs Diretas das Páginas**

### **Servidor Local (Desenvolvimento):**
- **Base URL**: `http://localhost:8081/`

### **Páginas Setoriais:**
1. **Educação**: `http://localhost:8081/educacao`
2. **Saúde**: `http://localhost:8081/saude`
3. **Agricultura**: `http://localhost:8081/agricultura`
4. **Setor Mineiro**: `http://localhost:8081/sector-mineiro`
5. **Desenvolvimento Económico**: `http://localhost:8081/desenvolvimento-economico`
6. **Cultura**: `http://localhost:8081/cultura`
7. **Tecnologia**: `http://localhost:8081/tecnologia`
8. **Energia e Água**: `http://localhost:8081/energia-agua`

### **Páginas de Teste:**
- **Página de Teste**: `http://localhost:8081/test`
- **Educação Simplificada**: `http://localhost:8081/educacao-simple`
- **Serviços**: `http://localhost:8081/services`

---

## 🧭 **Como Navegar para as Páginas**

### **1. Pela Página Inicial (Mais Fácil)**
1. Acesse: `http://localhost:8081/`
2. Role para baixo até encontrar a seção **"Setores Estratégicos"**
3. Clique em qualquer card dos setores para acessar a página específica
4. Ou clique em **"Ver Todos os Serviços"** para ir à página de serviços

### **2. Pelo Menu de Navegação**
1. No cabeçalho do site, procure por **"Setores"** (dropdown)
2. Clique em **"Setores"** para abrir o menu dropdown
3. Selecione o setor desejado da lista

### **3. Pela Página de Serviços**
1. Acesse: `http://localhost:8081/services`
2. Role para baixo até a seção **"Setores Estratégicos"**
3. Clique nos cards dos setores para acessar as páginas

### **4. URLs Diretas**
- Digite diretamente no navegador qualquer uma das URLs listadas acima

---

## 📱 **Navegação Mobile**

### **Menu Mobile:**
1. Clique no ícone de menu (☰) no cabeçalho
2. Role para baixo até encontrar **"Setores Estratégicos"**
3. Clique no setor desejado

---

## 🎨 **O que Encontrar em Cada Página**

### **Conteúdo Padrão:**
- **Hero Section**: Título, subtítulo e descrição do setor
- **Visão e Missão**: Cards com informações estratégicas
- **Estatísticas**: Dados relevantes do setor
- **Programas**: Iniciativas e projetos ativos
- **Oportunidades**: Vagas de emprego e oportunidades
- **Infraestruturas**: Instalações e equipamentos
- **Contacto**: Informações de contacto do setor

### **Setores Específicos:**

#### **Educação** 📚
- 12 escolas primárias, 3 secundárias
- 156 professores, 2.847 estudantes
- Programas de alfabetização e bolsas de estudo

#### **Saúde** 🏥
- 8 unidades de saúde
- 89 profissionais, 3.245 consultas mensais
- Programas de vacinação e saúde mental

#### **Agricultura** 🌾
- 1.245 agricultores
- 8.750 hectares cultivados
- Programas de modernização agrícola

#### **Setor Mineiro** ⛏️
- 8 minas ativas
- 450 empregos diretos
- Recursos: ouro, diamantes, cobre

#### **Desenvolvimento Económico** 📈
- 245 empresas registadas
- 1.850 empregos criados
- 25M USD de investimento

#### **Cultura** 🎭
- 25 grupos culturais
- 48 eventos anuais
- 156 artistas registados

#### **Tecnologia** 💻
- 15 startups tech
- 89 profissionais IT
- 32 projetos digitais

#### **Energia e Água** ⚡💧
- 78% cobertura elétrica
- 65% cobertura de água
- 12.450 consumidores

---

## 🔧 **Solução de Problemas**

### **Se as páginas não carregarem:**

#### **1. Verificar Servidor**
```bash
# Verificar se o servidor está rodando
npm run dev
```

#### **2. Verificar Console do Navegador**
- Pressione F12 para abrir DevTools
- Vá para a aba "Console"
- Verifique se há erros

#### **3. Usar Páginas de Teste**
- Acesse: `http://localhost:8081/test`
- Use os links da página de teste

#### **4. Usar Páginas Simplificadas**
- Acesse: `http://localhost:8081/educacao-simple`
- Teste a versão simplificada

### **Problemas Comuns:**

#### **Erro 404:**
- Verificar se a URL está correta
- Verificar se o servidor está rodando

#### **Página em Branco:**
- Verificar console do navegador
- Verificar se há erros de JavaScript

#### **Página não Responsiva:**
- Verificar se está acessando pelo localhost correto
- Verificar se o build foi bem-sucedido

---

## 📋 **Checklist de Teste**

- [ ] Servidor rodando em `http://localhost:8081/`
- [ ] Página inicial carrega corretamente
- [ ] Seção "Setores Estratégicos" visível na página inicial
- [ ] Menu dropdown "Setores" funciona
- [ ] Página de serviços carrega
- [ ] Todas as 8 páginas setoriais acessíveis
- [ ] Navegação mobile funciona
- [ ] Links funcionam corretamente

---

## 🎯 **Resumo das Localizações**

### **Principais Pontos de Acesso:**
1. **Página Inicial** → Seção "Setores Estratégicos"
2. **Menu de Navegação** → Dropdown "Setores"
3. **Página de Serviços** → Seção "Setores Estratégicos"
4. **URLs Diretas** → Digite no navegador

### **URLs de Teste:**
- **Teste Geral**: `http://localhost:8081/test`
- **Educação Simplificada**: `http://localhost:8081/educacao-simple`

---

**Status**: ✅ Páginas implementadas e acessíveis
**Servidor**: `http://localhost:8081/`
**Próximo**: 🧪 Testar todas as funcionalidades 