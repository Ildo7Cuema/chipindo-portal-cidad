# 📄 Configuração do Sistema de Upload de Documentos de Transparência

## 🎯 Visão Geral

Este documento descreve como configurar o sistema de upload de arquivos PDF para documentos de transparência no portal da Administração Municipal de Chipindo.

## 🔧 Configuração do Supabase Storage

### 1. Criar Bucket de Storage

1. **Acesse o painel do Supabase**:
   - URL: https://supabase.com/dashboard/project/murdhrdqqnuntfxmwtqx/storage

2. **Crie um novo bucket**:
   - Clique em "New bucket"
   - **Nome**: `transparency-documents`
   - **Public**: ✅ Marque como público
   - **File size limit**: `10MB`
   - **Allowed MIME types**: `application/pdf`

3. **Configure as políticas RLS**:
   - Vá para "Policies" no bucket criado
   - Adicione as seguintes políticas:

```sql
-- Permitir upload público
CREATE POLICY "Public can upload transparency documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'transparency-documents');

-- Permitir download público
CREATE POLICY "Public can download transparency documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'transparency-documents');

-- Permitir atualização pública
CREATE POLICY "Public can update transparency documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'transparency-documents');

-- Permitir exclusão pública
CREATE POLICY "Public can delete transparency documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'transparency-documents');
```

### 2. Verificar Configuração

Execute o script de teste para verificar se tudo está funcionando:

```bash
node scripts/test-transparency-upload.js
```

## 🚀 Funcionalidades Implementadas

### ✅ Upload de Arquivos PDF

- **Drag & Drop**: Arraste arquivos PDF para o campo
- **Click to Upload**: Clique para selecionar arquivo
- **Validação**: Apenas arquivos PDF são aceitos
- **Limite**: Máximo 10MB por arquivo
- **Progresso**: Barra de progresso durante upload

### ✅ Interface Moderna

- **Estados Visuais**:
  - Drag ativo (azul)
  - Arquivo selecionado (verde)
  - Estado normal (cinza)
- **Informações do Arquivo**: Nome, tamanho e botão de remover
- **Feedback Imediato**: Estados visuais claros

### ✅ Integração com Banco de Dados

- **URL Automática**: Geração automática de URL pública
- **Tamanho Automático**: Cálculo automático do tamanho do arquivo
- **Metadados**: Armazenamento de informações do arquivo

### ✅ Limpeza Automática

- **Arquivos Órfãos**: Identificação e remoção automática
- **Botão de Limpeza**: Interface para limpeza manual
- **Logs**: Registro de operações de limpeza

## 📋 Estrutura de Arquivos

```
transparency-documents/
├── {timestamp}-{random}.pdf
├── {timestamp}-{random}.pdf
└── ...
```

### Formato do Nome do Arquivo

```javascript
const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.pdf`;
```

Exemplo: `1753321616000-abc123def456.pdf`

## 🔍 Testes Implementados

### 1. Teste de Bucket

```bash
node scripts/test-transparency-tables.js
```

### 2. Teste de Upload

```bash
node scripts/test-transparency-upload.js
```

### 3. Teste com Arquivo Real

```bash
node scripts/test-real-upload.js
```

## 🛠️ Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `test-transparency-tables.js` | Testa acesso às tabelas |
| `test-transparency-upload.js` | Testa upload de arquivos |
| `test-real-upload.js` | Testa upload com arquivo real |
| `create-transparency-bucket.js` | Configura bucket (manual) |

## 🎨 Interface do Usuário

### Campo de Upload

```tsx
<div {...getRootProps()} className="border-2 border-dashed rounded-lg p-4">
  <input {...getInputProps()} />
  {uploadedFile ? (
    <div className="space-y-2">
      <FileTextIcon className="w-8 h-8 text-green-600 mx-auto" />
      <p className="text-sm font-medium text-green-800">
        {uploadedFile.name}
      </p>
      <p className="text-xs text-green-600">
        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
      </p>
      <Button onClick={() => setUploadedFile(null)}>
        Remover
      </Button>
    </div>
  ) : (
    <div className="space-y-2">
      <UploadIcon className="w-8 h-8 text-gray-400 mx-auto" />
      <p className="text-sm font-medium text-gray-700">
        Clique ou arraste um arquivo PDF
      </p>
      <p className="text-xs text-gray-500">
        Máximo 10MB
      </p>
    </div>
  )}
</div>
```

### Validações

```typescript
// Tipo de arquivo
if (file.type !== 'application/pdf') {
  toast.error("Apenas arquivos PDF são permitidos");
  return null;
}

// Tamanho do arquivo
if (file.size > 10 * 1024 * 1024) {
  toast.error("Arquivo muito grande. Máximo 10MB permitido");
  return null;
}
```

## 🔒 Segurança

### Políticas RLS

- **Upload**: Permitido para todos (público)
- **Download**: Permitido para todos (público)
- **Update**: Permitido para todos (público)
- **Delete**: Permitido para todos (público)

### Validações

- ✅ Apenas arquivos PDF
- ✅ Máximo 10MB
- ✅ Nomes de arquivo únicos
- ✅ URLs públicas seguras

## 📊 Monitoramento

### Logs de Upload

```javascript
console.log('Upload iniciado:', fileName);
console.log('Upload concluído:', uploadData.path);
console.log('URL gerada:', urlData.publicUrl);
```

### Limpeza de Arquivos

```javascript
console.log('Arquivos órfãos encontrados:', orphanedFiles.length);
console.log('Arquivos removidos:', deletedFiles.length);
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de Bucket não encontrado**:
   - Crie o bucket `transparency-documents` no painel do Supabase
   - Configure como público

2. **Erro de Políticas RLS**:
   - Adicione as políticas de acesso público
   - Verifique se o bucket está configurado corretamente

3. **Erro de Upload**:
   - Verifique o tamanho do arquivo (máximo 10MB)
   - Verifique o tipo do arquivo (apenas PDF)
   - Verifique a conectividade com o Supabase

4. **Erro de Download**:
   - Verifique se a URL pública está acessível
   - Verifique as políticas de download

### Comandos de Debug

```bash
# Testar conectividade
node scripts/test-transparency-tables.js

# Testar upload
node scripts/test-transparency-upload.js

# Verificar buckets
node scripts/create-transparency-bucket.js
```

## 📈 Próximos Passos

1. **Criar bucket** no Supabase Storage
2. **Configurar políticas RLS**
3. **Testar upload** com arquivos reais
4. **Monitorar uso** e performance
5. **Implementar backup** automático
6. **Adicionar compressão** de arquivos grandes

## 📞 Suporte

Para problemas ou dúvidas sobre a configuração:

1. Verifique os logs do console
2. Execute os scripts de teste
3. Consulte a documentação do Supabase
4. Entre em contato com a equipe de desenvolvimento

---

**Status**: ✅ Implementado  
**Versão**: 1.0.0  
**Última Atualização**: Janeiro 2025 