import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  RadioIcon,
  SaveIcon,
  PlusIcon,
  Trash2Icon,
  EditIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  Loader2Icon,
  MusicIcon,
  RefreshCwIcon,
  XCircleIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useRadioSettings,
  getDayLabel,
  type RadioSettings,
  type RadioProgram,
  type RadioStreamType,
} from '@/hooks/useRadioSettings';
import {
  useMusicRequestsAdmin,
  type MusicRequestStatus,
} from '@/hooks/useMusicRequests';

const STREAM_TYPES: { value: RadioStreamType; label: string }[] = [
  { value: 'icecast', label: 'Icecast (MP3/AAC stream)' },
  { value: 'shoutcast', label: 'Shoutcast' },
  { value: 'mp3', label: 'Ficheiro MP3 directo' },
  { value: 'aac', label: 'Ficheiro AAC directo' },
  { value: 'hls', label: 'HLS (.m3u8)' },
];

const emptyProgram = (): Omit<RadioProgram, 'id'> => ({
  title: '',
  presenter: '',
  description: '',
  day_of_week: 1,
  start_time: '08:00:00',
  end_time: '09:00:00',
  category: '',
  active: true,
  order: 0,
});

export const RadioManager = () => {
  const {
    settings,
    schedule,
    loading,
    tablesAvailable,
    updateSettings,
    addProgram,
    updateProgram,
    deleteProgram,
    refresh,
  } = useRadioSettings();

  const [form, setForm] = useState<RadioSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [programForm, setProgramForm] = useState<Omit<RadioProgram, 'id'>>(emptyProgram());
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [programSaving, setProgramSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = <K extends keyof RadioSettings>(key: K, value: RadioSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const { id: _id, created_at: _c, updated_at: _u, ...rest } = form;
      void _id;
      void _c;
      void _u;
      await updateSettings(rest);
      toast.success('Configurações da rádio guardadas!');
    } catch (err) {
      console.error(err);
      toast.error(
        'Não foi possível guardar. Verifique se as tabelas radio_settings/radio_schedule foram criadas.'
      );
    } finally {
      setSaving(false);
    }
  };

  const openNewProgram = () => {
    setEditingProgramId(null);
    setProgramForm(emptyProgram());
    setProgramDialogOpen(true);
  };

  const openEditProgram = (p: RadioProgram) => {
    setEditingProgramId(p.id);
    setProgramForm({
      title: p.title,
      presenter: p.presenter,
      description: p.description,
      day_of_week: p.day_of_week,
      start_time: p.start_time,
      end_time: p.end_time,
      category: p.category,
      active: p.active,
      order: p.order,
    });
    setProgramDialogOpen(true);
  };

  const handleSaveProgram = async () => {
    if (!programForm.title.trim()) {
      toast.error('Informe o título do programa.');
      return;
    }
    setProgramSaving(true);
    try {
      if (editingProgramId) {
        await updateProgram(editingProgramId, programForm);
        toast.success('Programa actualizado!');
      } else {
        await addProgram(programForm);
        toast.success('Programa adicionado!');
      }
      setProgramDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível guardar o programa.');
    } finally {
      setProgramSaving(false);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm('Tem a certeza que pretende remover este programa?')) return;
    try {
      await deleteProgram(id);
      toast.success('Programa removido.');
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível remover o programa.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2Icon className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <RadioIcon className="w-6 h-6 text-primary" />
            Rádio Chipindo
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Configure o stream, informações públicas e a grelha de programação.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {settings.enabled ? (
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30">
              <CheckCircleIcon className="w-3 h-3 mr-1" />
              Activa
            </Badge>
          ) : (
            <Badge variant="secondary">Desactivada</Badge>
          )}
        </div>
      </div>

      {!tablesAvailable && (
        <Card className="border-yellow-500/40 bg-yellow-500/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-700 dark:text-yellow-300">
                Tabelas da rádio ainda não criadas
              </p>
              <p className="text-muted-foreground mt-1">
                Execute a migração{' '}
                <code className="px-1 py-0.5 bg-muted rounded text-xs">
                  supabase/migrations/20260129120000-create-radio-tables.sql
                </code>{' '}
                no painel do Supabase para activar a gestão completa.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="schedule">
            <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
            Grelha ({schedule.length})
          </TabsTrigger>
          <TabsTrigger value="requests">
            <MusicIcon className="w-4 h-4 mr-1.5" />
            Pedidos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Identidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da rádio</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">Slogan</Label>
                  <Input
                    id="tagline"
                    value={form.tagline || ''}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={form.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo_url">Logo (URL)</Label>
                  <Input
                    id="logo_url"
                    placeholder="https://..."
                    value={form.logo_url || ''}
                    onChange={(e) => handleChange('logo_url', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cover_url">Capa/Cover (URL)</Label>
                  <Input
                    id="cover_url"
                    placeholder="https://..."
                    value={form.cover_url || ''}
                    onChange={(e) => handleChange('cover_url', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stream</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="stream_url">URL do stream (HTTPS)</Label>
                <Input
                  id="stream_url"
                  placeholder="https://stream.exemplo.com/radio"
                  value={form.stream_url}
                  onChange={(e) => handleChange('stream_url', e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use sempre um URL HTTPS para que funcione em todos os browsers modernos.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de stream</Label>
                  <Select
                    value={form.stream_type}
                    onValueChange={(v) => handleChange('stream_type', v as RadioStreamType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STREAM_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="enabled"
                      checked={form.enabled}
                      onCheckedChange={(c) => handleChange('enabled', c)}
                    />
                    <Label htmlFor="enabled">Activa no site público</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_live"
                      checked={form.is_live}
                      onCheckedChange={(c) => handleChange('is_live', c)}
                    />
                    <Label htmlFor="is_live">Em directo</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contactos e Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website_url">Website</Label>
                  <Input
                    id="website_url"
                    value={form.website_url || ''}
                    onChange={(e) => handleChange('website_url', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Telefone</Label>
                  <Input
                    id="contact_phone"
                    value={form.contact_phone || ''}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={form.contact_email || ''}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="social_facebook">Facebook</Label>
                  <Input
                    id="social_facebook"
                    value={form.social_facebook || ''}
                    onChange={(e) => handleChange('social_facebook', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="social_instagram">Instagram</Label>
                  <Input
                    id="social_instagram"
                    value={form.social_instagram || ''}
                    onChange={(e) => handleChange('social_instagram', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="social_youtube">YouTube</Label>
                  <Input
                    id="social_youtube"
                    value={form.social_youtube || ''}
                    onChange={(e) => handleChange('social_youtube', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={refresh}>
              Recarregar
            </Button>
            <Button onClick={handleSaveSettings} disabled={saving}>
              {saving ? (
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <SaveIcon className="w-4 h-4 mr-2" />
              )}
              Guardar
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Crie programas semanais para cada dia.
            </p>
            <Dialog open={programDialogOpen} onOpenChange={setProgramDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewProgram}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Novo programa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingProgramId ? 'Editar programa' : 'Novo programa'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Título *</Label>
                    <Input
                      value={programForm.title}
                      onChange={(e) =>
                        setProgramForm((p) => ({ ...p, title: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Apresentador</Label>
                      <Input
                        value={programForm.presenter || ''}
                        onChange={(e) =>
                          setProgramForm((p) => ({ ...p, presenter: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Categoria</Label>
                      <Input
                        value={programForm.category || ''}
                        onChange={(e) =>
                          setProgramForm((p) => ({ ...p, category: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Dia</Label>
                      <Select
                        value={String(programForm.day_of_week)}
                        onValueChange={(v) =>
                          setProgramForm((p) => ({ ...p, day_of_week: parseInt(v) }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 7 }, (_, i) => (
                            <SelectItem key={i} value={String(i)}>
                              {getDayLabel(i)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Início</Label>
                      <Input
                        type="time"
                        value={programForm.start_time.slice(0, 5)}
                        onChange={(e) =>
                          setProgramForm((p) => ({
                            ...p,
                            start_time: `${e.target.value}:00`,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Fim</Label>
                      <Input
                        type="time"
                        value={programForm.end_time.slice(0, 5)}
                        onChange={(e) =>
                          setProgramForm((p) => ({
                            ...p,
                            end_time: `${e.target.value}:00`,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      rows={2}
                      value={programForm.description || ''}
                      onChange={(e) =>
                        setProgramForm((p) => ({ ...p, description: e.target.value }))
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={programForm.active}
                      onCheckedChange={(c) => setProgramForm((p) => ({ ...p, active: c }))}
                    />
                    <Label>Activo</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setProgramDialogOpen(false)}
                    disabled={programSaving}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProgram} disabled={programSaving}>
                    {programSaving ? (
                      <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <SaveIcon className="w-4 h-4 mr-2" />
                    )}
                    Guardar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {schedule.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Sem programas cadastrados.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {schedule.map((p) => (
                <Card key={p.id}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-14 shrink-0 text-center">
                      <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                        {getDayLabel(p.day_of_week).slice(0, 3)}
                      </p>
                      <p className="text-xs font-mono mt-1">
                        {p.start_time.slice(0, 5)}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {p.end_time.slice(0, 5)}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold truncate">{p.title}</p>
                        {!p.active && <Badge variant="secondary">Inactivo</Badge>}
                        {p.category && (
                          <Badge variant="outline" className="text-[10px]">
                            {p.category}
                          </Badge>
                        )}
                      </div>
                      {p.presenter && (
                        <p className="text-xs text-muted-foreground">com {p.presenter}</p>
                      )}
                      {p.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {p.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEditProgram(p)}>
                        <EditIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteProgram(p.id)}
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4 mt-4">
          <MusicRequestsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const STATUS_LABELS: Record<MusicRequestStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pendente',
    className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  },
  played: {
    label: 'Tocado',
    className: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
  },
  rejected: {
    label: 'Rejeitado',
    className: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30',
  },
};

const MusicRequestsTable = () => {
  const { requests, loading, tableAvailable, refresh, updateStatus, remove } =
    useMusicRequestsAdmin();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatus = async (id: string, status: MusicRequestStatus) => {
    setUpdatingId(id);
    try {
      await updateStatus(id, status);
      toast.success(`Pedido marcado como "${STATUS_LABELS[status].label}".`);
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível actualizar o pedido.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este pedido?')) return;
    try {
      await remove(id);
      toast.success('Pedido removido.');
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível remover.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2Icon className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!tableAvailable) {
    return (
      <Card className="border-yellow-500/40 bg-yellow-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-yellow-700 dark:text-yellow-300">
              Tabela <code>music_requests</code> ainda não criada
            </p>
            <p className="text-muted-foreground mt-1">
              Execute a migração{' '}
              <code className="px-1 py-0.5 bg-muted rounded text-xs">
                supabase/migrations/20260129130000-create-radio-music-requests.sql
              </code>{' '}
              no painel do Supabase para activar a recepção de pedidos.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {requests.length} pedido{requests.length === 1 ? '' : 's'} no total.
        </p>
        <Button size="sm" variant="outline" onClick={refresh}>
          <RefreshCwIcon className="w-4 h-4 mr-2" /> Actualizar
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            <MusicIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Ainda sem pedidos musicais.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {requests.map((r) => {
            const statusInfo = STATUS_LABELS[r.status];
            return (
              <Card key={r.id}>
                <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold truncate">{r.song_title}</p>
                      {r.artist && (
                        <span className="text-sm text-muted-foreground truncate">
                          · {r.artist}
                        </span>
                      )}
                      <Badge variant="outline" className={statusInfo.className}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">{r.listener_name}</span>
                      {r.location && ` · ${r.location}`}
                      {r.listener_contact && ` · ${r.listener_contact}`}
                    </p>
                    {r.dedication && (
                      <p className="text-sm italic text-foreground/80 line-clamp-3 pt-1">
                        “{r.dedication}”
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground/70 pt-1">
                      {new Date(r.created_at).toLocaleString('pt-PT')}
                    </p>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    {r.status !== 'played' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-700 border-green-500/40 hover:bg-green-500/10"
                        disabled={updatingId === r.id}
                        onClick={() => handleStatus(r.id, 'played')}
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-1.5" /> Tocado
                      </Button>
                    )}
                    {r.status !== 'rejected' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-500/40 hover:bg-red-500/10"
                        disabled={updatingId === r.id}
                        onClick={() => handleStatus(r.id, 'rejected')}
                      >
                        <XCircleIcon className="w-4 h-4 mr-1.5" /> Rejeitar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(r.id)}
                    >
                      <Trash2Icon className="w-4 h-4" />
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

export default RadioManager;
