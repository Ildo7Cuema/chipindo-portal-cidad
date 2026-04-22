import { Link } from 'react-router-dom';
import { RadioIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRadioPlayer } from './RadioPlayerProvider';

interface RadioLiveBadgeProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * Pequeno selo clicável "AO VIVO 📻 Rádio Chipindo" para o Hero ou qualquer secção.
 * Só aparece se a rádio estiver activada e com stream configurado.
 */
export const RadioLiveBadge = ({ className, showLabel = true }: RadioLiveBadgeProps) => {
  const { settings } = useRadioPlayer();

  if (!settings.enabled || !settings.stream_url) return null;

  return (
    <Link
      to="/radio"
      className={cn(
        'group inline-flex items-center gap-2 px-4 py-2 rounded-full',
        'bg-red-500/15 border border-red-400/40 backdrop-blur-xl',
        'text-red-100 hover:text-white hover:bg-red-500/25 hover:border-red-300/60',
        'transition-all duration-300 shadow-lg hover:shadow-red-500/30',
        className
      )}
      aria-label="Ouvir Rádio Chipindo ao vivo"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
      </span>
      <span className="text-xs font-bold uppercase tracking-wider">Ao Vivo</span>
      {showLabel && (
        <>
          <span className="w-px h-3 bg-red-400/40" aria-hidden />
          <RadioIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs font-semibold whitespace-nowrap">
            {settings.name}
          </span>
        </>
      )}
    </Link>
  );
};
