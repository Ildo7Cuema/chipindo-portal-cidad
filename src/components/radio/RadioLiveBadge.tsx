import { Link } from 'react-router-dom';
import { RadioIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRadioPlayer } from './RadioPlayerProvider';

interface RadioLiveBadgeProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * Botão "AO VIVO • Rádio Chipindo" para o Hero ou qualquer secção.
 * Mostra a logomarca da rádio (settings.logo_url), um indicador "ao vivo"
 * pulsante e um equalizador animado, num tom preto suavizado, elegante
 * e profissional. Só aparece se a rádio estiver activada e com stream
 * configurado.
 */
export const RadioLiveBadge = ({ className, showLabel = true }: RadioLiveBadgeProps) => {
  const { settings } = useRadioPlayer();

  if (!settings.enabled || !settings.stream_url) return null;

  return (
    <Link
      to="/radio"
      className={cn(
        'group relative inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full',
        'bg-gradient-to-r from-neutral-900/90 via-zinc-900/85 to-neutral-800/90 backdrop-blur-xl',
        'text-white shadow-lg shadow-black/40 ring-1 ring-white/15',
        'transition-all duration-300 ease-out',
        'hover:shadow-xl hover:shadow-black/50 hover:ring-white/30 hover:scale-[1.03]',
        'hover:from-neutral-900 hover:via-zinc-800 hover:to-neutral-900',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        className
      )}
      aria-label={`Ouvir ${settings.name} ao vivo`}
    >
      {/* Halo exterior subtil — cria sensação de profundidade sem brilhar demais */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-0.5 rounded-full bg-black/30 blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-500"
      />

      {/* Logomarca da rádio em moldura circular branca */}
      <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md shrink-0 overflow-hidden ring-2 ring-white/90">
        {settings.logo_url ? (
          <img
            src={settings.logo_url}
            alt={settings.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <RadioIcon className="w-4 h-4 text-neutral-800" />
        )}
      </span>

      {/* Indicador "live" — ponto vermelho discreto pulsante (universal para "ao vivo") */}
      <span aria-hidden className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500/70 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-sm" />
      </span>

      <span className="relative text-[11px] font-extrabold uppercase tracking-[0.18em] text-white drop-shadow-sm">
        Ao Vivo
      </span>

      {showLabel && (
        <>
          <span aria-hidden className="relative w-px h-3.5 bg-white/25" />

          {/* Equalizador animado — reforça subtilmente "está a tocar" */}
          <span aria-hidden className="relative flex items-end gap-[2px] h-3.5">
            <span
              className="w-[2.5px] h-1.5 rounded-sm bg-white/85 origin-bottom animate-equalizer"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="w-[2.5px] h-3 rounded-sm bg-white/85 origin-bottom animate-equalizer"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="w-[2.5px] h-2 rounded-sm bg-white/85 origin-bottom animate-equalizer"
              style={{ animationDelay: '300ms' }}
            />
          </span>

          <span className="relative text-xs sm:text-sm font-semibold whitespace-nowrap text-white/95 drop-shadow-sm">
            {settings.name}
          </span>
        </>
      )}
    </Link>
  );
};
