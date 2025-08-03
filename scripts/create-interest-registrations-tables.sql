-- Script para criar tabelas de registros de interesse e notificações
-- Este script garante que todas as tabelas necessárias existam

-- Criar tabela de registros de interesse se não existir
CREATE TABLE IF NOT EXISTS public.interest_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  profession TEXT,
  experience_years INTEGER,
  areas_of_interest TEXT[] NOT NULL,
  additional_info TEXT,
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de notificações administrativas se não existir
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'interest_registration', 'new_user', 'news_published', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.interest_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "Public can insert interest registrations" ON public.interest_registrations;
DROP POLICY IF EXISTS "Admins can view all interest registrations" ON public.interest_registrations;
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.interest_registrations;
DROP POLICY IF EXISTS "Admins can update interest registrations" ON public.interest_registrations;
DROP POLICY IF EXISTS "Admins can delete interest registrations" ON public.interest_registrations;

DROP POLICY IF EXISTS "Admins can manage notifications" ON public.admin_notifications;

-- Criar políticas para interest_registrations
CREATE POLICY "Public can insert interest registrations" 
ON public.interest_registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all interest registrations" 
ON public.interest_registrations 
FOR SELECT 
USING (is_current_user_admin());

CREATE POLICY "Users can view their own registrations" 
ON public.interest_registrations 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update interest registrations" 
ON public.interest_registrations 
FOR UPDATE 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

CREATE POLICY "Admins can delete interest registrations" 
ON public.interest_registrations 
FOR DELETE 
USING (is_current_user_admin());

-- Criar políticas para admin_notifications
CREATE POLICY "Admins can manage notifications" 
ON public.admin_notifications 
FOR ALL 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Criar função para atualizar timestamps se não existir
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar timestamps
DROP TRIGGER IF EXISTS update_interest_registrations_updated_at ON public.interest_registrations;
CREATE TRIGGER update_interest_registrations_updated_at
BEFORE UPDATE ON public.interest_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_notifications_updated_at ON public.admin_notifications;
CREATE TRIGGER update_admin_notifications_updated_at
BEFORE UPDATE ON public.admin_notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar função para notificar quando um interesse é registrado
CREATE OR REPLACE FUNCTION public.notify_interest_registration()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.admin_notifications (
        type,
        title,
        message,
        data
    ) VALUES (
        'interest_registration',
        'Novo Registro de Interesse',
        'Uma nova pessoa registrou interesse em áreas do município.',
        jsonb_build_object(
            'registration_id', NEW.id,
            'full_name', NEW.full_name,
            'email', NEW.email,
            'areas_of_interest', NEW.areas_of_interest,
            'profession', NEW.profession
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para notificar automaticamente
DROP TRIGGER IF EXISTS trigger_notify_interest_registration ON public.interest_registrations;
CREATE TRIGGER trigger_notify_interest_registration
AFTER INSERT ON public.interest_registrations
FOR EACH ROW
EXECUTE FUNCTION public.notify_interest_registration();

-- Verificar se as tabelas foram criadas corretamente
SELECT 
    'interest_registrations' as table_name,
    COUNT(*) as row_count
FROM public.interest_registrations
UNION ALL
SELECT 
    'admin_notifications' as table_name,
    COUNT(*) as row_count
FROM public.admin_notifications;

-- Mostrar políticas criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('interest_registrations', 'admin_notifications'); 