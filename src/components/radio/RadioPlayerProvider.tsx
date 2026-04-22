import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Hls from 'hls.js';
import { useRadioSettings, type RadioSettings, type RadioProgram } from '@/hooks/useRadioSettings';

export type RadioPlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

interface RadioPlayerContextValue {
  settings: RadioSettings;
  schedule: RadioProgram[];
  currentProgram: RadioProgram | null;
  loading: boolean;
  status: RadioPlayerStatus;
  error: string | null;
  volume: number; // 0..1
  muted: boolean;
  showMiniPlayer: boolean;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  setVolume: (v: number) => void;
  setMuted: (m: boolean) => void;
  hideMiniPlayer: () => void;
  showMiniPlayerAgain: () => void;
}

const RadioPlayerContext = createContext<RadioPlayerContextValue | null>(null);

const STORAGE_KEY = 'chipindo.radio.prefs';

interface StoredPrefs {
  volume?: number;
  muted?: boolean;
}

const readPrefs = (): StoredPrefs => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredPrefs;
  } catch {
    return {};
  }
};

const writePrefs = (prefs: StoredPrefs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // noop
  }
};

interface RadioPlayerProviderProps {
  children: ReactNode;
}

const isHlsStream = (url: string, streamType?: string) =>
  streamType === 'hls' || /\.m3u8(\?|$)/i.test(url);

export const RadioPlayerProvider = ({ children }: RadioPlayerProviderProps) => {
  const { settings, schedule, loading, getCurrentProgram } = useRadioSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [status, setStatus] = useState<RadioPlayerStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolumeState] = useState<number>(() => {
    const p = readPrefs();
    return typeof p.volume === 'number' ? p.volume : 0.8;
  });
  const [muted, setMutedState] = useState<boolean>(() => !!readPrefs().muted);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<RadioProgram | null>(null);

  // Actualiza volume/mute no elemento <audio>
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
    writePrefs({ volume, muted });
  }, [volume, muted]);

  // Refresca programa atual a cada minuto
  useEffect(() => {
    const update = () => setCurrentProgram(getCurrentProgram());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [getCurrentProgram]);

  // Limpa instância HLS se existir
  const teardownHls = useCallback(() => {
    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
      } catch {
        // ignore
      }
      hlsRef.current = null;
    }
  }, []);

  // Liga o stream ao elemento <audio> (com suporte HLS via hls.js quando necessário)
  const attachStream = useCallback(
    (url: string) => {
      const audio = audioRef.current;
      if (!audio || !url) return;

      const useHls = isHlsStream(url, settings.stream_type);

      // Safari/iOS suportam HLS nativamente; outros browsers precisam de hls.js
      const nativeHls = audio.canPlayType('application/vnd.apple.mpegurl') !== '';

      if (useHls && !nativeHls && Hls.isSupported()) {
        teardownHls();
        const hls = new Hls({ lowLatencyMode: true });
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (data.fatal) {
            setStatus('error');
            setError('Falha ao carregar o stream HLS.');
          }
        });
        hls.loadSource(url);
        hls.attachMedia(audio);
        hlsRef.current = hls;
      } else {
        teardownHls();
        if (audio.src !== url) {
          audio.src = url;
          audio.load();
        }
      }
    },
    [settings.stream_type, teardownHls]
  );

  // Reagir a mudança de URL do stream
  useEffect(() => {
    if (!settings.stream_url) return;
    const wasPlaying = status === 'playing' || status === 'loading';
    attachStream(settings.stream_url);
    if (wasPlaying) {
      audioRef.current?.play().catch(() => {
        setStatus('error');
        setError('Não foi possível reiniciar o stream.');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.stream_url, settings.stream_type]);

  // Cleanup HLS ao desmontar
  useEffect(() => {
    return () => teardownHls();
  }, [teardownHls]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!settings.stream_url) {
      setStatus('error');
      setError('URL de transmissão não configurado.');
      setShowMiniPlayer(true);
      return;
    }
    try {
      setStatus('loading');
      setError(null);
      setShowMiniPlayer(true);
      attachStream(settings.stream_url);
      await audio.play();
    } catch (err) {
      console.error('[RadioPlayer] erro ao iniciar:', err);
      setStatus('error');
      setError('Não foi possível iniciar a transmissão.');
    }
  }, [attachStream, settings.stream_url]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(async () => {
    if (status === 'playing' || status === 'loading') {
      pause();
    } else {
      await play();
    }
  }, [pause, play, status]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (clamped > 0 && muted) {
      setMutedState(false);
    }
  }, [muted]);

  const setMuted = useCallback((m: boolean) => setMutedState(m), []);

  const hideMiniPlayer = useCallback(() => {
    pause();
    setShowMiniPlayer(false);
  }, [pause]);

  const showMiniPlayerAgain = useCallback(() => setShowMiniPlayer(true), []);

  // MediaSession API (controlos no ecrã bloqueado do telemóvel)
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    const ms = (navigator as Navigator & { mediaSession?: MediaSession }).mediaSession;
    if (!ms) return;

    const artwork: MediaImage[] = settings.logo_url
      ? [{ src: settings.logo_url, sizes: '512x512', type: 'image/png' }]
      : [];

    try {
      ms.metadata = new MediaMetadata({
        title: currentProgram?.title || settings.name,
        artist: currentProgram?.presenter || settings.tagline || 'Rádio Chipindo',
        album: settings.name,
        artwork,
      });
      ms.setActionHandler('play', () => {
        play();
      });
      ms.setActionHandler('pause', () => {
        pause();
      });
      ms.setActionHandler('stop', () => {
        pause();
      });
    } catch {
      // alguns browsers podem não suportar todas as acções
    }
  }, [currentProgram, settings, play, pause]);

  const value = useMemo<RadioPlayerContextValue>(
    () => ({
      settings,
      schedule,
      currentProgram,
      loading,
      status,
      error,
      volume,
      muted,
      showMiniPlayer,
      play,
      pause,
      toggle,
      setVolume,
      setMuted,
      hideMiniPlayer,
      showMiniPlayerAgain,
    }),
    [
      settings,
      schedule,
      currentProgram,
      loading,
      status,
      error,
      volume,
      muted,
      showMiniPlayer,
      play,
      pause,
      toggle,
      setVolume,
      setMuted,
      hideMiniPlayer,
      showMiniPlayerAgain,
    ]
  );

  return (
    <RadioPlayerContext.Provider value={value}>
      {/* Elemento áudio único, montado no topo da árvore: persiste entre rotas */}
      <audio
        ref={audioRef}
        preload="none"
        crossOrigin="anonymous"
        onPlaying={() => setStatus('playing')}
        onPause={() => setStatus((prev) => (prev === 'error' ? prev : 'paused'))}
        onWaiting={() => setStatus('loading')}
        onCanPlay={() => setStatus((prev) => (prev === 'loading' ? 'playing' : prev))}
        onEnded={() => setStatus('paused')}
        onError={() => {
          setStatus('error');
          setError('Falha na ligação ao stream. Verifique a sua conexão.');
        }}
      />
      {children}
    </RadioPlayerContext.Provider>
  );
};

export const useRadioPlayer = () => {
  const ctx = useContext(RadioPlayerContext);
  if (!ctx) {
    throw new Error('useRadioPlayer deve ser usado dentro de <RadioPlayerProvider>');
  }
  return ctx;
};
