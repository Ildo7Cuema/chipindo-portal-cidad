import { useState, type FormEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MusicIcon, CheckCircle2Icon, Loader2Icon, HeartIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useMusicRequestForm, type NewMusicRequest } from '@/hooks/useMusicRequests';

const EMPTY: NewMusicRequest = {
  listener_name: '',
  listener_contact: '',
  location: '',
  song_title: '',
  artist: '',
  dedication: '',
};

export const MusicRequestForm = () => {
  const { submit, submitting } = useMusicRequestForm();
  const [form, setForm] = useState<NewMusicRequest>(EMPTY);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const handleChange =
    (key: keyof NewMusicRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.listener_name.trim() || !form.song_title.trim()) {
      toast.error('Informe o seu nome e o nome da música.');
      return;
    }
    try {
      await submit(form);
      setForm(EMPTY);
      setJustSubmitted(true);
      toast.success('Pedido enviado! Obrigado por participar.');
      // Re-permitir novo pedido depois de uns segundos
      setTimeout(() => setJustSubmitted(false), 4000);
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível enviar. Tente novamente.');
    }
  };

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-primary/20 flex items-center justify-center">
            <MusicIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold">Peça a Sua Música</h3>
            <p className="text-sm text-muted-foreground">
              Envie uma dedicatória ou peça uma música para tocar na rádio.
            </p>
          </div>
        </div>

        {justSubmitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2Icon className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-semibold">Pedido enviado com sucesso!</p>
            <p className="text-sm text-muted-foreground">
              A nossa equipa irá analisar e, se possível, tocar a sua música em directo.
            </p>
            <Button variant="outline" onClick={() => setJustSubmitted(false)}>
              Enviar outro pedido
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="listener_name">
                  O seu nome <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="listener_name"
                  value={form.listener_name}
                  onChange={handleChange('listener_name')}
                  placeholder="Ex: João Sebastião"
                  required
                  maxLength={120}
                />
              </div>
              <div>
                <Label htmlFor="location">Cidade / País</Label>
                <Input
                  id="location"
                  value={form.location || ''}
                  onChange={handleChange('location')}
                  placeholder="Ex: Lisboa, Portugal"
                  maxLength={120}
                />
              </div>
              <div>
                <Label htmlFor="song_title">
                  Música <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="song_title"
                  value={form.song_title}
                  onChange={handleChange('song_title')}
                  placeholder="Título da música"
                  required
                  maxLength={200}
                />
              </div>
              <div>
                <Label htmlFor="artist">Artista</Label>
                <Input
                  id="artist"
                  value={form.artist || ''}
                  onChange={handleChange('artist')}
                  placeholder="Nome do artista ou banda"
                  maxLength={200}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="listener_contact">Contacto (opcional)</Label>
                <Input
                  id="listener_contact"
                  type="text"
                  value={form.listener_contact || ''}
                  onChange={handleChange('listener_contact')}
                  placeholder="Telefone ou email (apenas para contacto interno)"
                  maxLength={200}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="dedication">Dedicatória / Mensagem</Label>
                <Textarea
                  id="dedication"
                  value={form.dedication || ''}
                  onChange={handleChange('dedication')}
                  placeholder="Ex: Esta música é para a minha mãe, com muito carinho."
                  rows={3}
                  maxLength={500}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2 flex-wrap">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <HeartIcon className="w-3.5 h-3.5 text-pink-500" />
                Os seus dados são apenas usados para apresentação no programa.
              </p>
              <Button type="submit" disabled={submitting} className="min-w-[160px]">
                {submitting ? (
                  <>
                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                    A enviar...
                  </>
                ) : (
                  <>
                    <MusicIcon className="w-4 h-4 mr-2" />
                    Enviar Pedido
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
