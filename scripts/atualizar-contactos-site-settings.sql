-- Script para atualizar os campos de contacto na tabela site_settings
-- Execute este script no SQL Editor do Supabase

UPDATE public.site_settings
SET 
    contact_email = 'geral@chipindo.gov.ao',
    contact_phone = '+244 261 220 001',
    contact_address = 'Rua Principal, Centro Administrativo, Chipindo, Huíla, Angola',
    opening_hours_weekdays = 'Segunda a Sexta: 08h00 - 16h00',
    opening_hours_saturday = 'Encerrado',
    opening_hours_sunday = 'Encerrado',
    updated_at = NOW()
WHERE contact_email IS NULL OR contact_email = '';

-- Verificar os dados atualizados
SELECT 
    id,
    contact_email,
    contact_phone,
    contact_address,
    opening_hours_weekdays,
    opening_hours_saturday,
    opening_hours_sunday
FROM public.site_settings;
