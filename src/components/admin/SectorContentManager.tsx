import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Building2,
    BarChart3,
    BookOpen,
    Target,
    Factory,
    Phone,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    RefreshCw,
    GraduationCap,
    Heart,
    Sprout,
    Pickaxe,
    TrendingUp,
    Palette,
    Cpu,
    Zap,
    Eye,
    EyeOff,
    MapPin,
    Clock,
    Mail,
    User,
    Lock,
    Image as ImageIcon,
    Upload,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole, UserRole, isSectorRole, getSectorSlug, getSectorName } from "@/hooks/useUserRole";
import {
    SetorEstrategico,
    EstatisticaSetor,
    ProgramaSetor,
    OportunidadeSetor,
    InfraestruturaSetor,
    ContactoSetor,
    GaleriaSetor,
} from "@/hooks/useSetoresEstrategicos";

// ─── Ícones por sector ───────────────────────────────────────────────────────
const sectorIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    educacao: GraduationCap,
    saude: Heart,
    agricultura: Sprout,
    "setor-mineiro": Pickaxe,
    "desenvolvimento-economico": TrendingUp,
    cultura: Palette,
    tecnologia: Cpu,
    "energia-agua": Zap,
};

// ─── Tipos internos ──────────────────────────────────────────────────────────
type ActiveTab = "estatisticas" | "programas" | "oportunidades" | "infraestruturas" | "contactos" | "galeria";

interface SectorContentManagerProps {
    currentUserRole: UserRole;
}

// ─── Utilitário: parse de array a partir de string separada por vírgula ──────
const parseArrayField = (value: string): string[] =>
    value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

const joinArrayField = (arr: string[] | undefined): string =>
    (arr || []).join("\n");

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
export function SectorContentManager({ currentUserRole }: SectorContentManagerProps) {
    const { profile, isAdmin } = useUserRole();

    // Sectores disponíveis (admin vê todos, perfil sectorial vê apenas o seu)
    const [setores, setSetores] = useState<SetorEstrategico[]>([]);
    const [selectedSetorId, setSelectedSetorId] = useState<string>("");
    const [selectedSetor, setSelectedSetor] = useState<SetorEstrategico | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>("estatisticas");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Dados sectoriais
    const [estatisticas, setEstatisticas] = useState<EstatisticaSetor[]>([]);
    const [programas, setProgramas] = useState<ProgramaSetor[]>([]);
    const [oportunidades, setOportunidades] = useState<OportunidadeSetor[]>([]);
    const [infraestruturas, setInfraestruturas] = useState<InfraestruturaSetor[]>([]);
    const [contactos, setContactos] = useState<ContactoSetor[]>([]);
    const [galeria, setGaleria] = useState<GaleriaSetor[]>([]);

    // Modal de edição
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});

    // Confirmação de eliminação
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingItem, setDeletingItem] = useState<{ id: string; table: string; label: string } | null>(null);

    // ── Verificar acesso ────────────────────────────────────────────────────────
    const isSector = isSectorRole(currentUserRole);
    const canAccess = isAdmin || isSector;

    // ── Carregar sectores disponíveis ───────────────────────────────────────────
    const fetchSetores = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("setores_estrategicos")
                .select("*")
                .order("ordem");
            if (error) throw error;

            let filteredSetores = data || [];
            // Se for perfil sectorial, filtrar apenas o seu sector
            if (isSector) {
                const slug = getSectorSlug(currentUserRole);
                filteredSetores = filteredSetores.filter((s) => s.slug === slug);
            }
            setSetores(filteredSetores);
            // Seleccionar automaticamente o primeiro
            if (filteredSetores.length > 0 && !selectedSetorId) {
                setSelectedSetorId(filteredSetores[0].id);
                setSelectedSetor(filteredSetores[0]);
            }
        } catch (err) {
            console.error("Erro ao carregar sectores:", err);
            toast.error("Erro ao carregar sectores");
        }
    }, [isSector, currentUserRole, selectedSetorId]);

    // ── Carregar dados do sector seleccionado ───────────────────────────────────
    const fetchSectorData = useCallback(async (setorId: string) => {
        if (!setorId) return;
        setLoading(true);
        try {
            const [est, prog, opor, infra, cont, gal] = await Promise.all([
                supabase.from("setores_estatisticas").select("*").eq("setor_id", setorId).order("ordem"),
                supabase.from("setores_programas").select("*").eq("setor_id", setorId).order("ordem"),
                supabase.from("setores_oportunidades").select("*").eq("setor_id", setorId).order("ordem"),
                supabase.from("setores_infraestruturas").select("*").eq("setor_id", setorId).order("ordem"),
                supabase.from("setores_contactos").select("*").eq("setor_id", setorId),
                supabase.from("setores_galeria").select("*").eq("setor_id", setorId).order("ordem"),
            ]);
            setEstatisticas(est.data || []);
            setProgramas((prog.data as unknown as ProgramaSetor[]) || []);
            setOportunidades((opor.data as unknown as OportunidadeSetor[]) || []);
            setInfraestruturas((infra.data as unknown as InfraestruturaSetor[]) || []);
            setContactos(cont.data || []);
            setGaleria((gal.data as unknown as GaleriaSetor[]) || []);
        } catch (err) {
            console.error("Erro ao carregar dados do sector:", err);
            toast.error("Erro ao carregar dados do sector");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSetores();
    }, []);

    useEffect(() => {
        if (selectedSetorId) {
            fetchSectorData(selectedSetorId);
        }
    }, [selectedSetorId, fetchSectorData]);

    // ── Selecção de sector (admin) ──────────────────────────────────────────────
    const handleSetorChange = (id: string) => {
        setSelectedSetorId(id);
        const s = setores.find((x) => x.id === id) || null;
        setSelectedSetor(s);
    };

    // ── Abrir modal de criação ──────────────────────────────────────────────────
    const handleCreate = () => {
        setEditingItem(null);
        setFormData(getDefaultForm(activeTab));
        setModalOpen(true);
    };

    // ── Abrir modal de edição ───────────────────────────────────────────────────
    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData(itemToForm(activeTab, item));
        setModalOpen(true);
    };

    // ── Guardar (criar ou actualizar) ───────────────────────────────────────────
    const handleSave = async () => {
        setSaving(true);
        try {
            let finalImageUrl = formData.imagem_url;

            // Upload de imagem para a galeria, se houver nova imagem
            if (activeTab === "galeria" && formData.imageFile) {
                const fileExt = formData.imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${selectedSetorId}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('setor_gallery')
                    .upload(filePath, formData.imageFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('setor_gallery')
                    .getPublicUrl(filePath);

                finalImageUrl = data.publicUrl;
            }

            const { table, payload } = formToPayload(activeTab, { ...formData, imagem_url: finalImageUrl }, selectedSetorId);
            if (editingItem) {
                const { error } = await supabase.from(table as any).update(payload).eq("id", editingItem.id);
                if (error) throw error;
                toast.success("Registo actualizado com sucesso!");
            } else {
                const { error } = await supabase.from(table as any).insert([payload]);
                if (error) throw error;
                toast.success("Registo criado com sucesso!");
            }
            setModalOpen(false);
            await fetchSectorData(selectedSetorId);
        } catch (err: any) {
            console.error("Erro ao guardar:", err);
            toast.error(err?.message || "Erro ao guardar registo");
        } finally {
            setSaving(false);
        }
    };

    // ── Eliminar ────────────────────────────────────────────────────────────────
    const handleDeleteConfirm = (item: any, table: string, label: string) => {
        setDeletingItem({ id: item.id, table, label });
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingItem) return;
        try {
            const { error } = await supabase.from(deletingItem.table as any).delete().eq("id", deletingItem.id);
            if (error) throw error;
            toast.success("Registo eliminado com sucesso!");
            setDeleteDialogOpen(false);
            await fetchSectorData(selectedSetorId);
        } catch (err: any) {
            toast.error(err?.message || "Erro ao eliminar registo");
        }
    };

    // ── Alternar visibilidade (ativo/inativo) ────────────────────────────────────
    const handleToggleAtivo = async (item: any, table: string) => {
        try {
            const { error } = await supabase.from(table as any).update({ ativo: !item.ativo }).eq("id", item.id);
            if (error) throw error;
            toast.success(`Registo ${!item.ativo ? "activado" : "desactivado"}!`);
            await fetchSectorData(selectedSetorId);
        } catch (err: any) {
            toast.error(err?.message || "Erro ao alterar estado");
        }
    };

    if (!canAccess) {
        return (
            <Card>
                <CardContent className="p-10 text-center">
                    <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
                    <p className="text-muted-foreground">Não tem permissão para aceder a esta área.</p>
                </CardContent>
            </Card>
        );
    }

    const SectorIcon = selectedSetor ? (sectorIcons[selectedSetor.slug] || Building2) : Building2;

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* ─── Cabeçalho ──────────────────────────────────────────────────────── */}
            <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
                <CardHeader className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="p-2.5 rounded-xl"
                                style={{ backgroundColor: selectedSetor ? `${selectedSetor.cor_primaria}20` : "#e5e7eb" }}
                            >
                                <SectorIcon
                                    className="h-6 w-6"
                                    style={{ color: selectedSetor?.cor_primaria || "#6b7280" }}
                                />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight">
                                    {isSector
                                        ? `Conteúdo — ${getSectorName(currentUserRole)}`
                                        : "Gestão de Conteúdo Sectorial"}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {isSector
                                        ? "Gira as informações exibidas na página pública do seu sector"
                                        : "Seleccione um sector para editar o seu conteúdo público"}
                                </p>
                            </div>
                        </div>

                        {/* Selector de sector — apenas para admin */}
                        {isAdmin && (
                            <div className="flex items-center gap-2 min-w-[220px]">
                                <Select value={selectedSetorId} onValueChange={handleSetorChange}>
                                    <SelectTrigger>
                                        <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <SelectValue placeholder="Escolher sector…" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {setores.map((s) => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="icon" onClick={() => fetchSectorData(selectedSetorId)} title="Actualizar">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {isSector && (
                            <Button variant="ghost" size="icon" onClick={() => fetchSectorData(selectedSetorId)} title="Actualizar">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardHeader>
            </Card>

            {/* ─── Aviso se nenhum sector seleccionado ────────────────────────────── */}
            {!selectedSetorId && (
                <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-slate-900 border-dashed border-2 border-slate-200 dark:border-slate-800">
                    <CardContent className="p-12 text-center">
                        <Building2 className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium text-sm">Seleccione um sector para começar a editar.</p>
                    </CardContent>
                </Card>
            )}

            {/* ─── Tabs de conteúdo ────────────────────────────────────────────────── */}
            {selectedSetorId && (
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)} className="space-y-6">
                    <div className="overflow-x-auto pb-2">
                        <TabsList className="inline-flex h-auto gap-2 bg-transparent p-0 min-w-max">
                            <TabsTrigger value="estatisticas" className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:bg-background transition-all">
                                <BarChart3 className="h-3.5 w-3.5" /> Estatísticas
                            </TabsTrigger>
                            <TabsTrigger value="programas" className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:bg-background transition-all">
                                <BookOpen className="h-3.5 w-3.5" /> Programas
                            </TabsTrigger>
                            <TabsTrigger value="oportunidades" className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:bg-background transition-all">
                                <Target className="h-3.5 w-3.5" /> Oportunidades
                            </TabsTrigger>
                            <TabsTrigger value="infraestruturas" className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:bg-background transition-all">
                                <Factory className="h-3.5 w-3.5" /> Infraestruturas
                            </TabsTrigger>
                            <TabsTrigger value="contactos" className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:bg-background transition-all">
                                <Phone className="h-3.5 w-3.5" /> Contactos
                            </TabsTrigger>
                            <TabsTrigger value="galeria" className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:bg-background transition-all">
                                <ImageIcon className="h-3.5 w-3.5" /> Galeria
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* ── ESTATÍSTICAS ─────────────────────────────────────────────────── */}
                    <TabsContent value="estatisticas" className="mt-0">
                        <SectionHeader title="Estatísticas" count={estatisticas.length} onAdd={handleCreate} loading={loading} />
                        {loading ? <LoadingSpinner /> : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {estatisticas.map((est) => (
                                    <Card key={est.id} className="border-0 shadow-sm rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border-l-4" style={{ borderLeftColor: selectedSetor?.cor_primaria || "#3b82f6" }}>
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-2xl text-foreground truncate tracking-tight">{est.valor}</p>
                                                    <p className="text-sm font-medium mt-1 truncate text-muted-foreground">{est.nome}</p>
                                                    <p className="text-xs text-muted-foreground/60 mt-2 font-mono">Ordem: {est.ordem}</p>
                                                </div>
                                                <div className="flex gap-1 shrink-0 bg-muted/30 rounded-full p-1 border border-border/50">
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => handleEdit(est)}>
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteConfirm(est, "setores_estatisticas", est.nome)}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {estatisticas.length === 0 && <EmptyState message="Sem estatísticas. Clique em '+ Adicionar' para criar." />}
                            </div>
                        )}
                    </TabsContent>

                    {/* ── PROGRAMAS ────────────────────────────────────────────────────── */}
                    <TabsContent value="programas" className="mt-0">
                        <SectionHeader title="Programas" count={programas.length} onAdd={handleCreate} loading={loading} />
                        {loading ? <LoadingSpinner /> : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {programas.map((prog) => (
                                    <Card key={prog.id} className={cn("border-0 shadow-sm rounded-xl transition-all duration-300 hover:shadow-md", prog.ativo ? "" : "opacity-60 bg-muted/40")}>
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div className="flex-1 min-w-0 space-y-1.5">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="font-semibold text-sm tracking-tight truncate">{prog.titulo}</h4>
                                                        <Badge variant={prog.ativo ? "default" : "secondary"} className="text-[10px] uppercase font-bold tracking-wider py-0 rounded-full">
                                                            {prog.ativo ? "Activo" : "Inactivo"}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{prog.descricao}</p>
                                                </div>
                                                <div className="flex gap-1 shrink-0 bg-muted/30 rounded-full p-1 border border-border/50">
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" title={prog.ativo ? "Desactivar" : "Activar"} onClick={() => handleToggleAtivo(prog, "setores_programas")}>
                                                        {prog.ativo ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => handleEdit(prog)}>
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteConfirm(prog, "setores_programas", prog.titulo)}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {prog.contacto && (
                                                <div className="mt-4 pt-4 border-t border-border/50">
                                                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 bg-muted/20 w-max px-2.5 py-1 rounded-md">
                                                        <Phone className="h-3 w-3" /> {prog.contacto}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                                {programas.length === 0 && <EmptyState message="Sem programas. Clique em '+ Adicionar' para criar." />}
                            </div>
                        )}
                    </TabsContent>

                    {/* ── OPORTUNIDADES ────────────────────────────────────────────────── */}
                    <TabsContent value="oportunidades" className="mt-0">
                        <SectionHeader title="Oportunidades" count={oportunidades.length} onAdd={handleCreate} loading={loading} />
                        {loading ? <LoadingSpinner /> : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {oportunidades.map((opor) => (
                                    <Card key={opor.id} className={cn("border-0 shadow-sm rounded-xl transition-all duration-300 hover:shadow-md", opor.ativo ? "" : "opacity-60 bg-muted/40")}>
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div className="flex-1 min-w-0 space-y-1.5">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="font-semibold text-sm tracking-tight truncate">{opor.titulo}</h4>
                                                        <Badge variant={opor.ativo ? "default" : "secondary"} className="text-[10px] uppercase font-bold tracking-wider py-0 rounded-full">
                                                            {opor.ativo ? "Activo" : "Inactivo"}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 pt-1">{opor.descricao}</p>
                                                </div>
                                                <div className="flex gap-1 shrink-0 bg-muted/30 rounded-full p-1 border border-border/50">
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => handleToggleAtivo(opor, "setores_oportunidades")}>
                                                        {opor.ativo ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => handleEdit(opor)}>
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteConfirm(opor, "setores_oportunidades", opor.titulo)}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-border/50 flex gap-2 flex-wrap">
                                                <Badge variant="outline" className="text-[10px] text-muted-foreground font-medium rounded-md py-0.5">{opor.vagas} vagas</Badge>
                                                {opor.prazo && (
                                                    <Badge variant="outline" className="text-[10px] text-muted-foreground font-medium rounded-md py-0.5">
                                                        Prazo: {new Date(opor.prazo).toLocaleDateString("pt-AO")}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {oportunidades.length === 0 && <EmptyState message="Sem oportunidades. Clique em '+ Adicionar' para criar." />}
                            </div>
                        )}
                    </TabsContent>

                    {/* ── INFRAESTRUTURAS ──────────────────────────────────────────────── */}
                    <TabsContent value="infraestruturas" className="mt-0">
                        <SectionHeader title="Infraestruturas" count={infraestruturas.length} onAdd={handleCreate} loading={loading} />
                        {loading ? <LoadingSpinner /> : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {infraestruturas.map((infra) => (
                                    <Card key={infra.id} className={cn("border-0 shadow-sm rounded-xl transition-all duration-300 hover:shadow-md", infra.ativo ? "" : "opacity-60 bg-muted/40")}>
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <h4 className="font-semibold text-sm tracking-tight truncate">{infra.nome}</h4>
                                                        <Badge
                                                            className={cn("text-[10px] uppercase font-bold tracking-wider py-0 rounded-full", infra.estado === "Operacional" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400")}
                                                            variant="secondary"
                                                        >
                                                            {infra.estado}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                        <MapPin className="h-3 w-3" /> {infra.localizacao}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground font-mono mt-1">Capacidade: {infra.capacidade}</p>
                                                </div>
                                                <div className="flex gap-1 shrink-0 bg-muted/30 rounded-full p-1 border border-border/50">
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => handleToggleAtivo(infra, "setores_infraestruturas")}>
                                                        {infra.ativo ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => handleEdit(infra)}>
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteConfirm(infra, "setores_infraestruturas", infra.nome)}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {infraestruturas.length === 0 && <EmptyState message="Sem infraestruturas. Clique em '+ Adicionar' para criar." />}
                            </div>
                        )}
                    </TabsContent>

                    {/* ── CONTACTOS ────────────────────────────────────────────────────── */}
                    <TabsContent value="contactos" className="mt-0">
                        <SectionHeader title="Contactos" count={contactos.length} onAdd={handleCreate} loading={loading} />
                        {loading ? <LoadingSpinner /> : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {contactos.map((cont) => (
                                    <Card key={cont.id} className="border-0 shadow-sm rounded-xl transition-all duration-300 hover:shadow-md">
                                        <CardContent className="p-5 space-y-4">
                                            <div className="flex items-start justify-between gap-3 border-b border-border/40 pb-3">
                                                <h4 className="font-semibold text-sm tracking-tight">{cont.responsavel}</h4>
                                                <div className="flex gap-1 shrink-0 bg-muted/30 rounded-full p-1 border border-border/50">
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => handleEdit(cont)}>
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteConfirm(cont, "setores_contactos", cont.responsavel)}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                                                <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" /><span className="truncate" title={cont.endereco}>{cont.endereco}</span></p>
                                                <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0 text-primary/70" />{cont.telefone}</p>
                                                <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0 text-primary/70" /><span className="truncate">{cont.email}</span></p>
                                                <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 shrink-0 text-primary/70" />{cont.horario}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {contactos.length === 0 && <EmptyState message="Sem contactos. Clique em '+ Adicionar' para criar." />}
                            </div>
                        )}
                    </TabsContent>

                    {/* ── GALERIA ──────────────────────────────────────────────────────── */}
                    <TabsContent value="galeria" className="mt-0">
                        <SectionHeader title="Galeria" count={galeria.length} onAdd={handleCreate} loading={loading} />
                        {loading ? <LoadingSpinner /> : (
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {galeria.map((gal) => (
                                    <Card key={gal.id} className={cn("border-0 shadow-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 group", gal.ativo ? "" : "opacity-60")}>
                                        <div className="relative aspect-video w-full bg-muted">
                                            <img
                                                src={gal.imagem_url}
                                                alt={gal.titulo}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full z-10" onClick={() => handleToggleAtivo(gal, "setores_galeria")}>
                                                    {gal.ativo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full z-10" onClick={() => handleEdit(gal)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full z-10" onClick={() => handleDeleteConfirm(gal, "setores_galeria", gal.titulo)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <CardContent className="p-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h4 className="font-semibold text-sm truncate" title={gal.titulo}>{gal.titulo}</h4>
                                                    {gal.descricao && (
                                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{gal.descricao}</p>
                                                    )}
                                                </div>
                                                {!gal.ativo && (
                                                    <Badge variant="secondary" className="text-[10px] px-1 py-0">Inativo</Badge>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mt-2 font-mono">Ordem: {gal.ordem}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                                {galeria.length === 0 && <EmptyState message="Nenhuma imagem na galeria. Clique em '+ Adicionar' para enviar." />}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            )}

            {/* ─── Modal de Edição / Criação ───────────────────────────────────────── */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem ? "Editar" : "Novo"} — {getTabLabel(activeTab)}
                        </DialogTitle>
                        <DialogDescription>
                            Preencha os campos abaixo e clique em Guardar.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <FormFields tab={activeTab} formData={formData} setFormData={setFormData} />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
                            <X className="h-4 w-4 mr-2" /> Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? "A guardar…" : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─── Confirmação de Eliminação ───────────────────────────────────────── */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem a certeza que pretende eliminar <strong>"{deletingItem?.label}"</strong>?
                            Esta acção não pode ser revertida.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// ─── Helper: Label da aba ────────────────────────────────────────────────────
function getTabLabel(tab: ActiveTab): string {
    const labels: Record<ActiveTab, string> = {
        estatisticas: "Estatística",
        programas: "Programa",
        oportunidades: "Oportunidade",
        infraestruturas: "Infraestrutura",
        contactos: "Contacto",
        galeria: "Galeria",
    };
    return labels[tab];
}

// ─── Helper: Form por defeito ────────────────────────────────────────────────
function getDefaultForm(tab: ActiveTab): any {
    switch (tab) {
        case "estatisticas":
            return { nome: "", valor: "", icone: "BarChart3", ordem: 1 };
        case "programas":
            return { titulo: "", descricao: "", beneficios: "", requisitos: "", contacto: "", ativo: true, ordem: 1 };
        case "oportunidades":
            return { titulo: "", descricao: "", requisitos: "", beneficios: "", prazo: "", vagas: 0, ativo: true, ordem: 1 };
        case "infraestruturas":
            return { nome: "", descricao: "", localizacao: "", capacidade: "", estado: "Operacional", equipamentos: "", observacoes: "", ativo: true, ordem: 1 };
        case "contactos":
            return { endereco: "", telefone: "", email: "", horario: "", responsavel: "" };
        case "galeria":
            return { titulo: "", descricao: "", imagem_url: "", imageFile: null, ativo: true, ordem: 1 };
    }
}

// ─── Helper: Item → Form ─────────────────────────────────────────────────────
function itemToForm(tab: ActiveTab, item: any): any {
    switch (tab) {
        case "estatisticas":
            return { nome: item.nome, valor: item.valor, icone: item.icone || "BarChart3", ordem: item.ordem };
        case "programas":
            return {
                titulo: item.titulo, descricao: item.descricao,
                beneficios: joinArrayField(item.beneficios),
                requisitos: joinArrayField(item.requisitos),
                contacto: item.contacto, ativo: item.ativo, ordem: item.ordem,
            };
        case "oportunidades":
            return {
                titulo: item.titulo, descricao: item.descricao,
                requisitos: joinArrayField(item.requisitos),
                beneficios: joinArrayField(item.beneficios),
                prazo: item.prazo ? item.prazo.slice(0, 10) : "",
                vagas: item.vagas, ativo: item.ativo, ordem: item.ordem,
            };
        case "infraestruturas":
            return {
                nome: item.nome, descricao: item.descricao, localizacao: item.localizacao,
                capacidade: item.capacidade, estado: item.estado,
                equipamentos: joinArrayField(item.equipamentos),
                observacoes: item.observacoes || "", ativo: item.ativo, ordem: item.ordem,
            };
        case "contactos":
            return { endereco: item.endereco, telefone: item.telefone, email: item.email, horario: item.horario, responsavel: item.responsavel };
        case "galeria":
            return { titulo: item.titulo, descricao: item.descricao, imagem_url: item.imagem_url, imageFile: null, ativo: item.ativo, ordem: item.ordem };
    }
}

// ─── Helper: Form → Payload Supabase ─────────────────────────────────────────
function formToPayload(tab: ActiveTab, form: any, setorId: string): { table: string; payload: any } {
    switch (tab) {
        case "estatisticas":
            return { table: "setores_estatisticas", payload: { setor_id: setorId, nome: form.nome, valor: form.valor, icone: form.icone, ordem: Number(form.ordem) } };
        case "programas":
            return {
                table: "setores_programas",
                payload: {
                    setor_id: setorId, titulo: form.titulo, descricao: form.descricao,
                    beneficios: parseArrayField(form.beneficios),
                    requisitos: parseArrayField(form.requisitos),
                    contacto: form.contacto, ativo: form.ativo, ordem: Number(form.ordem),
                },
            };
        case "oportunidades":
            return {
                table: "setores_oportunidades",
                payload: {
                    setor_id: setorId, titulo: form.titulo, descricao: form.descricao,
                    requisitos: parseArrayField(form.requisitos),
                    beneficios: parseArrayField(form.beneficios),
                    prazo: form.prazo || null, vagas: Number(form.vagas), ativo: form.ativo, ordem: Number(form.ordem),
                },
            };
        case "infraestruturas":
            return {
                table: "setores_infraestruturas",
                payload: {
                    setor_id: setorId, nome: form.nome, descricao: form.descricao, localizacao: form.localizacao,
                    capacidade: form.capacidade, estado: form.estado,
                    equipamentos: parseArrayField(form.equipamentos),
                    observacoes: form.observacoes, ativo: form.ativo, ordem: Number(form.ordem),
                },
            };
        case "contactos":
            return { table: "setores_contactos", payload: { setor_id: setorId, endereco: form.endereco, telefone: form.telefone, email: form.email, horario: form.horario, responsavel: form.responsavel } };
        case "galeria":
            // O upload da imagem já foi tratado em handleSave para forms novos. 
            // imagem_url passado aqui já é a final.
            return {
                table: "setores_galeria",
                payload: {
                    setor_id: setorId, titulo: form.titulo, descricao: form.descricao,
                    imagem_url: form.imagem_url, ativo: form.ativo, ordem: Number(form.ordem)
                }
            };
    }
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

function SectionHeader({ title, count, onAdd, loading }: { title: string; count: number; onAdd: () => void; loading: boolean }) {
    return (
        <div className="flex items-center justify-between mb-6 mt-4">
            <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                <Badge variant="secondary" className="px-2 py-0.5 rounded-full text-xs font-mono">{count}</Badge>
            </div>
            <Button onClick={onAdd} size="sm" disabled={loading} className="rounded-full shadow-sm">
                <Plus className="h-4 w-4 mr-2" /> Adicionar
            </Button>
        </div>
    );
}

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground text-sm">{message}</p>
        </div>
    );
}

// ─── Formulário dinâmico por aba ─────────────────────────────────────────────
function FormFields({ tab, formData, setFormData }: { tab: ActiveTab; formData: any; setFormData: (d: any) => void }) {
    const set = (key: string, value: any) => setFormData((prev: any) => ({ ...prev, [key]: value }));

    switch (tab) {
        case "estatisticas":
            return (
                <>
                    <FieldGroup label="Nome da Estatística" required>
                        <Input value={formData.nome || ""} onChange={(e) => set("nome", e.target.value)} placeholder="Ex: Escolas Primárias" />
                    </FieldGroup>
                    <FieldGroup label="Valor" required>
                        <Input value={formData.valor || ""} onChange={(e) => set("valor", e.target.value)} placeholder="Ex: 45 ou 12.500 ou 98%" />
                    </FieldGroup>
                    <FieldGroup label="Ordem de apresentação">
                        <Input type="number" value={formData.ordem || 1} onChange={(e) => set("ordem", e.target.value)} min={1} />
                    </FieldGroup>
                </>
            );

        case "programas":
            return (
                <>
                    <FieldGroup label="Título" required>
                        <Input value={formData.titulo || ""} onChange={(e) => set("titulo", e.target.value)} placeholder="Nome do programa" />
                    </FieldGroup>
                    <FieldGroup label="Descrição" required>
                        <Textarea value={formData.descricao || ""} onChange={(e) => set("descricao", e.target.value)} rows={3} placeholder="Descrição detalhada do programa" />
                    </FieldGroup>
                    <FieldGroup label="Benefícios (um por linha)">
                        <Textarea value={formData.beneficios || ""} onChange={(e) => set("beneficios", e.target.value)} rows={4} placeholder={"Bolsa de estudo\nMaterial escolar\nRefeições"} />
                    </FieldGroup>
                    <FieldGroup label="Requisitos (um por linha)">
                        <Textarea value={formData.requisitos || ""} onChange={(e) => set("requisitos", e.target.value)} rows={4} placeholder={"Ter entre 6 e 18 anos\nResidente no município"} />
                    </FieldGroup>
                    <FieldGroup label="Contacto">
                        <Input value={formData.contacto || ""} onChange={(e) => set("contacto", e.target.value)} placeholder="Tel: +244 000 000 000" />
                    </FieldGroup>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="ativo-prog" checked={formData.ativo ?? true} onChange={(e) => set("ativo", e.target.checked)} className="h-4 w-4" />
                        <Label htmlFor="ativo-prog">Activo (visível na página pública)</Label>
                    </div>
                    <FieldGroup label="Ordem">
                        <Input type="number" value={formData.ordem || 1} onChange={(e) => set("ordem", e.target.value)} min={1} />
                    </FieldGroup>
                </>
            );

        case "oportunidades":
            return (
                <>
                    <FieldGroup label="Título" required>
                        <Input value={formData.titulo || ""} onChange={(e) => set("titulo", e.target.value)} placeholder="Nome da oportunidade" />
                    </FieldGroup>
                    <FieldGroup label="Descrição" required>
                        <Textarea value={formData.descricao || ""} onChange={(e) => set("descricao", e.target.value)} rows={3} placeholder="Descrição detalhada" />
                    </FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                        <FieldGroup label="Vagas">
                            <Input type="number" value={formData.vagas || 0} onChange={(e) => set("vagas", e.target.value)} min={0} />
                        </FieldGroup>
                        <FieldGroup label="Prazo">
                            <Input type="date" value={formData.prazo || ""} onChange={(e) => set("prazo", e.target.value)} />
                        </FieldGroup>
                    </div>
                    <FieldGroup label="Requisitos (um por linha)">
                        <Textarea value={formData.requisitos || ""} onChange={(e) => set("requisitos", e.target.value)} rows={3} placeholder={"Ensino secundário completo\n18+ anos"} />
                    </FieldGroup>
                    <FieldGroup label="Benefícios (um por linha)">
                        <Textarea value={formData.beneficios || ""} onChange={(e) => set("beneficios", e.target.value)} rows={3} placeholder={"Salário competitivo\nFormação contínua"} />
                    </FieldGroup>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="ativo-opor" checked={formData.ativo ?? true} onChange={(e) => set("ativo", e.target.checked)} className="h-4 w-4" />
                        <Label htmlFor="ativo-opor">Activo (visível na página pública)</Label>
                    </div>
                    <FieldGroup label="Ordem">
                        <Input type="number" value={formData.ordem || 1} onChange={(e) => set("ordem", e.target.value)} min={1} />
                    </FieldGroup>
                </>
            );

        case "infraestruturas":
            return (
                <>
                    <FieldGroup label="Nome" required>
                        <Input value={formData.nome || ""} onChange={(e) => set("nome", e.target.value)} placeholder="Ex: Escola Primária de Chipindo" />
                    </FieldGroup>
                    <FieldGroup label="Descrição">
                        <Textarea value={formData.descricao || ""} onChange={(e) => set("descricao", e.target.value)} rows={3} placeholder="Descrição da infraestrutura" />
                    </FieldGroup>
                    <FieldGroup label="Localização" required>
                        <Input value={formData.localizacao || ""} onChange={(e) => set("localizacao", e.target.value)} placeholder="Ex: Bairro Central, Chipindo" />
                    </FieldGroup>
                    <FieldGroup label="Capacidade">
                        <Input value={formData.capacidade || ""} onChange={(e) => set("capacidade", e.target.value)} placeholder="Ex: 500 alunos" />
                    </FieldGroup>
                    <FieldGroup label="Estado">
                        <Select value={formData.estado || "Operacional"} onValueChange={(v) => set("estado", v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Operacional">Operacional</SelectItem>
                                <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                                <SelectItem value="Em Construção">Em Construção</SelectItem>
                                <SelectItem value="Inactivo">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldGroup>
                    <FieldGroup label="Equipamentos (um por linha)">
                        <Textarea value={formData.equipamentos || ""} onChange={(e) => set("equipamentos", e.target.value)} rows={3} placeholder={"Computadores\nProjector\nBiblioteca"} />
                    </FieldGroup>
                    <FieldGroup label="Observações">
                        <Textarea value={formData.observacoes || ""} onChange={(e) => set("observacoes", e.target.value)} rows={2} placeholder="Notas adicionais" />
                    </FieldGroup>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="ativo-infra" checked={formData.ativo ?? true} onChange={(e) => set("ativo", e.target.checked)} className="h-4 w-4" />
                        <Label htmlFor="ativo-infra">Activo (visível na página pública)</Label>
                    </div>
                    <FieldGroup label="Ordem">
                        <Input type="number" value={formData.ordem || 1} onChange={(e) => set("ordem", e.target.value)} min={1} />
                    </FieldGroup>
                </>
            );

        case "contactos":
            return (
                <>
                    <FieldGroup label="Responsável" required>
                        <Input value={formData.responsavel || ""} onChange={(e) => set("responsavel", e.target.value)} placeholder="Nome do responsável" />
                    </FieldGroup>
                    <FieldGroup label="Endereço" required>
                        <Input value={formData.endereco || ""} onChange={(e) => set("endereco", e.target.value)} placeholder="Endereço completo" />
                    </FieldGroup>
                    <FieldGroup label="Telefone">
                        <Input value={formData.telefone || ""} onChange={(e) => set("telefone", e.target.value)} placeholder="+244 000 000 000" />
                    </FieldGroup>
                    <FieldGroup label="Email">
                        <Input type="email" value={formData.email || ""} onChange={(e) => set("email", e.target.value)} placeholder="email@chipindo.ao" />
                    </FieldGroup>
                    <FieldGroup label="Horário de Atendimento">
                        <Input value={formData.horario || ""} onChange={(e) => set("horario", e.target.value)} placeholder="Seg–Sex: 08h–16h" />
                    </FieldGroup>
                </>
            );
        case "galeria":
            return (
                <>
                    <FieldGroup label="Título" required>
                        <Input value={formData.titulo || ""} onChange={(e) => set("titulo", e.target.value)} placeholder="Ex: Produção de Milho" />
                    </FieldGroup>
                    <FieldGroup label="Descrição">
                        <Textarea value={formData.descricao || ""} onChange={(e) => set("descricao", e.target.value)} rows={3} placeholder="Breve descrição da imagem..." />
                    </FieldGroup>

                    <FieldGroup label="Imagem" required={!formData.imagem_url}>
                        {formData.imagem_url && !formData.imageFile ? (
                            <div className="mb-2 relative rounded-lg overflow-hidden border border-border">
                                <img src={formData.imagem_url} alt="Atual" className="w-full h-auto max-h-48 object-cover" />
                                <div className="absolute top-2 right-2">
                                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">Atual</Badge>
                                </div>
                            </div>
                        ) : null}

                        <div className="flex items-center gap-3">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => set("imageFile", e.target.files?.[0] || null)}
                                className="cursor-pointer file:text-primary file:font-medium"
                            />
                        </div>
                        {formData.imageFile && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Upload className="h-3 w-3" /> Ficheiro selecionado: {formData.imageFile.name}
                            </p>
                        )}
                    </FieldGroup>

                    <div className="flex items-center gap-3 mt-4">
                        <input type="checkbox" id="ativo-galeria" checked={formData.ativo ?? true} onChange={(e) => set("ativo", e.target.checked)} className="h-4 w-4" />
                        <Label htmlFor="ativo-galeria">Activo (visível na galeria do público)</Label>
                    </div>
                    <FieldGroup label="Ordem">
                        <Input type="number" value={formData.ordem || 1} onChange={(e) => set("ordem", e.target.value)} min={1} />
                    </FieldGroup>
                </>
            );
    }
}

function FieldGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label>
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            {children}
        </div>
    );
}

