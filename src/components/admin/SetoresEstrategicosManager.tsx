import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  BuildingIcon,
  TrendingUpIcon,
  PhoneIcon,
  FileTextIcon,
  BookOpenIcon,
  BriefcaseIcon,
  DatabaseIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  LayoutGridIcon,
  ArrowLeftIcon,
  GlobeIcon
} from 'lucide-react';
import { useSetoresEstrategicos, SetorEstrategico } from '@/hooks/useSetoresEstrategicos';
import { useServicos } from '@/hooks/useServicos';
import { useToast } from '@/hooks/use-toast';
import { ServicosSetorManager } from './ServicosSetorManager';
import { SetoresEstatisticasManager } from './SetoresEstatisticasManager';
import { SetoresProgramasManager } from './SetoresProgramasManager';
import { SetoresOportunidadesManager } from './SetoresOportunidadesManager';
import { SetoresInfraestruturasManager } from './SetoresInfraestruturasManager';
import { SetoresContactosManager } from './SetoresContactosManager';
import { cn } from '@/lib/utils';

const NOVOS_SETORES_DATA: Omit<SetorEstrategico, 'id' | 'created_at' | 'updated_at'>[] = [
  { nome: 'Recursos Humanos', slug: 'recursos-humanos', descricao: 'Gestão e desenvolvimento do capital humano da Administração Municipal de Chipindo.', visao: 'Ser referência em gestão de recursos humanos, promovendo um serviço público eficiente e comprometido.', missao: 'Gerir, valorizar e desenvolver o capital humano da administração municipal.', cor_primaria: '#6366F1', cor_secundaria: '#4F46E5', icone: 'Users2', ordem: 9, ativo: true },
  { nome: 'Gabinete Jurídico', slug: 'juridico', descricao: 'Assessoria jurídica e legal à Administração Municipal de Chipindo.', visao: 'Ser referência em assessoria jurídica municipal, garantindo a legalidade e transparência.', missao: 'Prestar assessoria jurídica de qualidade, assegurando conformidade com a lei.', cor_primaria: '#64748B', cor_secundaria: '#475569', icone: 'Scale', ordem: 10, ativo: true },
  { nome: 'Infraestrutura e Obras', slug: 'infraestrutura', descricao: 'Planificação, execução e manutenção das obras e infraestruturas públicas de Chipindo.', visao: 'Ser referência em gestão de infraestruturas, garantindo obras de qualidade.', missao: 'Planificar, executar e manter as infraestruturas públicas do município.', cor_primaria: '#F97316', cor_secundaria: '#EA580C', icone: 'Building2', ordem: 11, ativo: true },
  { nome: 'Transportes e Comunicações', slug: 'transporte', descricao: 'Gestão e regulação dos transportes públicos e comunicações no Município de Chipindo.', visao: 'Garantir um sistema de transportes eficiente, seguro e acessível.', missao: 'Regular e desenvolver o sector de transportes e comunicações.', cor_primaria: '#0EA5E9', cor_secundaria: '#0284C7', icone: 'Truck', ordem: 12, ativo: true },
  { nome: 'Ambiente e Recursos Naturais', slug: 'ambiente', descricao: 'Protecção ambiental e gestão sustentável dos recursos naturais de Chipindo.', visao: 'Garantir um ambiente saudável e sustentável para as gerações futuras.', missao: 'Proteger o ambiente e gerir de forma sustentável os recursos naturais.', cor_primaria: '#22C55E', cor_secundaria: '#16A34A', icone: 'Leaf', ordem: 13, ativo: true },
  { nome: 'Urbanismo e Ordenamento', slug: 'urbanismo', descricao: 'Planeamento urbano e ordenamento do território do Município de Chipindo.', visao: 'Garantir um desenvolvimento urbano ordenado, inclusivo e sustentável.', missao: 'Planear e ordenar o território municipal de forma harmoniosa e de qualidade.', cor_primaria: '#F59E0B', cor_secundaria: '#D97706', icone: 'Building', ordem: 14, ativo: true },
  { nome: 'Fiscalização Municipal', slug: 'fiscalizacao', descricao: 'Controlo, inspecção e fiscalização das actividades no Município de Chipindo.', visao: 'Ser referência em fiscalização municipal, garantindo o cumprimento das normas.', missao: 'Fiscalizar e controlar as actividades no município, protegendo os cidadãos.', cor_primaria: '#EF4444', cor_secundaria: '#DC2626', icone: 'Search', ordem: 15, ativo: true },
  { nome: 'ANIESA', slug: 'aniesa', descricao: 'Acção social, assistência e apoio às famílias vulneráveis do Município de Chipindo.', visao: 'Garantir apoio e assistência a todas as famílias vulneráveis.', missao: 'Prestar serviços de acção social promovendo a inclusão e bem-estar social.', cor_primaria: '#14B8A6', cor_secundaria: '#0D9488', icone: 'Shield', ordem: 16, ativo: true },
];

type SubView = 'servicos' | 'estatisticas' | 'programas' | 'oportunidades' | 'infraestruturas' | 'contactos' | null;

const subViewLabels: Record<NonNullable<SubView>, string> = {
  servicos: 'Serviços',
  estatisticas: 'Estatísticas',
  programas: 'Programas',
  oportunidades: 'Oportunidades',
  infraestruturas: 'Infraestruturas',
  contactos: 'Contactos',
};

const defaultForm = {
  nome: '',
  slug: '',
  descricao: '',
  visao: '',
  missao: '',
  cor_primaria: '#3B82F6',
  cor_secundaria: '#1E40AF',
  icone: 'Building',
  ordem: 0,
  ativo: true,
};

export const SetoresEstrategicosManager = () => {
  const { setores, loading, error, createSetor, updateSetor, deleteSetor, fetchSetores } = useSetoresEstrategicos();
  const { servicos } = useServicos();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSetor, setEditingSetor] = useState<SetorEstrategico | null>(null);
  const [selectedSetor, setSelectedSetor] = useState<SetorEstrategico | null>(null);
  const [subView, setSubView] = useState<SubView>(null);
  const [seeding, setSeeding] = useState(false);
  const [formData, setFormData] = useState(defaultForm);

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingSetor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSetor) {
        await updateSetor(editingSetor.id, formData);
        toast({ title: 'Setor actualizado', description: 'Alterações guardadas com sucesso.' });
      } else {
        await createSetor(formData);
        toast({ title: 'Setor criado', description: 'Novo setor adicionado com sucesso.' });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch {
      toast({ title: 'Erro', description: 'Ocorreu um erro ao guardar o setor.', variant: 'destructive' });
    }
  };

  const handleEdit = (setor: SetorEstrategico) => {
    setEditingSetor(setor);
    setFormData({
      nome: setor.nome,
      slug: setor.slug,
      descricao: setor.descricao,
      visao: setor.visao,
      missao: setor.missao,
      cor_primaria: setor.cor_primaria,
      cor_secundaria: setor.cor_secundaria,
      icone: setor.icone,
      ordem: setor.ordem,
      ativo: setor.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este setor?')) return;
    try {
      await deleteSetor(id);
      toast({ title: 'Setor excluído', description: 'O setor foi removido com sucesso.' });
    } catch {
      toast({ title: 'Erro', description: 'Erro ao excluir o setor.', variant: 'destructive' });
    }
  };

  const handleSeedNovosSetores = async () => {
    if (!confirm('Isto vai inserir os sectores em falta na base de dados. Continuar?')) return;
    setSeeding(true);
    const slugsExistentes = setores.map(s => s.slug);
    const emFalta = NOVOS_SETORES_DATA.filter(s => !slugsExistentes.includes(s.slug));
    if (emFalta.length === 0) {
      toast({ title: 'Nada a fazer', description: 'Todos os sectores já existem na base de dados.' });
      setSeeding(false);
      return;
    }
    let inseridos = 0;
    let erros = 0;
    for (const setor of emFalta) {
      try { await createSetor(setor); inseridos++; } catch { erros++; }
    }
    setSeeding(false);
    toast({
      title: erros === 0 ? `${inseridos} sectores inseridos!` : 'Concluído com erros',
      description: `${inseridos} inserido(s)${erros > 0 ? `, ${erros} erro(s)` : ''}.`,
      variant: erros > 0 ? 'destructive' : 'default',
    });
  };

  const openSubView = (setor: SetorEstrategico, view: NonNullable<SubView>) => {
    setSelectedSetor(setor);
    setSubView(view);
  };

  const closeSubView = () => {
    setSubView(null);
    setSelectedSetor(null);
  };

  // ── Sub-view renders ──────────────────────────────────────────────────────
  if (subView && selectedSetor) {
    const SubComponent = {
      servicos: <ServicosSetorManager setorNome={selectedSetor.nome} setorId={selectedSetor.id} />,
      estatisticas: <SetoresEstatisticasManager setorNome={selectedSetor.nome} setorId={selectedSetor.id} />,
      programas: <SetoresProgramasManager setorNome={selectedSetor.nome} setorId={selectedSetor.id} />,
      oportunidades: <SetoresOportunidadesManager setorNome={selectedSetor.nome} setorId={selectedSetor.id} />,
      infraestruturas: <SetoresInfraestruturasManager setorNome={selectedSetor.nome} setorId={selectedSetor.id} />,
      contactos: <SetoresContactosManager setorNome={selectedSetor.nome} setorId={selectedSetor.id} />,
    }[subView];

    return (
      <div className="space-y-6">
        {/* Back header */}
        <div className="flex items-center gap-4 px-1">
          <Button variant="outline" size="sm" onClick={closeSubView} className="gap-2 h-9">
            <ArrowLeftIcon className="w-4 h-4" />
            Sectores
          </Button>
          <div className="h-5 w-px bg-border" />
          <div
            className="w-6 h-6 rounded-md flex-shrink-0"
            style={{ backgroundColor: selectedSetor.cor_primaria }}
          />
          <div>
            <p className="text-xs text-muted-foreground leading-none mb-0.5">{selectedSetor.nome}</p>
            <h2 className="text-base font-semibold leading-none">{subViewLabels[subView]}</h2>
          </div>
        </div>
        {SubComponent}
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        <p className="text-sm text-muted-foreground">A carregar sectores…</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/40 bg-destructive/5">
        <CardContent className="p-6 flex items-center gap-3">
          <AlertCircleIcon className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const slugsExistentes = setores.map(s => s.slug);
  const emFaltaCount = NOVOS_SETORES_DATA.filter(s => !slugsExistentes.includes(s.slug)).length;

  // ── Main list ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <LayoutGridIcon className="w-5 h-5 text-primary" />
            Sectores Estratégicos
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {setores.length} sector{setores.length !== 1 ? 'es' : ''} registado{setores.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {emFaltaCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedNovosSetores}
              disabled={seeding}
              className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950"
            >
              <DatabaseIcon className={cn('w-4 h-4', seeding && 'animate-pulse')} />
              {seeding ? 'A inserir…' : `Seed (${emFaltaCount} em falta)`}
            </Button>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => { resetForm(); setIsDialogOpen(true); }} className="gap-2">
                <PlusIcon className="w-4 h-4" />
                Novo Setor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSetor ? 'Editar Setor' : 'Novo Setor'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input id="slug" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="nome-do-setor" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea id="descricao" value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} rows={3} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="visao">Visão</Label>
                    <Textarea id="visao" value={formData.visao} onChange={e => setFormData({ ...formData, visao: e.target.value })} rows={2} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="missao">Missão</Label>
                    <Textarea id="missao" value={formData.missao} onChange={e => setFormData({ ...formData, missao: e.target.value })} rows={2} required />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="cor_primaria">Cor Primária</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" id="cor_primaria" value={formData.cor_primaria} onChange={e => setFormData({ ...formData, cor_primaria: e.target.value })} className="w-10 h-9 rounded border cursor-pointer" />
                      <Input value={formData.cor_primaria} onChange={e => setFormData({ ...formData, cor_primaria: e.target.value })} className="font-mono text-xs" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cor_secundaria">Cor Secundária</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" id="cor_secundaria" value={formData.cor_secundaria} onChange={e => setFormData({ ...formData, cor_secundaria: e.target.value })} className="w-10 h-9 rounded border cursor-pointer" />
                      <Input value={formData.cor_secundaria} onChange={e => setFormData({ ...formData, cor_secundaria: e.target.value })} className="font-mono text-xs" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ordem">Ordem</Label>
                    <Input id="ordem" type="number" value={formData.ordem} onChange={e => setFormData({ ...formData, ordem: parseInt(e.target.value) })} min="0" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="icone">Ícone (nome Lucide)</Label>
                  <Input id="icone" value={formData.icone} onChange={e => setFormData({ ...formData, icone: e.target.value })} placeholder="Building2" />
                </div>

                <div className="flex items-center gap-3 py-1">
                  <Switch id="ativo" checked={formData.ativo} onCheckedChange={checked => setFormData({ ...formData, ativo: checked })} />
                  <Label htmlFor="ativo" className="cursor-pointer">Setor activo (visível no portal)</Label>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit">{editingSetor ? 'Guardar Alterações' : 'Criar Setor'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Seed alert */}
      {emFaltaCount > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3">
          <AlertCircleIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>{emFaltaCount} sector{emFaltaCount !== 1 ? 'es' : ''}</strong> novo{emFaltaCount !== 1 ? 's' : ''} em falta na base de dados.
            Clique em <strong>"Seed"</strong> para os inserir automaticamente e activar as respectivas páginas públicas.
          </p>
        </div>
      )}

      {/* Empty state */}
      {setores.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <BuildingIcon className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-1">Nenhum setor registado</h3>
              <p className="text-sm text-muted-foreground">Crie o primeiro setor ou use o botão "Seed" para preencher automaticamente.</p>
            </div>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="gap-2">
              <PlusIcon className="w-4 h-4" />
              Criar Primeiro Setor
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sector cards grid */}
      {setores.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {setores.map(setor => {
            const servicosAtivos = servicos.filter(s => s.categoria === setor.nome && s.ativo).length;
            return (
              <Card key={setor.id} className="group flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-slate-900 shadow-sm">
                {/* Color band */}
                <div
                  className="h-1.5 w-full flex-shrink-0"
                  style={{ background: `linear-gradient(to right, ${setor.cor_primaria}, ${setor.cor_secundaria})` }}
                />

                <CardHeader className="pb-3 pt-4 px-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: setor.cor_primaria + '20', border: `1.5px solid ${setor.cor_primaria}40` }}
                      >
                        <BuildingIcon className="w-4 h-4" style={{ color: setor.cor_primaria }} />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-sm font-semibold leading-tight truncate">{setor.nome}</CardTitle>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">/{setor.slug}</p>
                      </div>
                    </div>
                    <Badge
                      variant={setor.ativo ? 'default' : 'secondary'}
                      className={cn('text-xs flex-shrink-0', setor.ativo ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' : '')}
                    >
                      {setor.ativo ? (
                        <><CheckCircle2Icon className="w-3 h-3 mr-1" />Activo</>
                      ) : 'Inactivo'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2 line-clamp-2">
                    {setor.descricao}
                  </p>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col px-5 pb-4 pt-0 gap-4">
                  {/* Stats row */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground border rounded-lg px-3 py-2 bg-muted/30">
                    <span className="flex items-center gap-1.5">
                      <FileTextIcon className="w-3.5 h-3.5" />
                      {servicosAtivos} serviço{servicosAtivos !== 1 ? 's' : ''}
                    </span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1.5">
                      Ord. <strong>{setor.ordem}</strong>
                    </span>
                  </div>

                  {/* Content management buttons */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Gerir Conteúdo</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {([
                        ['estatisticas', TrendingUpIcon, 'Estatísticas'],
                        ['programas', BookOpenIcon, 'Programas'],
                        ['oportunidades', BriefcaseIcon, 'Oportunidades'],
                        ['infraestruturas', BuildingIcon, 'Infraestruturas'],
                        ['contactos', PhoneIcon, 'Contactos'],
                        ['servicos', FileTextIcon, 'Serviços'],
                      ] as [NonNullable<SubView>, typeof BuildingIcon, string][]).map(([view, Icon, label]) => (
                        <button
                          key={view}
                          onClick={() => openSubView(setor, view)}
                          className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150 group/btn"
                        >
                          <Icon className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform duration-150" />
                          <span className="leading-none">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs gap-1.5"
                      onClick={() => handleEdit(setor)}
                    >
                      <EditIcon className="w-3.5 h-3.5" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => window.open(`/${setor.slug}`, '_blank')}
                      title="Ver no portal"
                    >
                      <GlobeIcon className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                      onClick={() => handleDelete(setor.id)}
                      title="Excluir setor"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};