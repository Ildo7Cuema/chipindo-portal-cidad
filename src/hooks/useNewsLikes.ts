import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseNewsLikesReturn {
  likedNews: Set<string>;
  newsLikes: Record<string, number>;
  handleLike: (newsId: string) => Promise<void>;
  isLoading: boolean;
}

export const useNewsLikes = (): UseNewsLikesReturn => {
  const [likedNews, setLikedNews] = useState<Set<string>>(new Set());
  const [newsLikes, setNewsLikes] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUser();
    fetchLikes();
    setupRealtimeSubscription();
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchLikes = async () => {
    try {
      setIsLoading(true);
      
      // Carregar do localStorage como fallback
      const savedLikedNews = localStorage.getItem('likedNews');
      const savedNewsLikes = localStorage.getItem('newsLikes');
      
      if (savedLikedNews) {
        setLikedNews(new Set(JSON.parse(savedLikedNews)));
      }
      
      if (savedNewsLikes) {
        setNewsLikes(JSON.parse(savedNewsLikes));
      }

      // Buscar curtidas do Supabase (quando a tabela estiver disponível)
      try {
        // Verificar se a tabela existe tentando fazer uma query
        const { data: testQuery, error: testError } = await supabase
          .from('news')
          .select('id')
          .limit(1);

        if (testError) {
          console.log('Erro ao conectar com banco:', testError.message);
          return;
        }

        // Se chegou aqui, o banco está funcionando, tentar acessar news_likes
        // Buscar todas as curtidas (públicas e de usuários autenticados)
        const { data: allLikes, error } = await supabase
          .from('news_likes' as any)
          .select('news_id, user_id');

        if (error) {
          console.log('Tabela news_likes ainda não criada, usando localStorage:', error.message);
          return;
        }

        // Contar curtidas por notícia (todas as curtidas)
        const likesMap: Record<string, number> = {};
        allLikes?.forEach((like: any) => {
          likesMap[like.news_id] = (likesMap[like.news_id] || 0) + 1;
        });

        setNewsLikes(likesMap);

        // Se o usuário estiver autenticado, buscar suas curtidas específicas
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userLikes, error: userError } = await supabase
            .from('news_likes' as any)
            .select('news_id')
            .eq('user_id', user.id);

          if (!userError && userLikes) {
            // Atualizar estado de curtidas do usuário
            const likedNewsSet = new Set(userLikes?.map((like: any) => like.news_id) || []);
            setLikedNews(likedNewsSet);
          }
        }
      } catch (dbError) {
        console.log('Erro ao acessar banco de dados, usando localStorage:', dbError);
      }
    } catch (error) {
      console.error('Erro ao carregar curtidas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    // Implementar tempo real quando a tabela news_likes for criada
    try {
      const channel = supabase
        .channel('news_likes_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'news_likes'
          },
          (payload) => {
            console.log('Mudança nas curtidas:', payload);
            fetchLikes(); // Recarregar dados
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.log('Erro ao configurar tempo real, tabela news_likes pode não existir:', error);
    }
  };

  const handleLike = async (newsId: string) => {
    try {
      setIsLoading(true);
      
      const isCurrentlyLiked = likedNews.has(newsId);
      const currentLikes = newsLikes[newsId] || 0;
      
      let newLikedNews: Set<string>;
      let newNewsLikes: Record<string, number>;
      
      if (isCurrentlyLiked) {
        // Unlike
        newLikedNews = new Set(likedNews);
        newLikedNews.delete(newsId);
        newNewsLikes = {
          ...newsLikes,
          [newsId]: Math.max(0, currentLikes - 1)
        };
      } else {
        // Like
        newLikedNews = new Set([...likedNews, newsId]);
        newNewsLikes = {
          ...newsLikes,
          [newsId]: currentLikes + 1
        };
      }
      
      setLikedNews(newLikedNews);
      setNewsLikes(newNewsLikes);

      // Salvar no localStorage (sempre)
      localStorage.setItem('likedNews', JSON.stringify(Array.from(newLikedNews)));
      localStorage.setItem('newsLikes', JSON.stringify(newNewsLikes));

      // Persistir no Supabase (quando a tabela estiver disponível)
      try {
        console.log('Tentando persistir curtida no Supabase...');
        
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Usuário atual:', user ? 'Autenticado' : 'Público');
        
        if (user) {
          // Usuário autenticado - persistir com user_id
          if (isCurrentlyLiked) {
            // Remover curtida
            const { error: deleteError } = await supabase
              .from('news_likes' as any)
              .delete()
              .eq('news_id', newsId)
              .eq('user_id', user.id);
            
            if (deleteError) {
              console.error('Erro ao remover curtida:', deleteError);
              throw deleteError;
            }
          } else {
            // Adicionar curtida
            const { error: insertError } = await supabase
              .from('news_likes' as any)
              .insert({
                news_id: newsId,
                user_id: user.id
              });
            
            if (insertError) {
              console.error('Erro ao adicionar curtida:', insertError);
              throw insertError;
            }
          }
          console.log('✅ Curtida persistida no banco de dados (usuário autenticado)');
        } else {
          // Usuário não autenticado - persistir como curtida pública
          if (isCurrentlyLiked) {
            // Remover curtida pública
            const { error: deleteError } = await supabase
              .from('news_likes' as any)
              .delete()
              .eq('news_id', newsId)
              .eq('user_id', 'anonymous');
            
            if (deleteError) {
              console.error('Erro ao remover curtida pública:', deleteError);
              throw deleteError;
            }
          } else {
            // Adicionar curtida pública
            const { error: insertError } = await supabase
              .from('news_likes' as any)
              .insert({
                news_id: newsId,
                user_id: 'anonymous'
              });
            
            if (insertError) {
              console.error('Erro ao adicionar curtida pública:', insertError);
              throw insertError;
            }
          }
          console.log('✅ Curtida persistida no banco de dados (usuário público)');
        }
      } catch (dbError) {
        console.error('❌ Erro ao persistir no banco:', dbError);
        console.log('💡 Usando apenas localStorage como fallback');
        
        // Verificar se é erro de tabela não existente
        if (dbError && typeof dbError === 'object' && 'message' in dbError) {
          const errorMessage = (dbError as any).message;
          if (errorMessage.includes('relation "news_likes" does not exist')) {
            console.log('📋 Tabela news_likes não existe. Execute o script SQL para criá-la.');
          }
        }
      }

      toast.success(isCurrentlyLiked ? 'Curtida removida!' : 'Notícia curtida!');
    } catch (error) {
      console.error('Erro ao curtir notícia:', error);
      toast.error('Erro ao curtir notícia');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    likedNews,
    newsLikes,
    handleLike,
    isLoading
  };
}; 