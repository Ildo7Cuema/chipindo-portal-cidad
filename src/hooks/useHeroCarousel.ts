import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HeroCarouselImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  active: boolean;
  order_index: number;
  link_url?: string | null;
  button_text?: string | null;
  overlay_opacity?: number;
  created_at: string;
  updated_at: string;
}

export function useHeroCarousel() {
  const [images, setImages] = useState<HeroCarouselImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      console.log('🔄 Buscando imagens do carrossel...');
      const { data, error } = await supabase
        .from('hero_carousel')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('❌ Error fetching hero carousel images:', error);
        toast.error('Erro ao carregar imagens do carrossel');
      } else {
        console.log('✅ Imagens carregadas:', data?.length || 0, 'imagens');
        console.log('📋 Dados das imagens:', data);
        setImages(data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching hero carousel images:', error);
      toast.error('Erro ao carregar imagens do carrossel');
    } finally {
      setLoading(false);
    }
  };

  const createImage = async (imageData: Omit<HeroCarouselImage, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('hero_carousel')
        .insert([imageData])
        .select()
        .single();

      if (error) throw error;

      setImages(prev => [...prev, data].sort((a, b) => a.order_index - b.order_index));
      toast.success('Imagem adicionada com sucesso');
      return data;
    } catch (error) {
      console.error('Error creating hero carousel image:', error);
      toast.error('Erro ao adicionar imagem');
      throw error;
    }
  };

  const updateImage = async (id: string, updates: Partial<HeroCarouselImage>) => {
    try {
      const { data, error } = await supabase
        .from('hero_carousel')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setImages(prev => 
        prev.map(img => img.id === id ? data : img)
           .sort((a, b) => a.order_index - b.order_index)
      );
      toast.success('Imagem atualizada com sucesso');
      return data;
    } catch (error) {
      console.error('Error updating hero carousel image:', error);
      toast.error('Erro ao atualizar imagem');
      throw error;
    }
  };

  const deleteImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('hero_carousel')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== id));
      toast.success('Imagem removida com sucesso');
    } catch (error) {
      console.error('Error deleting hero carousel image:', error);
      toast.error('Erro ao remover imagem');
      throw error;
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hero-carousel')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('hero-carousel')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao fazer upload da imagem');
      throw error;
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    loading,
    fetchImages,
    createImage,
    updateImage,
    deleteImage,
    uploadImage
  };
}