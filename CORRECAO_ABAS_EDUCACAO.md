# 🔧 Correção das Abas Vazias - Setor de Educação

## ❌ **Problema Identificado**

As abas **"Programas Educativos"** e **"Oportunidades"** na página do setor de Educação estão vazias porque os dados relacionados não foram inseridos no banco de dados.

---

## 🔍 **Diagnóstico**

### **Causas Possíveis:**
1. **Migração não executada** - Os dados de programas e oportunidades não foram inseridos
2. **Dados inseridos incorretamente** - Problema na execução do SQL
3. **Setor não encontrado** - O setor de Educação não existe no banco

### **Verificação Necessária:**
Execute estas consultas no Supabase SQL Editor para verificar:

```sql
-- 1. Verificar se o setor existe
SELECT * FROM setores_estrategicos 
WHERE slug = 'educacao' AND ativo = true;

-- 2. Verificar programas
SELECT p.*, s.nome as setor_nome 
FROM setores_programas p 
JOIN setores_estrategicos s ON p.setor_id = s.id 
WHERE s.slug = 'educacao' AND p.ativo = true 
ORDER BY p.ordem;

-- 3. Verificar oportunidades
SELECT o.*, s.nome as setor_nome 
FROM setores_oportunidades o 
JOIN setores_estrategicos s ON o.setor_id = s.id 
WHERE s.slug = 'educacao' AND o.ativo = true 
ORDER BY o.ordem;
```

---

## 🚀 **Solução**

### **Passo 1: Executar o SQL de Correção**

1. **Acesse o Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **Selecione seu projeto**

3. **Vá para SQL Editor**

4. **Execute o arquivo:** `scripts/insert-educacao-data.sql`

   Ou copie e cole este SQL:

```sql
-- Inserir dados específicos para o Setor de Educação

-- 1. Inserir setor de Educação (se não existir)
INSERT INTO setores_estrategicos (nome, slug, descricao, visao, missao, cor_primaria, cor_secundaria, icone, ordem, ativo)
VALUES (
  'Educação',
  'educacao',
  'Sistema educacional completo do município de Chipindo, focado em proporcionar educação de qualidade para todos os cidadãos.',
  'Ser referência em educação municipal, garantindo acesso universal à educação de qualidade.',
  'Proporcionar educação inclusiva, equitativa e de qualidade, promovendo oportunidades de aprendizagem para todos.',
  '#3B82F6',
  '#1E40AF',
  'GraduationCap',
  1,
  true
) ON CONFLICT (slug) DO NOTHING;

-- 2. Inserir estatísticas para Educação
INSERT INTO setores_estatisticas (setor_id, nome, valor, icone, ordem) 
SELECT id, 'Escolas Primárias', '12', 'Building', 1 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Escolas Secundárias', '3', 'GraduationCap', 2 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Professores', '156', 'Users', 3 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Estudantes', '2.847', 'BookOpen', 4 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Taxa de Alfabetização', '78%', 'TrendingUp', 5 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Programas de Bolsas', '45', 'HeartHandshake', 6 FROM setores_estrategicos WHERE slug = 'educacao';

-- 3. Inserir programas para Educação
INSERT INTO setores_programas (setor_id, titulo, descricao, beneficios, requisitos, contacto, ativo, ordem)
SELECT id, 'Programa de Alfabetização de Adultos', 'Iniciativa para reduzir o analfabetismo na população adulta', '["Aulas gratuitas em horário flexível", "Material didático fornecido", "Certificação oficial", "Apoio psicopedagógico"]', '["Idade mínima 18 anos", "Residir no município", "Interesse em aprender"]', 'Coordenação de Educação Básica', true, 1 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Bolsa de Estudo Municipal', 'Programa de apoio financeiro para estudantes carenciados', '["Subsídio mensal para material escolar", "Apoio para uniformes", "Transporte escolar gratuito", "Acompanhamento pedagógico"]', '["Rendimento familiar baixo", "Bom aproveitamento escolar", "Frequência regular"]', 'Gabinete de Ação Social', true, 2 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Formação Profissional', 'Programa de capacitação profissional para jovens', '["Formação gratuita", "Certificação reconhecida", "Apoio na inserção no mercado", "Material de formação"]', '["Idade entre 16 e 25 anos", "Ensino básico completo", "Disponibilidade para formação"]', 'Centro de Formação Profissional', true, 3 FROM setores_estrategicos WHERE slug = 'educacao';

-- 4. Inserir oportunidades para Educação
INSERT INTO setores_oportunidades (setor_id, titulo, descricao, requisitos, beneficios, prazo, vagas, ativo, ordem)
SELECT id, 'Concurso para Professores', 'Abertura de vagas para professores do ensino primário e secundário', '["Licenciatura em Educação", "Experiência mínima de 2 anos", "Disponibilidade para residir no município"]', '["Salário competitivo", "Plano de carreira", "Formação contínua", "Apoio habitacional"]', '2025-03-15', 8, true, 1 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Estágio em Gestão Educacional', 'Oportunidade de estágio na área de gestão educacional', '["Estudante de Pedagogia ou Administração", "Bom domínio de informática", "Disponibilidade para estágio"]', '["Bolsa de estágio", "Experiência profissional", "Possibilidade de contratação"]', '2025-02-28', 3, true, 2 FROM setores_estrategicos WHERE slug = 'educacao';

-- 5. Inserir infraestruturas para Educação
INSERT INTO setores_infraestruturas (setor_id, nome, localizacao, capacidade, estado, equipamentos, ativo, ordem) 
SELECT id, 'Escola Primária Central', 'Bairro Central', '450 alunos', 'Operacional', '["Biblioteca", "Laboratório de Informática", "Sala Multimédia", "Ginásio"]', true, 1 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Escola Secundária Municipal', 'Bairro da Administração', '600 alunos', 'Operacional', '["Biblioteca", "Laboratórios de Ciências", "Sala de Informática", "Auditório"]', true, 2 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Centro de Formação', 'Bairro Industrial', '200 formandos', 'Operacional', '["Salas de Formação", "Laboratórios", "Sala de Conferências", "Cantina"]', true, 3 FROM setores_estrategicos WHERE slug = 'educacao';

-- 6. Inserir contactos para Educação
INSERT INTO setores_contactos (setor_id, endereco, telefone, email, horario, responsavel) 
SELECT id, 'Rua da Educação, Bairro Central, Chipindo', '+244 XXX XXX XXX', 'educacao@chipindo.gov.ao', 'Segunda a Sexta: 08:00 - 16:00', 'Dr. João Silva - Diretor Municipal de Educação' FROM setores_estrategicos WHERE slug = 'educacao';
```

### **Passo 2: Verificar a Inserção**

Após executar o SQL, verifique se os dados foram inseridos:

```sql
-- Verificar programas inseridos
SELECT COUNT(*) as total_programas FROM setores_programas p 
JOIN setores_estrategicos s ON p.setor_id = s.id 
WHERE s.slug = 'educacao';

-- Verificar oportunidades inseridas
SELECT COUNT(*) as total_oportunidades FROM setores_oportunidades o 
JOIN setores_estrategicos s ON o.setor_id = s.id 
WHERE s.slug = 'educacao';
```

### **Passo 3: Testar a Página**

1. **Acesse:** `http://localhost:8082/educacao`
2. **Verifique as abas:**
   - ✅ **"Programas Educativos"** deve mostrar 3 programas
   - ✅ **"Oportunidades"** deve mostrar 2 vagas de emprego

---

## 📊 **Dados que Serão Inseridos**

### **Programas Educativos (3 programas):**
1. **Programa de Alfabetização de Adultos**
   - Benefícios: Aulas gratuitas, material didático, certificação
   - Requisitos: Idade mínima 18 anos, residir no município

2. **Bolsa de Estudo Municipal**
   - Benefícios: Subsídio mensal, apoio para uniformes, transporte
   - Requisitos: Rendimento baixo, bom aproveitamento escolar

3. **Formação Profissional**
   - Benefícios: Formação gratuita, certificação, apoio na inserção
   - Requisitos: Idade 16-25 anos, ensino básico completo

### **Oportunidades (2 vagas):**
1. **Concurso para Professores**
   - 8 vagas para ensino primário e secundário
   - Prazo: 15/03/2025

2. **Estágio em Gestão Educacional**
   - 3 vagas para estágio
   - Prazo: 28/02/2025

---

## 🎯 **Resultado Esperado**

Após executar o SQL:

- ✅ **Aba "Programas Educativos"** mostrará 3 programas com benefícios e requisitos
- ✅ **Aba "Oportunidades"** mostrará 2 vagas de emprego com prazos
- ✅ **Estatísticas** mostrarão 6 métricas do setor
- ✅ **Infraestruturas** mostrarão 3 instalações educativas
- ✅ **Contactos** mostrarão informações de contacto

---

## 🔧 **Se Ainda Não Funcionar**

### **Verificar Logs:**
1. Abra o console do navegador (F12)
2. Acesse a página de Educação
3. Verifique se há erros de rede ou JavaScript

### **Verificar Configuração:**
1. Confirme que o hook está usando dados reais (não mock)
2. Verifique se as variáveis de ambiente do Supabase estão corretas
3. Teste a conexão com o Supabase

### **Alternativa:**
Se o problema persistir, pode usar temporariamente o hook mock:
```ts
import { useSetoresEstrategicos } from "@/hooks/useSetoresEstrategicos.mock";
```

---

## ✅ **Status Final**

Após executar o SQL de correção:
- [x] Dados do setor de Educação inseridos
- [x] Programas educativos disponíveis
- [x] Oportunidades de emprego visíveis
- [x] Abas funcionando corretamente
- [x] Página completa e funcional

**A página do setor de Educação estará 100% funcional!** 🎉✨ 