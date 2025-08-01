import { useEffect, useRef } from 'react';

interface EventListenerOptions {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
}

interface SafeEventListener {
  add: (type: string, listener: EventListener, options?: EventListenerOptions) => void;
  remove: (type: string, listener: EventListener, options?: EventListenerOptions) => void;
  cleanup: () => void;
}

export const useSafeEventListeners = (): SafeEventListener => {
  const listenersRef = useRef<Map<string, Set<EventListener>>>(new Map());
  const cleanupRef = useRef<(() => void)[]>([]);

  const add = (type: string, listener: EventListener, options?: EventListenerOptions) => {
    const key = `${type}-${options?.capture ? 'capture' : 'bubble'}`;
    
    if (!listenersRef.current.has(key)) {
      listenersRef.current.set(key, new Set());
    }
    
    const listeners = listenersRef.current.get(key)!;
    
    // Verificar se o listener já existe
    if (listeners.has(listener)) {
      console.warn(`Listener for ${type} already exists, skipping...`);
      return;
    }
    
    listeners.add(listener);
    window.addEventListener(type, listener, options);
    
    // Adicionar função de cleanup
    const cleanup = () => {
      window.removeEventListener(type, listener, options);
      listeners.delete(listener);
    };
    
    cleanupRef.current.push(cleanup);
  };

  const remove = (type: string, listener: EventListener, options?: EventListenerOptions) => {
    const key = `${type}-${options?.capture ? 'capture' : 'bubble'}`;
    const listeners = listenersRef.current.get(key);
    
    if (listeners && listeners.has(listener)) {
      window.removeEventListener(type, listener, options);
      listeners.delete(listener);
    }
  };

  const cleanup = () => {
    cleanupRef.current.forEach(cleanupFn => cleanupFn());
    cleanupRef.current = [];
    listenersRef.current.clear();
  };

  useEffect(() => {
    return cleanup;
  }, []);

  return { add, remove, cleanup };
};

// Hook específico para gerenciar listeners de DOM de forma segura
export const useDOMErrorHandling = () => {
  const { add, cleanup } = useSafeEventListeners();

  useEffect(() => {
    const handleDOMError = (event: ErrorEvent) => {
      console.error('DOM Error caught:', event.error);
      
      // Prevenir propagação de erros DOM críticos
      if (event.error?.message?.includes('removeChild') || 
          event.error?.message?.includes('already has a listener')) {
        event.preventDefault();
        console.warn('DOM error prevented from propagating');
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled Promise Rejection:', event.reason);
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Limpar listeners antes de sair da página
      cleanup();
    };

    add('error', handleDOMError);
    add('unhandledrejection', handleUnhandledRejection);
    add('beforeunload', handleBeforeUnload);

    return () => {
      cleanup();
    };
  }, [add, cleanup]);
};

// Hook para gerenciar listeners de scroll de forma segura
export const useSafeScrollListener = (callback: () => void, options?: { throttle?: number }) => {
  const { add, cleanup } = useSafeEventListeners();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const throttledCallback = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback();
      }, options?.throttle || 16); // 60fps por padrão
    };

    add('scroll', throttledCallback, { passive: true });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      cleanup();
    };
  }, [callback, options?.throttle, add, cleanup]);
};

// Hook para gerenciar listeners de resize de forma segura
export const useSafeResizeListener = (callback: () => void, options?: { throttle?: number }) => {
  const { add, cleanup } = useSafeEventListeners();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const throttledCallback = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback();
      }, options?.throttle || 100); // 100ms por padrão
    };

    add('resize', throttledCallback, { passive: true });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      cleanup();
    };
  }, [callback, options?.throttle, add, cleanup]);
};

// Hook para gerenciar listeners de click de forma segura
export const useSafeClickListener = (callback: (event: MouseEvent) => void, options?: EventListenerOptions) => {
  const { add, cleanup } = useSafeEventListeners();

  useEffect(() => {
    add('click', callback, options);

    return cleanup;
  }, [callback, options, add, cleanup]);
};

// Hook para gerenciar listeners de keydown de forma segura
export const useSafeKeydownListener = (callback: (event: KeyboardEvent) => void, options?: EventListenerOptions) => {
  const { add, cleanup } = useSafeEventListeners();

  useEffect(() => {
    add('keydown', callback, options);

    return cleanup;
  }, [callback, options, add, cleanup]);
}; 