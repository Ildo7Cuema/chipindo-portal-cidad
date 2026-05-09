/**
 * Utilitário para validar/testar URLs de stream da rádio.
 * Permite ao painel admin verificar a saúde do stream antes de gravar.
 */

export type StreamStatus =
  | 'online' // 200 + content-type de áudio
  | 'no-source' // servidor activo mas sem DJ (Zeno 503, Icecast "mount not active", etc.)
  | 'forbidden' // 403
  | 'not-found' // 404
  | 'server-error' // 5xx (excepto 503 sem fonte)
  | 'invalid-url' // URL mal-formado
  | 'mixed-content' // HTTPS site → HTTP stream
  | 'network' // erro de rede / timeout
  | 'unknown'; // não foi possível diagnosticar

export interface StreamCheckResult {
  status: StreamStatus;
  message: string;
  /** Provider detectado (zeno, radioco, icecast-generic, etc.) */
  provider?: string;
  /** Status HTTP devolvido (se aplicável). */
  httpStatus?: number;
  /** Content-type da resposta (se aplicável). */
  contentType?: string;
}

const detectProvider = (url: string): string => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.endsWith('zeno.fm')) return 'Zeno.fm';
    if (host.endsWith('radio.co') || host.endsWith('streaming.radio.co')) return 'Radio.co';
    if (host.includes('shoutcast') || host.includes('streamingv2')) return 'Shoutcast';
    if (host.includes('streema')) return 'Streema';
    return 'genérico (Icecast/Shoutcast)';
  } catch {
    return 'desconhecido';
  }
};

export const checkRadioStream = async (
  rawUrl: string
): Promise<StreamCheckResult> => {
  const url = rawUrl?.trim();
  if (!url) {
    return {
      status: 'invalid-url',
      message: 'URL vazio. Insira o endereço do stream.',
    };
  }

  // Validar URL
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return {
      status: 'invalid-url',
      message: 'URL inválido. Verifique o formato (ex: https://stream.exemplo.com/radio).',
    };
  }

  const provider = detectProvider(url);

  // Mixed content
  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    parsed.protocol === 'http:'
  ) {
    return {
      status: 'mixed-content',
      provider,
      message:
        'O painel está em HTTPS mas o stream usa HTTP — o browser irá bloquear. Use um URL HTTPS ou um relay com HTTPS.',
    };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'audio/mpeg, audio/aac, audio/ogg, audio/*;q=0.9, */*;q=0.1',
      },
    });
    clearTimeout(timer);

    const httpStatus = res.status;
    const contentType = res.headers.get('content-type') || '';

    // Ler corpo curto para detectar mensagens conhecidas
    let bodySnippet = '';
    try {
      const reader = res.body?.getReader();
      if (reader) {
        const { value } = await reader.read();
        if (value) bodySnippet = new TextDecoder().decode(value.slice(0, 256));
        try { reader.cancel(); } catch { /* ignore */ }
      }
    } catch { /* ignore */ }

    const looksLikeNoSource =
      bodySnippet.toLowerCase().includes('mount point not active') ||
      bodySnippet.toLowerCase().includes('source not connected') ||
      bodySnippet.toLowerCase().includes('no stream available');

    // 503 ou body com mensagem "no source"
    if (httpStatus === 503 || looksLikeNoSource) {
      return {
        status: 'no-source',
        provider,
        httpStatus,
        contentType,
        message:
          provider === 'Zeno.fm'
            ? 'O servidor Zeno.fm está activo mas nenhuma fonte (DJ/AutoDJ) está ligada. Inicie a transmissão a partir do seu software (BUTT, AutoDJ, Mixxx, etc.).'
            : 'O servidor responde mas nenhuma fonte está a transmitir. Ligue um software de transmissão (BUTT, SAM Broadcaster, AutoDJ).',
      };
    }

    // 403
    if (httpStatus === 403) {
      return {
        status: 'forbidden',
        provider,
        httpStatus,
        contentType,
        message:
          'O servidor recusou (403). Pode ser por: nenhuma fonte ligada, limite de ouvintes ou conta suspensa.',
      };
    }

    // 404
    if (httpStatus === 404) {
      return {
        status: 'not-found',
        provider,
        httpStatus,
        contentType,
        message: 'Stream não encontrado (404). Verifique o URL.',
      };
    }

    // 5xx
    if (httpStatus >= 500) {
      return {
        status: 'server-error',
        provider,
        httpStatus,
        contentType,
        message: `Erro do servidor (${httpStatus}). Tente mais tarde.`,
      };
    }

    // 200 OK
    if (res.ok) {
      const isAudio =
        contentType.includes('audio') ||
        contentType.includes('octet-stream') ||
        contentType.includes('mpeg') ||
        contentType.includes('aac') ||
        contentType.includes('ogg');

      if (isAudio) {
        return {
          status: 'online',
          provider,
          httpStatus,
          contentType,
          message: `Stream activo e a transmitir (${contentType.split(';')[0] || 'áudio'}).`,
        };
      }

      if (contentType.includes('text/html')) {
        return {
          status: 'unknown',
          provider,
          httpStatus,
          contentType,
          message:
            'O URL devolveu HTML, não áudio. Confirme se é mesmo a URL do stream (e não da página da rádio).',
        };
      }

      // Aceitar resposta 200 sem content-type claro como provável OK
      return {
        status: 'online',
        provider,
        httpStatus,
        contentType,
        message: 'Stream activo (formato não identificado, mas servidor responde com 200).',
      };
    }

    return {
      status: 'unknown',
      provider,
      httpStatus,
      contentType,
      message: `Resposta inesperada do servidor (${httpStatus}).`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('abort') || msg.includes('AbortError')) {
      return {
        status: 'network',
        provider,
        message: 'O servidor não respondeu a tempo (timeout). Pode estar offline.',
      };
    }
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      return {
        status: 'network',
        provider,
        message:
          'Não foi possível ligar ao servidor de stream. Verifique a internet ou se o domínio aceita CORS.',
      };
    }
    return {
      status: 'unknown',
      provider,
      message: 'Erro desconhecido ao verificar o stream.',
    };
  }
};
