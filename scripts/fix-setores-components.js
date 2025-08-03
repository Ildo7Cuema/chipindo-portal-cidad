import fs from 'fs';
import path from 'path';

// Verificar se os componentes necessários existem
const requiredComponents = [
  'src/components/ui/setor-stats.tsx',
  'src/components/ui/setor-breadcrumb.tsx',
  'src/components/ui/setor-navigation.tsx',
  'src/components/ui/candidatura-form.tsx',
  'src/components/ui/inscricao-programa-form.tsx'
];

// Verificar se os hooks necessários existem
const requiredHooks = [
  'src/hooks/useSetoresEstrategicos.ts'
];

function checkFiles() {
  console.log('🔍 Verificando arquivos necessários...\n');

  // Verificar componentes
  console.log('📦 Componentes:');
  for (const component of requiredComponents) {
    const exists = fs.existsSync(component);
    console.log(`   ${exists ? '✅' : '❌'} ${component}`);
  }

  // Verificar hooks
  console.log('\n🎣 Hooks:');
  for (const hook of requiredHooks) {
    const exists = fs.existsSync(hook);
    console.log(`   ${exists ? '✅' : '❌'} ${hook}`);
  }

  // Verificar páginas dos sectores
  console.log('\n📄 Páginas dos Sectores:');
  const sectorPages = [
    'src/pages/Educacao.tsx',
    'src/pages/Saude.tsx',
    'src/pages/Agricultura.tsx',
    'src/pages/SectorMineiro.tsx',
    'src/pages/DesenvolvimentoEconomico.tsx',
    'src/pages/Cultura.tsx',
    'src/pages/Tecnologia.tsx',
    'src/pages/EnergiaAgua.tsx'
  ];

  for (const page of sectorPages) {
    const exists = fs.existsSync(page);
    console.log(`   ${exists ? '✅' : '❌'} ${page}`);
  }
}

function checkImports() {
  console.log('\n🔍 Verificando imports nas páginas...\n');

  const sectorPages = [
    'src/pages/Educacao.tsx',
    'src/pages/Saude.tsx',
    'src/pages/Agricultura.tsx',
    'src/pages/SectorMineiro.tsx',
    'src/pages/DesenvolvimentoEconomico.tsx',
    'src/pages/Cultura.tsx',
    'src/pages/Tecnologia.tsx',
    'src/pages/EnergiaAgua.tsx'
  ];

  for (const pagePath of sectorPages) {
    if (!fs.existsSync(pagePath)) continue;

    console.log(`📄 ${path.basename(pagePath)}:`);
    
    try {
      const content = fs.readFileSync(pagePath, 'utf8');
      
      // Verificar imports necessários
      const requiredImports = [
        'useSetoresEstrategicos',
        'SetorCompleto',
        'SetorBreadcrumb',
        'SetorNavigation',
        'SetorStats'
      ];

      for (const importName of requiredImports) {
        const hasImport = content.includes(importName);
        console.log(`   ${hasImport ? '✅' : '❌'} ${importName}`);
      }

      // Verificar uso dos componentes
      const componentUsage = [
        '<SetorBreadcrumb',
        '<SetorNavigation',
        '<SetorStats'
      ];

      for (const usage of componentUsage) {
        const hasUsage = content.includes(usage);
        console.log(`   ${hasUsage ? '✅' : '❌'} ${usage}`);
      }

    } catch (error) {
      console.log(`   ❌ Erro ao ler arquivo: ${error.message}`);
    }

    console.log('');
  }
}

function createMissingComponents() {
  console.log('🔧 Criando componentes em falta...\n');

  // Verificar se candidatura-form existe
  if (!fs.existsSync('src/components/ui/candidatura-form.tsx')) {
    console.log('📝 Criando candidatura-form.tsx...');
    const candidaturaFormContent = `import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, FileText } from "lucide-react";

interface CandidaturaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  oportunidade: string;
  setor: string;
}

export const CandidaturaForm = ({ open, onOpenChange, oportunidade, setor }: CandidaturaFormProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Candidatura para {oportunidade}</DialogTitle>
          <DialogDescription>
            Preencha o formulário para se candidatar a esta oportunidade no sector de {setor}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" placeholder="Seu nome completo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" placeholder="+244 900 000 000" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem</Label>
            <Textarea 
              id="mensagem" 
              placeholder="Descreva sua experiência e motivação..."
              rows={4}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button>
              Enviar Candidatura
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
`;
    fs.writeFileSync('src/components/ui/candidatura-form.tsx', candidaturaFormContent);
    console.log('✅ candidatura-form.tsx criado');
  }

  // Verificar se inscricao-programa-form existe
  if (!fs.existsSync('src/components/ui/inscricao-programa-form.tsx')) {
    console.log('📝 Criando inscricao-programa-form.tsx...');
    const inscricaoFormContent = `import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, FileText } from "lucide-react";

interface InscricaoProgramaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programa: string;
  setor: string;
}

export const InscricaoProgramaForm = ({ open, onOpenChange, programa, setor }: InscricaoProgramaFormProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Inscrição no Programa {programa}</DialogTitle>
          <DialogDescription>
            Preencha o formulário para se inscrever neste programa do sector de {setor}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" placeholder="Seu nome completo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" placeholder="+244 900 000 000" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem</Label>
            <Textarea 
              id="mensagem" 
              placeholder="Descreva sua motivação para participar..."
              rows={4}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button>
              Inscrever-se
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
`;
    fs.writeFileSync('src/components/ui/inscricao-programa-form.tsx', inscricaoFormContent);
    console.log('✅ inscricao-programa-form.tsx criado');
  }
}

function main() {
  console.log('🔧 Verificação e Correção de Componentes dos Sectores\n');
  
  checkFiles();
  checkImports();
  createMissingComponents();
  
  console.log('🎉 Verificação concluída!');
  console.log('\n📝 Próximos passos:');
  console.log('   1. Verifique se todos os componentes foram criados');
  console.log('   2. Teste as páginas dos sectores');
  console.log('   3. Verifique se não há mais erros de import');
}

main(); 