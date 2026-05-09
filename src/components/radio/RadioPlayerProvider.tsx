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

/** Categoria estável do erro — facilita decidir UX (auto-retry, mensagens). */
export type RadioErrorKind =
  | 'no-url'
  | 'invalid-url'
  | 'no-source' // Servidor responde mas não há DJ/AutoDJ a emitir (ex.: Zeno 503)
  | 'forbidden' // 403 — geralmente Shoutcast/Icecast sem source
  | 'not-found' // 404
  | 'server-error' // 5xx genérico
  | 'mixed-content' // HTTPS site → HTTP stream
  | 'network' // Falha de ligação / timeout
  | 'unsupported' // Browser não suporta o formato
  | 'autoplay-blocked' // Política do browser
  | 'unknown';

interface RadioErrorInfo {
  kind: RadioErrorKind;
  message: string; // Mensagem amigável (pode ter \n)
  retriable: boolean; // Se faz sentido auto-retry
}

interface RadioPlayerContextValue {
  settings: RadioSettings;
  schedule: RadioProgram[];
  currentProgram: RadioProgram | null;
  loading: boolean;
  status: RadioPlayerStatus;
  error: string | null;
  errorKind: RadioErrorKind | null;
  /** Próximo retry em segundos (null se não houver). */
  nextRetryInSec: number | null;
  /** Número de tentativas falhadas seguidas. */
  attempts: number;
  volume: number; // 0..1
  muted: boolean;
  showMiniPlayer: boolean;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  retry: () => Promise<void>;
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

/** Reconhece provedores de streaming conhecidos para evitar gerar variantes inúteis. */
const detectProvider = (
  url: string
): 'zeno' | 'radioco' | 'shoutcast' | 'icecast-generic' | 'unknown' => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.endsWith('zeno.fm')) return 'zeno';
    if (host.endsWith('radio.co') || host.endsWith('streaming.radio.co')) return 'radioco';
    if (host.includes('shoutcast') || host.includes('streamingv2')) return 'shoutcast';
    return 'icecast-generic';
  } catch {
    return 'unknown';
  }
};

// ---------------------------------------------------------------------------
// Reset limpo do <audio> — aborta loads pendentes e liberta a conexão
// anterior antes de configurar uma nova source. Sem isto o browser pode ficar
// a alimentar o decoder com bytes de duas streams diferentes ao mesmo tempo,
// produzindo "chiar"/eco audível.
// ---------------------------------------------------------------------------
const resetAudio = (audio: HTMLAudioElement) => {
  try {
    audio.pause();
    // Limpar src dispara abort no browser; load() finaliza qualquer pedido pendente.
    audio.removeAttribute('src');
    audio.load();
  } catch {
    // ignore
  }
};

// ---------------------------------------------------------------------------
// Tenta reproduzir um URL. Faz reset limpo antes para evitar sobreposição.
// ---------------------------------------------------------------------------
const attemptPlay = async (
  audio: HTMLAudioElement,
  url: string
): Promise<{ ok: boolean; errorDetail?: string }> => {
  resetAudio(audio);
  try {
    // Definir src já dispara o algoritmo de selecção de recurso —
    // não chamar audio.load() de novo para não fazer abort+restart
    // (que pode criar artefactos audíveis).
    audio.src = url;
    await audio.play();
    return { ok: true };
  } catch (err: unknown) {
    const errName = err instanceof DOMException ? err.name : '';
    const errMsg = err instanceof Error ? err.message : String(err);
    const mediaCode = audio.error?.code;
    const mediaMsg = audio.error?.message;

    const detail = [
      errName && `DOMException: ${errName}`,
      errMsg,
      mediaCode !== undefined && `MediaError code: ${mediaCode}`,
      mediaMsg && `MediaError: ${mediaMsg}`,
    ]
      .filter(Boolean)
      .join(' | ');

    return { ok: false, errorDetail: detail };
  }
};

// ---------------------------------------------------------------------------
// Gera variações do URL para tentar reproduzir (apenas para servidores
// genéricos Icecast/Shoutcast onde mount-points alternativos fazem sentido).
// ---------------------------------------------------------------------------
const generateStreamVariants = (baseUrl: string): string[] => {
  const variants: string[] = [baseUrl];

  try {
    const u = new URL(baseUrl);

    if (/\.pls(\?|$)/i.test(u.pathname)) {
      const stem = u.origin + u.pathname.replace(/\.pls$/i, '');
      variants.push(stem, stem + '.mp3', stem + '/;stream.mp3');
    } else if (/\.m3u(\?|$)/i.test(u.pathname) && !/\.m3u8/i.test(u.pathname)) {
      const stem = u.origin + u.pathname.replace(/\.m3u$/i, '');
      variants.push(stem, stem + '.mp3', stem + '/;stream.mp3');
    }

    if (!u.pathname.includes(';')) {
      const sep = baseUrl.endsWith('/') ? '' : '/';
      variants.push(baseUrl + sep + ';');
      variants.push(baseUrl + sep + ';stream.mp3');
    }

    if (!u.searchParams.has('type')) {
      const withType = new URL(baseUrl);
      withType.searchParams.set('type', 'http');
      variants.push(withType.toString());
    }

    if (u.pathname.endsWith('/;') || u.pathname.endsWith(';')) {
      const clean = u.origin + u.pathname.replace(/\/?;$/, '') + u.search;
      variants.push(clean);
      variants.push(clean + '/stream');
      variants.push(clean + '/live');
    }

    if (u.pathname === '/' || u.pathname === '') {
      for (const mount of ['/stream', '/live', '/radio', '/listen']) {
        variants.push(u.origin + mount);
      }
    }
  } catch {
    // URL inválido, manter só o original
  }

  return [...new Set(variants)];
};

// ---------------------------------------------------------------------------
// Diagnóstico via fetch — devolve um RadioErrorInfo estruturado.
// ---------------------------------------------------------------------------
const diagnoseStreamError = async (
  url: string,
  pageProtocol: string
): Promise<RadioErrorInfo> => {
  // Mixed content: site HTTPS a tentar tocar HTTP — o browser bloqueia
  // antes mesmo de chegarmos aqui, mas garantimos a mensagem.
  try {
    const target = new URL(url);
    if (pageProtocol === 'https:' && target.protocol === 'http:') {
      return {
        kind: 'mixed-content',
        retriable: false,
        message:
          'O site está em HTTPS mas o stream é HTTP — o browser bloqueia este pedido.\n\n' +
          'Solução: configure o stream com URL HTTPS, ou use um relay com HTTPS.',
      };
    }
  } catch {
    // ignore
  }

  const provider = detectProvider(url);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'audio/mpeg, audio/aac, audio/ogg, audio/*;q=0.9, */*;q=0.1',
      },
    });
    clearTimeout(timer);

    // Ler corpo curto para detectar mensagens de servidores conhecidos
    let bodySnippet = '';
    try {
      const reader = res.body?.getReader();
      if (reader) {
        const { value } = await reader.read();
        if (value) {
          bodySnippet = new TextDecoder().decode(value.slice(0, 256));
        }
        try { reader.cancel(); } catch { /* ignore */ }
      }
    } catch { /* ignore */ }

    const ct = res.headers.get('content-type') || '';
    const looksLikeNoSource =
      bodySnippet.toLowerCase().includes('mount point not active') ||
      bodySnippet.toLowerCase().includes('source not connected') ||
      bodySnippet.toLowerCase().includes('no stream available');

    // ---- 503 ----
    // Mensagem unificada e amigável para o utilizador final:
    // não revelamos o provedor (Zeno/Icecast/etc.) nem termos técnicos.
    if (res.status === 503 || looksLikeNoSource) {
      // `provider` é detectado mas intencionalmente não usado na mensagem
      // ao utilizador final (mantido apenas para logs/diagnóstico futuro).
      void provider;
      return {
        kind: 'no-source',
        retriable: true,
        message:
          'De momento não estamos a emitir o sinal da rádio online, devido a um corte de energia na estação.\n\n' +
          'Voltaremos o mais rápido possível. Caso o sinal não seja restabelecido dentro de 5 minutos, contacte-nos: 921 923 232.',
      };
    }

    // ---- 403 ----
    if (res.status === 403) {
      const isShoutcast =
        bodySnippet.includes('ICY') ||
        bodySnippet.includes('SHOUTcast') ||
        bodySnippet.includes('Icecast');
      if (isShoutcast) {
        return {
          kind: 'forbidden',
          retriable: true,
          message:
            'O servidor recusou a ligação (403).\n\n' +
            'Pode ser por: nenhuma fonte a transmitir, limite de ouvintes atingido ou a conta de streaming estar suspensa.',
        };
      }
      return {
        kind: 'forbidden',
        retriable: false,
        message: 'O servidor recusou a ligação (403 Forbidden).',
      };
    }

    // ---- 404 ----
    if (res.status === 404) {
      return {
        kind: 'not-found',
        retriable: false,
        message: 'O URL do stream não foi encontrado (404). Verifique o endereço.',
      };
    }

    // ---- 5xx genérico ----
    if (res.status >= 500) {
      return {
        kind: 'server-error',
        retriable: true,
        message: `Erro interno do servidor (${res.status}). Tente mais tarde.`,
      };
    }

    // ---- HTML em vez de áudio ----
    if (ct.includes('text/html')) {
      return {
        kind: 'unsupported',
        retriable: false,
        message:
          'O URL devolveu uma página web (HTML) em vez de áudio.\n' +
          'Verifique se o URL aponta para o stream correcto.',
      };
    }

    // ---- Resposta OK mas o browser não toca ----
    if (res.ok && (ct.includes('audio') || ct.includes('octet-stream') || ct.includes('mpeg'))) {
      return {
        kind: 'unsupported',
        retriable: false,
        message:
          'O servidor está a transmitir, mas o browser não consegue reproduzir o formato.\n\n' +
          'Pode ser um problema de codec ou de mistura HTTP/HTTPS.',
      };
    }

    return {
      kind: 'unknown',
      retriable: true,
      message: `O servidor respondeu (${res.status}) mas o áudio não pôde ser reproduzido.`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes('abort') || msg.includes('AbortError')) {
      return {
        kind: 'network',
        retriable: true,
        message:
          'O servidor de stream não respondeu a tempo.\n\n' +
          '• O servidor pode estar offline\n' +
          '• A porta pode estar bloqueada por firewall',
      };
    }

    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      return {
        kind: 'network',
        retriable: true,
        message:
          'Não foi possível ligar ao servidor de stream.\n\n' +
          'Verifique a sua ligação à internet ou tente novamente mais tarde.',
      };
    }

    return {
      kind: 'unknown',
      retriable: true,
      message: 'Não foi possível diagnosticar o problema. Tente novamente mais tarde.',
    };
  }
};

// Auto-retry com back-off para erros recuperáveis ("no source", 503, etc.)
const RETRY_DELAYS_SEC = [10, 20, 30, 60, 120];

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const RadioPlayerProvider = ({ children }: RadioPlayerProviderProps) => {
  const { settings, schedule, loading, getCurrentProgram } = useRadioSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [status, setStatus] = useState<RadioPlayerStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<RadioErrorKind | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [nextRetryInSec, setNextRetryInSec] = useState<number | null>(null);
  const [volume, setVolumeState] = useState<number>(() => {
    const p = readPrefs();
    return typeof p.volume === 'number' ? p.volume : 0.8;
  });
  const [muted, setMutedState] = useState<boolean>(() => !!readPrefs().muted);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<RadioProgram | null>(null);

  // Refs para gerir tentativas
  const playAttemptRef = useRef(false);
  const userPausedRef = useRef(false);
  const retryTimerRef = useRef<number | null>(null);
  const retryCountdownRef = useRef<number | null>(null);

  // Actualiza volume/mute no elemento <audio>
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
    writePrefs({ volume, muted });
  }, [volume, muted]);

  // Refresca programa actual a cada minuto
  useEffect(() => {
    const update = () => setCurrentProgram(getCurrentProgram());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [getCurrentProgram]);

  // Limpa instância HLS
  const teardownHls = useCallback(() => {
    if (hlsRef.current) {
      try { hlsRef.current.destroy(); } catch { /* ignore */ }
      hlsRef.current = null;
    }
  }, []);

  // Limpa timers de retry
  const clearRetryTimers = useCallback(() => {
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (retryCountdownRef.current !== null) {
      window.clearInterval(retryCountdownRef.current);
      retryCountdownRef.current = null;
    }
    setNextRetryInSec(null);
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      teardownHls();
      clearRetryTimers();
    };
  }, [teardownHls, clearRetryTimers]);

  // Liga stream HLS ao elemento <audio>
  const attachHls = useCallback(
    (audio: HTMLAudioElement, url: string) => {
      const nativeHls = audio.canPlayType('application/vnd.apple.mpegurl') !== '';
      if (!nativeHls && Hls.isSupported()) {
        teardownHls();
        const hls = new Hls({ lowLatencyMode: true });
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (data.fatal) {
            setStatus('error');
            setErrorKind('unknown');
            setError('Falha ao carregar o stream HLS.');
          }
        });
        hls.loadSource(url);
        hls.attachMedia(audio);
        hlsRef.current = hls;
        return true;
      }
      return false;
    },
    [teardownHls]
  );

  // -----------------------------------------------------------------------
  // Função interna que faz o ciclo de tentativas + diagnóstico.
  // Não mexe em `attempts` nem em retry timers — quem chama trata disso.
  // -----------------------------------------------------------------------
  const runPlay = useCallback(async (): Promise<RadioErrorInfo | null> => {
    const audio = audioRef.current;
    if (!audio) {
      return { kind: 'unknown', retriable: false, message: 'Áudio indisponível.' };
    }

    // Guard: evitar tentativas concorrentes. Se já estamos a tentar,
    // ignoramos cliques rápidos para não criarmos várias conexões paralelas
    // ao stream (que produzem "chiar" e desfasamento de áudio).
    if (playAttemptRef.current) {
      return null;
    }

    const url = settings.stream_url?.trim();

    if (!url) {
      return {
        kind: 'no-url',
        retriable: false,
        message:
          'URL de transmissão não configurado. Aceda ao painel de administração → Rádio → Stream.',
      };
    }

    try {
      new URL(url);
    } catch {
      return {
        kind: 'invalid-url',
        retriable: false,
        message: `URL inválido: "${url}". Verifique o formato (ex: https://stream.exemplo.com/radio).`,
      };
    }

    setStatus('loading');
    setError(null);
    setErrorKind(null);
    setShowMiniPlayer(true);
    playAttemptRef.current = true;

    // Reset completo antes de qualquer tentativa: garante que não fica
    // nenhum buffer/conexão da reprodução anterior a sobrepor-se.
    teardownHls();
    resetAudio(audio);

    const provider = detectProvider(url);
    const isHls = isHlsStream(url, settings.stream_type);

    try {
      console.info('[RadioPlayer] A ligar:', url);

      // === 1. Tentativa directa (sem preflight para evitar conexão paralela) ===
      if (isHls) {
        const attached = attachHls(audio, url);
        if (attached) {
          try {
            await audio.play();
            console.info('[RadioPlayer] ▶ A reproduzir (HLS):', url);
            return null;
          } catch (err) {
            console.warn('[RadioPlayer] HLS play falhou:', err);
            teardownHls();
          }
        }
      }

      let result = await attemptPlay(audio, url);
      if (result.ok) {
        console.info('[RadioPlayer] ▶ A reproduzir:', url);
        return null;
      }

      const directError = result.errorDetail || '';

      // === 2. Variações do URL — apenas para servidores Icecast/Shoutcast genéricos ===
      // Para Zeno.fm, Radio.co e outros provedores conhecidos as variações são
      // contraproducentes (rejeitam, devolvem 405, etc.).
      const shouldTryVariants =
        provider === 'icecast-generic' ||
        provider === 'shoutcast' ||
        provider === 'unknown';

      if (shouldTryVariants) {
        const variants = generateStreamVariants(url).filter((v) => v !== url);
        if (variants.length > 0) {
          for (const variant of variants) {
            teardownHls();
            if (isHlsStream(variant, settings.stream_type)) {
              attachHls(audio, variant);
            }
            result = await attemptPlay(audio, variant);
            if (result.ok) {
              console.info('[RadioPlayer] ▶ A reproduzir (variante):', variant);
              return null;
            }
          }
        }
      }

      // === 3. Tudo falhou — diagnosticar via fetch ===
      // Antes do diagnóstico, libertar o <audio> para que o fetch
      // de diagnóstico não compita pela banda do servidor.
      resetAudio(audio);

      console.warn('[RadioPlayer] Reprodução falhou:', directError);

      if (directError.includes('NotAllowedError')) {
        return {
          kind: 'autoplay-blocked',
          retriable: false,
          message: 'O browser bloqueou a reprodução automática. Toque no botão de play.',
        };
      }
      if (directError.includes('AbortError')) {
        return {
          kind: 'unknown',
          retriable: true,
          message: 'A reprodução foi interrompida. Tente novamente.',
        };
      }

      const diag = await diagnoseStreamError(url, window.location.protocol);
      return diag;
    } finally {
      playAttemptRef.current = false;
    }
  }, [attachHls, teardownHls, settings.stream_url, settings.stream_type]);

  // Aplica resultado do runPlay ao estado
  const applyPlayResult = useCallback(
    (errInfo: RadioErrorInfo | null) => {
      if (errInfo === null) {
        setAttempts(0);
        setError(null);
        setErrorKind(null);
        clearRetryTimers();
        return;
      }
      setStatus('error');
      setError(errInfo.message);
      setErrorKind(errInfo.kind);
    },
    [clearRetryTimers]
  );

  // -----------------------------------------------------------------------
  // PLAY — reset tentativas (é uma acção do utilizador)
  // -----------------------------------------------------------------------
  const play = useCallback(async () => {
    userPausedRef.current = false;
    clearRetryTimers();
    setAttempts(0);
    const errInfo = await runPlay();
    applyPlayResult(errInfo);
    if (errInfo) setAttempts(1);
  }, [runPlay, applyPlayResult, clearRetryTimers]);

  // RETRY explícito (botão) — incrementa contagem mas é manual
  const retry = useCallback(async () => {
    userPausedRef.current = false;
    clearRetryTimers();
    const errInfo = await runPlay();
    applyPlayResult(errInfo);
    if (errInfo) setAttempts((n) => n + 1);
  }, [runPlay, applyPlayResult, clearRetryTimers]);

  // Auto-retry agendado (interno)
  const scheduleAutoRetry = useCallback(() => {
    clearRetryTimers();
    if (userPausedRef.current) return;
    const delaySec =
      RETRY_DELAYS_SEC[Math.min(attempts - 1, RETRY_DELAYS_SEC.length - 1)] ?? 60;

    setNextRetryInSec(delaySec);
    retryCountdownRef.current = window.setInterval(() => {
      setNextRetryInSec((s) => (s !== null && s > 0 ? s - 1 : 0));
    }, 1000);

    retryTimerRef.current = window.setTimeout(async () => {
      clearRetryTimers();
      if (userPausedRef.current) return;
      const errInfo = await runPlay();
      applyPlayResult(errInfo);
      if (errInfo) setAttempts((n) => n + 1);
    }, delaySec * 1000);
  }, [attempts, runPlay, applyPlayResult, clearRetryTimers]);

  // Sempre que entrarmos em estado de erro retriable → agendar auto-retry
  useEffect(() => {
    if (status !== 'error' || !errorKind) return;
    const retriableKinds: RadioErrorKind[] = [
      'no-source',
      'forbidden',
      'server-error',
      'network',
    ];
    if (!retriableKinds.includes(errorKind)) return;
    if (attempts === 0 || attempts > 8) return; // Parar após 8 tentativas
    scheduleAutoRetry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, errorKind, attempts]);

  const pause = useCallback(() => {
    userPausedRef.current = true;
    clearRetryTimers();
    const audio = audioRef.current;
    if (!audio) return;
    // Para streams ao vivo, "pausar" deve libertar a conexão e o buffer.
    // Resumir de um buffer antigo causa atraso e/ou glitches audíveis.
    teardownHls();
    resetAudio(audio);
    setStatus('paused');
  }, [clearRetryTimers, teardownHls]);

  const toggle = useCallback(async () => {
    if (status === 'playing' || status === 'loading') {
      pause();
    } else {
      await play();
    }
  }, [pause, play, status]);

  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.max(0, Math.min(1, v));
      setVolumeState(clamped);
      if (clamped > 0 && muted) setMutedState(false);
    },
    [muted]
  );

  const setMuted = useCallback((m: boolean) => setMutedState(m), []);

  const hideMiniPlayer = useCallback(() => {
    pause();
    setShowMiniPlayer(false);
  }, [pause]);

  const showMiniPlayerAgain = useCallback(() => setShowMiniPlayer(true), []);

  // MediaSession API (controlos no ecrã bloqueado)
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
      ms.setActionHandler('play', () => { play(); });
      ms.setActionHandler('pause', () => { pause(); });
      ms.setActionHandler('stop', () => { pause(); });
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
      errorKind,
      nextRetryInSec,
      attempts,
      volume,
      muted,
      showMiniPlayer,
      play,
      pause,
      toggle,
      retry,
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
      errorKind,
      nextRetryInSec,
      attempts,
      volume,
      muted,
      showMiniPlayer,
      play,
      pause,
      toggle,
      retry,
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
        onPlaying={() => {
          setStatus('playing');
          setAttempts(0);
          setError(null);
          setErrorKind(null);
          clearRetryTimers();
        }}
        onPause={() => setStatus((prev) => (prev === 'error' ? prev : 'paused'))}
        onWaiting={() => {
          if (!playAttemptRef.current) setStatus('loading');
        }}
        onCanPlay={() =>
          setStatus((prev) => (prev === 'loading' ? 'playing' : prev))
        }
        onEnded={() => setStatus('paused')}
        onError={() => {
          if (playAttemptRef.current) return;
          const audio = audioRef.current;
          if (!audio?.src || audio.src === window.location.href) return;
          // Se o stream cair durante a reprodução: marcar erro retriable
          setStatus('error');
          setErrorKind('network');
          setError('A ligação ao stream foi perdida. A tentar novamente...');
          setAttempts((n) => Math.max(n, 1));
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
