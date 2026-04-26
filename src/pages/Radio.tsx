import { useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  PlayIcon,
  PauseIcon,
  Loader2Icon,
  RadioIcon,
  Volume2Icon,
  VolumeXIcon,
  GlobeIcon,
  PhoneIcon,
  MailIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  CalendarDaysIcon,
  HeadphonesIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRadioPlayer } from '@/components/radio/RadioPlayerProvider';
import { MusicRequestForm } from '@/components/radio/MusicRequestForm';
import { getDayLabel, type RadioProgram } from '@/hooks/useRadioSettings';
import radioTitleMark from '@/assets/radio-chipindo-logo.png';

const groupByDay = (programs: RadioProgram[]) => {
  const grouped: Record<number, RadioProgram[]> = {};
  for (const p of programs) {
    if (!p.active) continue;
    (grouped[p.day_of_week] ||= []).push(p);
  }
  Object.values(grouped).forEach((arr) =>
    arr.sort((a, b) => a.start_time.localeCompare(b.start_time))
  );
  return grouped;
};

const formatTime = (t: string) => t.slice(0, 5);

// Pequeno equalizer animado quando a tocar
const EqualizerBars = ({ active }: { active: boolean }) => (
  <div className="flex items-end gap-0.5 h-4" aria-hidden>
    {[0, 1, 2, 3].map((i) => (
      <span
        key={i}
        className={cn(
          'w-1 rounded-full bg-current origin-bottom',
          active ? 'animate-equalizer' : 'opacity-40'
        )}
        style={{
          height: '100%',
          animationDelay: `${i * 0.12}s`,
        }}
      />
    ))}
  </div>
);

const Radio = () => {
  const {
    settings,
    schedule,
    loading,
    status,
    error,
    volume,
    muted,
    currentProgram,
    toggle,
    setVolume,
    setMuted,
  } = useRadioPlayer();

  const grouped = useMemo(() => groupByDay(schedule), [schedule]);
  const today = new Date().getDay();
  const orderedDays = useMemo(
    () => [today, ...Array.from({ length: 7 }, (_, i) => i).filter((d) => d !== today)],
    [today]
  );

  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';
  const hasError = status === 'error';
  const hasStream = !!settings.stream_url;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 relative overflow-hidden">
        {/* ===== Fundo animado global ===== */}
        <div className="absolute inset-0 -z-10" aria-hidden>
          {/* Gradiente suave animado */}
          <div
            className="absolute inset-0 animate-radio-gradient"
            style={{
              background:
                'linear-gradient(135deg, #0b1220 0%, #0f172a 25%, #1e1b4b 50%, #0f172a 75%, #0b1220 100%)',
              backgroundSize: '400% 400%',
            }}
          />
          {/* Blobs flutuantes suaves */}
          <div className="absolute -top-24 -left-24 w-[32rem] h-[32rem] rounded-full bg-blue-500/20 blur-3xl animate-float-slow" />
          <div
            className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-yellow-400/15 blur-3xl animate-float-slow"
            style={{ animationDelay: '3s' }}
          />
          <div
            className="absolute bottom-0 left-1/3 w-[26rem] h-[26rem] rounded-full bg-fuchsia-500/15 blur-3xl animate-float-slow"
            style={{ animationDelay: '6s' }}
          />
          {/* Padrão subtil de pontos */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
          {/* Vinheta */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/70" />
        </div>

        {/* ===== Hero ===== */}
        <section className="relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Coluna esquerda */}
              <div className="space-y-6 animate-fade-in-up">
                <Badge
                  variant="secondary"
                  className="inline-flex items-center gap-2 bg-white/5 text-white/90 border-white/10 backdrop-blur px-3 py-1.5"
                >
                  <HeadphonesIcon className="w-3.5 h-3.5" />
                  Rádio Online · 24/7
                </Badge>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                  <span className="block text-white/90">
                    <span className="inline-flex items-center gap-3">
                      <img
                        src={radioTitleMark}
                        alt="Marca da Rádio"
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 border border-white/15 object-contain p-1 shadow-lg"
                        loading="eager"
                      />
                      <span className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span>{settings.name}</span>
                        <span className="text-base md:text-xl font-semibold text-yellow-300/95 tracking-wide">
                          98.6 FM
                        </span>
                      </span>
                    </span>
                  </span>
                  {settings.tagline && (
                    <span className="block text-base md:text-xl mt-3 font-normal text-white/70">
                      {settings.tagline}
                    </span>
                  )}
                </h1>

                {settings.description && (
                  <p className="text-base md:text-lg text-white/70 max-w-xl leading-relaxed">
                    {settings.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    size="lg"
                    onClick={toggle}
                    disabled={isLoading || (!hasStream && !hasError)}
                    className={cn(
                      'group relative overflow-hidden',
                      'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400',
                      'text-slate-900 font-bold text-base px-7 py-6 rounded-2xl',
                      'shadow-[0_10px_40px_-10px_rgba(251,191,36,0.7)]',
                      'transition-transform hover:scale-[1.02] active:scale-[0.99]',
                      'disabled:opacity-70 disabled:hover:scale-100'
                    )}
                  >
                    <span className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity" />
                    {isLoading ? (
                      <>
                        <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
                        A ligar...
                      </>
                    ) : isPlaying ? (
                      <>
                        <PauseIcon className="w-5 h-5 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <PlayIcon className="w-5 h-5 mr-2" />
                        Ouvir ao Vivo
                      </>
                    )}
                  </Button>

                  {isPlaying && (
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-red-500/15 border border-red-400/40 text-red-200 text-xs font-bold uppercase tracking-wider animate-fade-in">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                      EM DIRECTO
                      <EqualizerBars active />
                    </div>
                  )}
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3 max-w-sm pt-2">
                  <button
                    type="button"
                    onClick={() => setMuted(!muted)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    aria-label={muted ? 'Activar som' : 'Silenciar'}
                  >
                    {muted ? (
                      <VolumeXIcon className="w-4 h-4" />
                    ) : (
                      <Volume2Icon className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={muted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    aria-label="Volume"
                    className="flex-1 accent-yellow-400"
                  />
                </div>

                {/* Status */}
                {!hasStream && !loading && (
                  <div className="mt-2 text-sm text-yellow-200/90 bg-yellow-500/10 border border-yellow-400/30 rounded-xl px-4 py-3 animate-fade-in">
                    A transmissão ainda não foi configurada pelo administrador. Em breve estará no ar.
                  </div>
                )}
                {hasError && (
                  <div className="mt-2 text-sm text-red-200 bg-red-500/15 border border-red-400/40 rounded-xl px-4 py-3 animate-fade-in whitespace-pre-line">
                    {error || 'Não foi possível iniciar a transmissão. Tente novamente.'}
                  </div>
                )}
              </div>

              {/* Coluna direita — Logo/Capa com ondas sonoras */}
              <div className="relative mx-auto w-full max-w-md animate-scale-in">
                <div className="relative aspect-square">
                  {/* Ondas sonoras */}
                  {isPlaying && (
                    <>
                      <span
                        className="absolute inset-0 rounded-full border border-yellow-400/40 animate-radio-wave"
                        style={{ animationDelay: '0s' }}
                      />
                      <span
                        className="absolute inset-0 rounded-full border border-yellow-400/30 animate-radio-wave"
                        style={{ animationDelay: '1s' }}
                      />
                      <span
                        className="absolute inset-0 rounded-full border border-yellow-400/20 animate-radio-wave"
                        style={{ animationDelay: '2s' }}
                      />
                    </>
                  )}

                  {/* Anel exterior rotativo subtil */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full',
                      'bg-[conic-gradient(from_0deg,rgba(251,191,36,0.25),transparent_40%,rgba(59,130,246,0.25),transparent_80%,rgba(251,191,36,0.25))]',
                      isPlaying ? 'animate-spin-slow' : ''
                    )}
                    aria-hidden
                  />

                  {/* Cartão/moldura do logo */}
                  <div
                    className={cn(
                      'absolute inset-3 rounded-full overflow-hidden',
                      'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl',
                      'border border-white/15 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)]',
                      'flex items-center justify-center'
                    )}
                  >
                    {settings.cover_url || settings.logo_url ? (
                      <img
                        src={settings.cover_url || settings.logo_url || ''}
                        alt={settings.name}
                        className={cn(
                          'w-[85%] h-[85%] object-contain transition-transform duration-700',
                          isPlaying ? 'scale-100' : 'scale-95'
                        )}
                      />
                    ) : (
                      <RadioIcon className="w-1/2 h-1/2 text-white/30" />
                    )}
                  </div>

                  {/* Ícone "live" flutuante */}
                  {isPlaying && (
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg animate-pulse-soft">
                      Live
                    </div>
                  )}
                </div>

                {currentProgram && (
                  <Card className="mt-6 bg-white/5 border-white/10 backdrop-blur-xl text-white animate-fade-in-up">
                    <CardContent className="p-4">
                      <p className="text-[10px] uppercase tracking-wider text-yellow-300 mb-1 font-semibold">
                        A Tocar Agora
                      </p>
                      <p className="font-semibold text-lg leading-tight">
                        {currentProgram.title}
                      </p>
                      {currentProgram.presenter && (
                        <p className="text-sm text-white/70 mt-0.5">
                          com {currentProgram.presenter}
                        </p>
                      )}
                      <p className="text-xs text-white/60 mt-1 font-mono">
                        {formatTime(currentProgram.start_time)} –{' '}
                        {formatTime(currentProgram.end_time)}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Divisor suave */}
          <div className="h-24 bg-gradient-to-b from-transparent to-slate-900/30" />
        </section>

        {/* ===== Grelha de Programação ===== */}
        <section className="relative py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center">
                <CalendarDaysIcon className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Grelha de Programação</h2>
                <p className="text-sm text-white/60">Programas semanais da Rádio Chipindo</p>
              </div>
            </div>

            {schedule.length === 0 ? (
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardContent className="py-12 text-center text-white/70">
                  <CalendarDaysIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>Ainda não há grelha de programação publicada.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orderedDays.map((day) => {
                  const programs = grouped[day] || [];
                  if (programs.length === 0) return null;
                  const isToday = day === today;
                  return (
                    <Card
                      key={day}
                      className={cn(
                        'overflow-hidden transition-all duration-300',
                        'bg-white/5 border-white/10 backdrop-blur-xl',
                        'hover:bg-white/[0.07] hover:-translate-y-0.5',
                        isToday && 'ring-2 ring-yellow-400/50 shadow-[0_20px_40px_-20px_rgba(251,191,36,0.5)]'
                      )}
                    >
                      <div
                        className={cn(
                          'px-4 py-2.5 font-semibold text-sm flex items-center justify-between',
                          isToday
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900'
                            : 'bg-white/5 text-white/90'
                        )}
                      >
                        <span>{getDayLabel(day)}</span>
                        {isToday && (
                          <Badge className="bg-slate-900/20 text-slate-900 border-0 text-[10px] font-bold">
                            HOJE
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-0 divide-y divide-white/10">
                        {programs.map((p) => (
                          <div
                            key={p.id}
                            className="p-3 text-sm hover:bg-white/[0.03] transition-colors"
                          >
                            <div className="flex items-baseline justify-between gap-2">
                              <p className="font-semibold truncate text-white/90">{p.title}</p>
                              <span className="text-xs text-white/50 font-mono shrink-0">
                                {formatTime(p.start_time)}–{formatTime(p.end_time)}
                              </span>
                            </div>
                            {p.presenter && (
                              <p className="text-xs text-white/60 truncate mt-0.5">
                                com {p.presenter}
                              </p>
                            )}
                            {p.category && (
                              <Badge
                                variant="outline"
                                className="mt-1 text-[10px] border-white/20 text-white/70"
                              >
                                {p.category}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ===== Pedidos Musicais ===== */}
        <section className="relative py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              {/* Light mode wrapper para o formulário — melhor legibilidade */}
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-background text-foreground">
                  <MusicRequestForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Contactos ===== */}
        {(settings.website_url ||
          settings.contact_phone ||
          settings.contact_email ||
          settings.social_facebook ||
          settings.social_instagram ||
          settings.social_youtube) && (
          <section className="relative py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold">Fale Connosco</h2>
                <p className="text-white/70">
                  Siga-nos nas redes sociais e entre em contacto para sugestões, pedidos musicais
                  ou para promover o seu evento.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {settings.website_url && (
                    <a
                      href={settings.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur"
                    >
                      <GlobeIcon className="w-4 h-4" /> Website
                    </a>
                  )}
                  {settings.contact_phone && (
                    <a
                      href={`tel:${settings.contact_phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur"
                    >
                      <PhoneIcon className="w-4 h-4" /> {settings.contact_phone}
                    </a>
                  )}
                  {settings.contact_email && (
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur"
                    >
                      <MailIcon className="w-4 h-4" /> {settings.contact_email}
                    </a>
                  )}
                  {settings.social_facebook && (
                    <a
                      href={settings.social_facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur"
                    >
                      <FacebookIcon className="w-4 h-4" /> Facebook
                    </a>
                  )}
                  {settings.social_instagram && (
                    <a
                      href={settings.social_instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur"
                    >
                      <InstagramIcon className="w-4 h-4" /> Instagram
                    </a>
                  )}
                  {settings.social_youtube && (
                    <a
                      href={settings.social_youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur"
                    >
                      <YoutubeIcon className="w-4 h-4" /> YouTube
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Radio;
