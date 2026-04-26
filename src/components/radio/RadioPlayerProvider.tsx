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
const RESOLVED_URL_KEY = 'chipindo.radio.resolvedUrl';

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

// ---------------------------------------------------------------------------
// Utilitários de resolução de stream
// ---------------------------------------------------------------------------

/**
 * Gera variações do URL do stream para tentar reproduzir.
 * Cobre as idiossincrasias mais comuns de Icecast, Shoutcast e outros servidores.
 */
const generateStreamVariants = (baseUrl: string): string[] => {
  const variants: string[] = [];

  try {
    const u = new URL(baseUrl);

    // 1. URL original
    variants.push(baseUrl);

    // 2. Se termina em .pls ou .m3u (ficheiro de playlist, não áudio directo)
    if (/\.pls(\?|$)/i.test(u.pathname)) {
      const stem = u.origin + u.pathname.replace(/\.pls$/i, '');
      variants.push(stem, stem + '.mp3', stem + '/;stream.mp3', stem + '/;');
    } else if (/\.m3u(\?|$)/i.test(u.pathname) && !/\.m3u8/i.test(u.pathname)) {
      const stem = u.origin + u.pathname.replace(/\.m3u$/i, '');
      variants.push(stem, stem + '.mp3', stem + '/;stream.mp3', stem + '/;');
    }

    // 3. Truque Icecast: sufixo "/;" força raw HTTP em vez do protocolo ICY
    if (!u.pathname.includes(';')) {
      const sep = baseUrl.endsWith('/') ? '' : '/';
      variants.push(baseUrl + sep + ';stream.mp3');
      variants.push(baseUrl + sep + ';');
    }

    // 4. Forçar tipo HTTP no Shoutcast
    if (!u.searchParams.has('type')) {
      const withType = new URL(baseUrl);
      withType.searchParams.set('type', 'http');
      variants.push(withType.toString());
    }

    // 5. Acrescentar /stream, /live, /radio como mount points comuns
    const commonMounts = ['/stream', '/live', '/radio', '/listen'];
    if (u.pathname === '/' || u.pathname === '') {
      for (const mount of commonMounts) {
        variants.push(u.origin + mount);
      }
    }

    // 6. Sem barra final (se existe)
    if (baseUrl.endsWith('/') && baseUrl.length > u.origin.length + 1) {
      variants.push(baseUrl.slice(0, -1));
    }
  } catch {
    variants.push(baseUrl);
  }

  // Remover duplicados mantendo a ordem
  return [...new Set(variants)];
};

/**
 * Tenta extrair URL real de um ficheiro de playlist (.pls ou .m3u).
 * Usa fetch com CORS — se o servidor não suportar, retorna null silenciosamente.
 */
const tryParsePlaylist = async (url: string): Promise<string | null> => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'audio/x-scpls, audio/mpegurl, audio/x-mpegurl, */*' },
    });
    clearTimeout(timer);

    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    // .pls format: File1=http://...
    if (
      contentType.includes('audio/x-scpls') ||
      contentType.includes('audio/x-pls') ||
      url.toLowerCase().endsWith('.pls') ||
      text.trimStart().startsWith('[playlist]')
    ) {
      const match = text.match(/^File\d+=(.+)$/im);
      if (match) return match[1].trim();
    }

    // .m3u format: linhas que começam com http
    if (
      contentType.includes('mpegurl') ||
      url.toLowerCase().endsWith('.m3u') ||
      text.trimStart().startsWith('#EXTM3U')
    ) {
      const lines = text.split('\n').map((l) => l.trim());
      const streamLine = lines.find((l) => l.startsWith('http'));
      if (streamLine) return streamLine;
    }

    // Verificar se o próprio conteúdo é HTML (provavelmente uma página web, não áudio)
    if (contentType.includes('text/html') || text.trimStart().startsWith('<!DOCTYPE') || text.trimStart().startsWith('<html')) {
      console.warn('[RadioPlayer] O URL retorna HTML, não áudio:', url);
      return null;
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Tenta reproduzir um URL num elemento <audio>, com timeout.
 * Retorna true se conseguiu carregar e iniciar a reprodução.
 */
const testStreamUrl = (
  audio: HTMLAudioElement,
  url: string,
  timeoutMs = 10000
): Promise<boolean> => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      cleanup();
      resolve(false);
    }, timeoutMs);

    const onCanPlay = () => {
      cleanup();
      resolve(true);
    };
    const onError = () => {
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      clearTimeout(timeout);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('error', onError);
    };

    audio.src = url;
    audio.load();

    if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      cleanup();
      resolve(true);
      return;
    }

    audio.addEventListener('canplay', onCanPlay, { once: true });
    audio.addEventListener('canplaythrough', onCanPlay, { once: true });
    audio.addEventListener('error', onError, { once: true });
  });
};

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

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

  // URL resolvido que realmente funciona (pode diferir do settings.stream_url)
  const resolvedUrlRef = useRef<string | null>(null);

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

  // Reset do URL resolvido quando muda o settings
  useEffect(() => {
    resolvedUrlRef.current = null;
  }, [settings.stream_url]);

  // Reagir a mudança de URL do stream
  useEffect(() => {
    if (!settings.stream_url) return;
    const wasPlaying = status === 'playing' || status === 'loading';
    attachStream(resolvedUrlRef.current || settings.stream_url);
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

  // -----------------------------------------------------------------------
  // PLAY — tenta reproduzir com múltiplas estratégias de fallback
  // -----------------------------------------------------------------------
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    const url = settings.stream_url?.trim();

    // Validação 1: URL vazia
    if (!url) {
      setStatus('error');
      setError('URL de transmissão não configurado. Aceda ao painel de administração → Rádio → Stream.');
      setShowMiniPlayer(true);
      return;
    }

    // Validação 2: URL mal-formada
    try {
      new URL(url);
    } catch {
      setStatus('error');
      setError(`URL inválido: "${url}". Verifique o formato (ex: https://stream.exemplo.com/radio).`);
      setShowMiniPlayer(true);
      return;
    }

    // Validação 3: Mixed content (HTTP em site HTTPS)
    if (
      typeof window !== 'undefined' &&
      window.location.protocol === 'https:' &&
      url.startsWith('http://')
    ) {
      setStatus('error');
      setError(
        'O URL do stream usa HTTP mas o site usa HTTPS. ' +
        'Altere o URL para HTTPS no painel de administração ou contacte o fornecedor do stream.'
      );
      setShowMiniPlayer(true);
      return;
    }

    setStatus('loading');
    setError(null);
    setShowMiniPlayer(true);

    // Se já temos um URL resolvido que funcionou antes, usar directamente
    if (resolvedUrlRef.current) {
      try {
        attachStream(resolvedUrlRef.current);
        const ok = await testStreamUrl(audio, resolvedUrlRef.current, 10000);
        if (ok) {
          await audio.play();
          console.info('[RadioPlayer] ▶ A reproduzir (URL cached):', resolvedUrlRef.current);
          return;
        }
      } catch {
        // Cache inválido, resolver de novo
      }
      resolvedUrlRef.current = null;
    }

    // ----- ESTRATÉGIA 1: Verificar se é um ficheiro de playlist (.pls/.m3u) -----
    if (/\.(pls|m3u)(\?|$)/i.test(url) && !/\.m3u8/i.test(url)) {
      console.info('[RadioPlayer] URL parece ser uma playlist, a tentar extrair stream real...');
      const realUrl = await tryParsePlaylist(url);
      if (realUrl) {
        console.info('[RadioPlayer] URL extraído da playlist:', realUrl);
        attachStream(realUrl);
        const ok = await testStreamUrl(audio, realUrl, 10000);
        if (ok) {
          try {
            await audio.play();
            resolvedUrlRef.current = realUrl;
            localStorage.setItem(RESOLVED_URL_KEY, realUrl);
            console.info('[RadioPlayer] ▶ A reproduzir (via playlist):', realUrl);
            return;
          } catch {
            // Continuar para outras estratégias
          }
        }
      }
    }

    // ----- ESTRATÉGIA 2: Tentar todas as variações do URL -----
    const variants = generateStreamVariants(url);
    console.info('[RadioPlayer] A testar', variants.length, 'variações do URL...');

    for (const variant of variants) {
      console.info('[RadioPlayer] A tentar:', variant);

      // Para streams HLS, usar hls.js
      if (isHlsStream(variant, settings.stream_type)) {
        attachStream(variant);
        const ok = await testStreamUrl(audio, variant, 10000);
        if (ok) {
          try {
            await audio.play();
            resolvedUrlRef.current = variant;
            localStorage.setItem(RESOLVED_URL_KEY, variant);
            console.info('[RadioPlayer] ▶ A reproduzir (HLS):', variant);
            return;
          } catch {
            continue;
          }
        }
        continue;
      }

      // Tentar reprodução directa
      const ok = await testStreamUrl(audio, variant, 8000);
      if (ok) {
        try {
          await audio.play();
          resolvedUrlRef.current = variant;
          localStorage.setItem(RESOLVED_URL_KEY, variant);
          console.info('[RadioPlayer] ▶ A reproduzir:', variant);
          return;
        } catch {
          continue;
        }
      }
    }

    // ----- ESTRATÉGIA 3: Fetch como blob (gambiarra para streams incompatíveis) -----
    console.info('[RadioPlayer] Tentativas directas falharam. A tentar via fetch+blob...');
    try {
      const workingUrl = await tryFetchAsBlob(audio, url);
      if (workingUrl) {
        resolvedUrlRef.current = workingUrl;
        console.info('[RadioPlayer] ▶ A reproduzir (via fetch blob)');
        return;
      }
    } catch {
      // Última estratégia falhou
    }

    // ----- TUDO FALHOU -----
    console.error('[RadioPlayer] Todas as estratégias de reprodução falharam para:', url);
    setStatus('error');
    setError(
      'Não foi possível reproduzir o stream. Foram tentadas ' +
      variants.length +
      ' variações do URL sem sucesso.\n\n' +
      'Possíveis causas:\n' +
      '• O servidor de stream está offline\n' +
      '• O URL não aponta para áudio (talvez uma página web)\n' +
      '• O formato do stream não é compatível\n' +
      '• O servidor bloqueia ligações do browser (CORS)\n\n' +
      'Dica: Tente abrir o URL directamente no browser para verificar se reproduz áudio.'
    );
  }, [attachStream, settings.stream_url, settings.stream_type]);

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
        onPlaying={() => setStatus('playing')}
        onPause={() => setStatus((prev) => (prev === 'error' ? prev : 'paused'))}
        onWaiting={() => setStatus('loading')}
        onCanPlay={() => setStatus((prev) => (prev === 'loading' ? 'playing' : prev))}
        onEnded={() => setStatus('paused')}
        onError={(e) => {
          const audio = e.currentTarget;
          // Não sobrescrever erros já tratados no play()
          if (status === 'error') return;
          // Ignorar erros quando não há source (estado idle)
          if (!audio.src || audio.src === window.location.href) return;
          setStatus('error');
          const code = audio.error?.code;
          if (code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
            setError('O formato do stream não é suportado. A tentar alternativas...');
          } else if (code === MediaError.MEDIA_ERR_NETWORK) {
            setError('Erro de rede ao carregar o stream. Verifique a ligação à internet.');
          } else {
            setError('Falha na ligação ao stream. Verifique a sua conexão.');
          }
        }}
      />
      {children}
    </RadioPlayerContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Fetch-as-blob: última gambiarra — descarrega um pedaço do stream via fetch
// e cria um objectURL. Funciona para streams que o <audio> não consegue
// consumir directamente (ex.: protocolo ICY sem headers HTTP correctos).
// ---------------------------------------------------------------------------
async function tryFetchAsBlob(
  audio: HTMLAudioElement,
  url: string
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Pedir explicitamente áudio para evitar respostas HTML
        Accept: 'audio/mpeg, audio/aac, audio/ogg, audio/mp4, audio/*;q=0.9, */*;q=0.1',
        // Icy-MetaData: 0 desactiva metadados ICY que podem confundir o fetch
        'Icy-MetaData': '0',
      },
    });
    clearTimeout(timer);

    if (!res.ok || !res.body) return null;

    const contentType = res.headers.get('content-type') || '';

    // Se o servidor devolve HTML, não é um stream de áudio
    if (contentType.includes('text/html') || contentType.includes('text/plain')) {
      return null;
    }

    // Ler os primeiros ~512KB do stream para criar um blob reproduzível
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    const MAX_BYTES = 512 * 1024; // 512 KB é suficiente para testar

    while (totalBytes < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      totalBytes += value.length;
    }

    // Cancelar o resto do stream
    try { reader.cancel(); } catch { /* ignore */ }

    if (totalBytes === 0) return null;

    // Detectar tipo MIME a partir dos bytes ou do content-type
    const mimeType = detectMimeFromBytes(chunks[0]) || contentType.split(';')[0].trim() || 'audio/mpeg';

    const blob = new Blob(chunks, { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    audio.src = blobUrl;
    audio.load();

    const ok = await new Promise<boolean>((resolve) => {
      const t = setTimeout(() => { c(); resolve(false); }, 5000);
      const onOk = () => { c(); resolve(true); };
      const onFail = () => { c(); resolve(false); };
      const c = () => {
        clearTimeout(t);
        audio.removeEventListener('canplay', onOk);
        audio.removeEventListener('error', onFail);
      };
      if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) { c(); resolve(true); return; }
      audio.addEventListener('canplay', onOk, { once: true });
      audio.addEventListener('error', onFail, { once: true });
    });

    if (ok) {
      await audio.play();
      return blobUrl;
    }

    // Blob não funcionou, limpar
    URL.revokeObjectURL(blobUrl);
    return null;
  } catch {
    return null;
  }
}

/**
 * Detecta o MIME type a partir dos magic bytes do ficheiro.
 */
function detectMimeFromBytes(bytes: Uint8Array): string | null {
  if (!bytes || bytes.length < 4) return null;

  // MP3: starts with ID3 or sync word 0xFF 0xFB/0xFF 0xF3/0xFF 0xF2
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return 'audio/mpeg';
  if (bytes[0] === 0xFF && (bytes[1] & 0xE0) === 0xE0) return 'audio/mpeg';

  // Ogg: starts with "OggS"
  if (bytes[0] === 0x4F && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) return 'audio/ogg';

  // AAC: starts with 0xFF 0xF1 or 0xFF 0xF9
  if (bytes[0] === 0xFF && (bytes[1] === 0xF1 || bytes[1] === 0xF9)) return 'audio/aac';

  // FLAC: starts with "fLaC"
  if (bytes[0] === 0x66 && bytes[1] === 0x4C && bytes[2] === 0x61 && bytes[3] === 0x43) return 'audio/flac';

  // WAV: starts with "RIFF"
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) return 'audio/wav';

  return null;
}

export const useRadioPlayer = () => {
  const ctx = useContext(RadioPlayerContext);
  if (!ctx) {
    throw new Error('useRadioPlayer deve ser usado dentro de <RadioPlayerProvider>');
  }
  return ctx;
};
