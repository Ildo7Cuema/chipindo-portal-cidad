# 🖼️ Guia de Imagens para Carrossel - Chipindo Portal

## 📋 **Categorias e Termos de Busca**

### 🌾 **1. Agricultura Sustentável**
**Termos de busca:**
- **Unsplash:** `angola agriculture`, `african farming`, `sustainable agriculture`, `corn fields africa`, `agricultural workers angola`
- **Freepik:** `agricultura angola`, `fazenda africana`, `cultivo sustentável`, `agricultura familiar`

**Aspectos visuais desejados:**
- Campos verdejantes de milho, feijão ou mandioca
- Agricultores trabalhando (preferência por pessoas angolanas/africanas)
- Técnicas modernas de irrigação
- Colheitas abundantes

---

### 🎭 **2. Cultura Angolana Vibrante**
**Termos de busca:**
- **Unsplash:** `angola culture`, `african dance`, `traditional music angola`, `angolan people`, `african tribal art`
- **Freepik:** `cultura angolana`, `dança africana`, `música tradicional`, `arte tribal angola`

**Aspectos visuais desejados:**
- Dançarinos em trajes tradicionais angolanos
- Instrumentos musicais africanos (marimba, hungu, dikanza)
- Artesanato local (máscaras, esculturas em madeira)
- Festivais e celebrações culturais

---

### 💧 **3. Recursos Hídricos Abundantes**
**Termos de busca:**
- **Unsplash:** `angola rivers`, `african waterfall`, `clean water africa`, `hydroelectric dam`, `crystal clear river`
- **Freepik:** `rios angola`, `cachoeira africana`, `recursos hídricos`, `energia hidrelétrica`

**Aspectos visuais desejados:**
- Rios cristalinos e cachoeiras
- Paisagens aquáticas naturais
- Barragens hidroelétricas modernas
- Reflexos da água em paisagens montanhosas

---

### ⚡ **4. Riqueza Mineral - Ouro**
**Termos de busca:**
- **Unsplash:** `gold mining africa`, `mineral resources`, `mining equipment`, `gold nuggets`, `angola diamonds`
- **Freepik:** `mineração ouro`, `recursos minerais`, `garimpo responsável`, `diamantes angola`

**Aspectos visuais desejados:**
- Equipamentos de mineração modernos
- Pepitas de ouro ou cristais
- Trabalhadores em mineração responsável
- Paisagens de áreas de extração

---

### 🏞️ **5. Turismo Natural Exuberante**
**Termos de busca:**
- **Unsplash:** `angola landscape`, `african safari`, `angola national park`, `african wilderness`, `baobab trees`
- **Freepik:** `paisagem angola`, `turismo africano`, `parque nacional`, `vida selvagem`

**Aspectos visuais desejados:**
- Paisagens épicas de savana
- Árvores baobá icônicas
- Vida selvagem africana
- Pores do sol em paisagens angolanas

---

### 🏗️ **6. Desenvolvimento Urbano Moderno**
**Termos de busca:**
- **Unsplash:** `angola city`, `luanda skyline`, `modern africa`, `urban development`, `african architecture`
- **Freepik:** `cidade moderna angola`, `arquitetura africana`, `desenvolvimento urbano`, `infraestrutura`

**Aspectos visuais desejados:**
- Skylines de cidades angolanas modernas
- Construções contemporâneas
- Infraestrutura em desenvolvimento
- Contrastes entre tradicional e moderno

---

## 🔗 **Como Obter URLs Otimizadas**

### **Unsplash (Gratuito)**

1. **Acesse:** [unsplash.com](https://unsplash.com)
2. **Busque** usando os termos acima
3. **Escolha** imagens com resolução mínima de **2000px de largura**
4. **Clique** na imagem e copie a URL
5. **Otimize a URL** adicionando parâmetros:

```
URL original: https://images.unsplash.com/photo-1234567890/
URL otimizada: https://images.unsplash.com/photo-1234567890/?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80
```

**Parâmetros importantes:**
- `w=2340` - Largura de 2340px (qualidade 4K)
- `q=80` - Qualidade 80% (ótimo balanço tamanho/qualidade)
- `fit=crop` - Corte inteligente
- `auto=format` - Formato otimizado (WebP quando suportado)

### **Freepik (Pago/Grátis com atribuição)**

1. **Acesse:** [freepik.com](https://freepik.com)
2. **Busque** usando os termos em português
3. **Baixe** na maior resolução disponível
4. **Faça upload** para seu servidor ou use um CDN
5. **Gere URLs** otimizadas no seu servidor

---

## 🛠️ **Implementação no Código**

### **Substituindo as URLs no Hero.tsx:**

```typescript
const highQualityImages = [
  { 
    src: "SUA_URL_AGRICULTURA_AQUI", 
    title: "Agricultura Sustentável",
    description: "Terras férteis de Chipindo produzindo culturas diversificadas...",
    category: "Agricultura",
    overlay: "from-green-900/90 via-green-800/70 to-emerald-900/80"
  },
  { 
    src: "SUA_URL_CULTURA_AQUI", 
    title: "Cultura Angolana Vibrante",
    description: "Celebrando a rica herança cultural de Angola...",
    category: "Cultura",
    overlay: "from-orange-900/90 via-red-800/70 to-yellow-900/80"
  },
  // ... continuar para todas as categorias
];
```

### **Exemplo de URLs Otimizadas do Unsplash:**

```typescript
// Agricultura
src: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"

// Cultura
src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"

// Recursos Hídricos  
src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
```

---

## ⚡ **Dicas de Performance**

### **1. Otimização de Carregamento**
```typescript
// Pré-carregar imagens importantes
const preloadImages = () => {
  highQualityImages.forEach(image => {
    const img = new Image();
    img.src = image.src;
  });
};
```

### **2. Lazy Loading para Mobile**
```typescript
// Versões menores para mobile
const getMobileUrl = (url: string) => {
  return url.replace('w=2340', 'w=1200');
};
```

### **3. Fallback de Qualidade**
```typescript
const onImageError = (e: any) => {
  // Primeira tentativa: versão menor
  if (e.target.src.includes('w=2340')) {
    e.target.src = e.target.src.replace('w=2340', 'w=1920');
  } 
  // Segunda tentativa: fallback local
  else {
    e.target.src = '/fallback-image.jpg';
  }
};
```

---

## 📝 **Checklist de Implementação**

### **Antes de Implementar:**
- [ ] ✅ Definir orçamento (Freepik pago vs Unsplash gratuito)
- [ ] ✅ Verificar licenças de uso
- [ ] ✅ Testar velocidade de carregamento
- [ ] ✅ Preparar imagens de fallback locais

### **Durante a Implementação:**
- [ ] ✅ Buscar 2-3 opções por categoria
- [ ] ✅ Testar URLs em diferentes dispositivos
- [ ] ✅ Verificar qualidade visual em telas grandes
- [ ] ✅ Otimizar parâmetros de URL

### **Após Implementar:**
- [ ] ✅ Testar carregamento em conexões lentas
- [ ] ✅ Verificar responsividade
- [ ] ✅ Monitorar métricas de performance
- [ ] ✅ Coletar feedback dos usuários

---

## 🎯 **URLs Recomendadas Específicas**

### **Agricultura - Unsplash:**
```
https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80
https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80
```

### **Cultura Angolana - Unsplash:**
```
https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80
https://images.unsplash.com/photo-1544216717-3bbf52512659?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80
```

### **Recursos Hídricos - Unsplash:**
```
https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80
https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80
```

---

## 💡 **Próximos Passos**

1. **Escolha a fonte:** Unsplash (gratuito) ou Freepik (pago)
2. **Busque as imagens** usando os termos fornecidos
3. **Teste as URLs** em um navegador
4. **Substitua no código** seguindo o formato mostrado
5. **Teste a performance** em diferentes dispositivos

Este guia garante que você obtenha imagens de **máxima qualidade** representando perfeitamente as **potencialidades de Chipindo**! 🚀 