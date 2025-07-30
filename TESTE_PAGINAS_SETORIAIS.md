# Teste das Páginas Setoriais - Portal Cidadão de Chipindo

## 🚀 Como Testar as Páginas

### 1. **Iniciar o Servidor de Desenvolvimento**
```bash
npm run dev
```

### 2. **URLs para Teste**

#### **Página de Teste Principal:**
- **URL**: `http://localhost:5173/test`
- **Descrição**: Página simples com links para todas as páginas setoriais

#### **Página de Serviços (com Setores Estratégicos):**
- **URL**: `http://localhost:5173/services`
- **Descrição**: Página principal de serviços com seção de setores estratégicos

#### **Páginas Setoriais Completas:**
1. **Educação**: `http://localhost:5173/educacao`
2. **Saúde**: `http://localhost:5173/saude`
3. **Agricultura**: `http://localhost:5173/agricultura`
4. **Setor Mineiro**: `http://localhost:5173/sector-mineiro`
5. **Desenvolvimento Económico**: `http://localhost:5173/desenvolvimento-economico`
6. **Cultura**: `http://localhost:5173/cultura`
7. **Tecnologia**: `http://localhost:5173/tecnologia`
8. **Energia e Água**: `http://localhost:5173/energia-agua`

#### **Página Simplificada (para teste):**
- **Educação Simplificada**: `http://localhost:5173/educacao-simple`

### 3. **Problemas Identificados e Soluções**

#### **Problema**: Páginas não carregam
**Possíveis Causas:**
1. **MaintenanceMode**: Pode estar bloqueando o acesso
2. **Dependências do Supabase**: Hooks que dependem de conexão com banco
3. **Componentes complexos**: Header/Footer com dependências

#### **Soluções Implementadas:**
1. ✅ **MaintenanceMode desabilitado** temporariamente
2. ✅ **Footer simplificado** sem dependências do Supabase
3. ✅ **Páginas de teste** criadas para verificação

### 4. **Verificação de Funcionamento**

#### **Teste 1: Página de Teste**
- Acesse: `http://localhost:5173/test`
- Deve mostrar links para todas as páginas setoriais
- Clique nos links para testar navegação

#### **Teste 2: Página Simplificada**
- Acesse: `http://localhost:5173/educacao-simple`
- Deve carregar sem problemas (sem Header/Footer complexos)

#### **Teste 3: Página de Serviços**
- Acesse: `http://localhost:5173/services`
- Role para baixo até "Setores Estratégicos"
- Clique nos cards para acessar páginas setoriais

### 5. **Se as Páginas Não Funcionarem**

#### **Opção 1: Usar Páginas Simplificadas**
Criar versões simplificadas de todas as páginas setoriais sem Header/Footer:

```typescript
// Exemplo de página simplificada
const PaginaSimplificada = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1>Setor [Nome]</h1>
      <p>Conteúdo do setor...</p>
      <a href="/services">← Voltar</a>
    </div>
  );
};
```

#### **Opção 2: Verificar Console do Navegador**
1. Abrir DevTools (F12)
2. Verificar Console para erros
3. Verificar Network para falhas de carregamento

#### **Opção 3: Verificar Dependências**
- Verificar se todos os componentes UI estão disponíveis
- Verificar se as imagens/assets estão no local correto
- Verificar se os hooks estão funcionando

### 6. **Próximos Passos**

1. **Testar todas as URLs** listadas acima
2. **Verificar navegação** entre páginas
3. **Testar responsividade** em diferentes dispositivos
4. **Verificar links** na página de serviços
5. **Reportar problemas** encontrados

### 7. **URLs de Navegação**

#### **Navegação Principal:**
- Início: `/`
- Serviços: `/services`
- Teste: `/test`

#### **Navegação Setorial:**
- Educação: `/educacao`
- Saúde: `/saude`
- Agricultura: `/agricultura`
- Setor Mineiro: `/sector-mineiro`
- Desenvolvimento Económico: `/desenvolvimento-economico`
- Cultura: `/cultura`
- Tecnologia: `/tecnologia`
- Energia e Água: `/energia-agua`

---

**Status**: ✅ Páginas criadas e rotas configuradas
**Próximo**: 🔍 Testar funcionamento no navegador 