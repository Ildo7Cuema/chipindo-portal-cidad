import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlayIcon,
  PauseIcon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
  Loader2Icon,
  RadioIcon,
  ExternalLinkIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRadioPlayer } from './RadioPlayerProvider';

export const MiniPlayer = () => {
  const {
    settings,
    status,
    error,
    volume,
    muted,
    showMiniPlayer,
    currentProgram,
    toggle,
    setVolume,
    setMuted,
    hideMiniPlayer,
  } = useRadioPlayer();
  const [expanded, setExpanded] = useState(false);

  if (!showMiniPlayer) return null;

  const isLoading = status === 'loading';
  const isPlaying = status === 'playing';
  const hasError = status === 'error';

  return (
    <div
      className={cn(
        'fixed z-[60] bottom-4 right-4 left-4 sm:left-auto sm:w-[360px]',
        'rounded-2xl border border-border/60 shadow-2xl',
        'bg-background/95 backdrop-blur-lg',
        'animate-in slide-in-from-bottom-4 fade-in duration-300'
      )}
      role="region"
      aria-label="Mini-player da Rádio Chipindo"
    >
      <div className="flex items-center gap-3 p-3">
        <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          {settings.logo_url ? (
            <img
              src={settings.logo_url}
              alt={settings.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <RadioIcon className="w-6 h-6 text-primary" />
          )}
          {isPlaying && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isPlaying && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Ao Vivo
              </span>
            )}
            <p className="text-sm font-semibold text-foreground truncate">
              {settings.name}
            </p>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {hasError
              ? (error?.split('\n')[0] || 'Falha de ligação')
              : currentProgram
              ? `${currentProgram.title}${
                  currentProgram.presenter ? ' · ' + currentProgram.presenter : ''
                }`
              : settings.tagline || 'A voz do Município'}
          </p>
        </div>

        <button
          type="button"
          onClick={toggle}
          disabled={isLoading || (!settings.stream_url && !hasError)}
          className={cn(
            'shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all',
            'bg-primary text-primary-foreground hover:scale-105 active:scale-95',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
          aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          {isLoading ? (
            <Loader2Icon className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted/60"
          aria-label={expanded ? 'Ocultar volume' : 'Mostrar volume'}
        >
          {muted || volume === 0 ? (
            <VolumeXIcon className="w-4 h-4" />
          ) : (
            <Volume2Icon className="w-4 h-4" />
          )}
        </button>

        <button
          type="button"
          onClick={hideMiniPlayer}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted/60"
          aria-label="Fechar mini-player"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      {expanded && (
        <div className="px-3 pb-3 flex items-center gap-2 border-t border-border/50 pt-2">
          <button
            type="button"
            onClick={() => setMuted(!muted)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted/60"
            aria-label={muted ? 'Activar som' : 'Silenciar'}
          >
            {muted ? <VolumeXIcon className="w-4 h-4" /> : <Volume2Icon className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Volume"
            className="flex-1 accent-primary"
          />
          <Link
            to="/radio"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Abrir <ExternalLinkIcon className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
};
