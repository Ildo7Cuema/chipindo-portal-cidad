import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get request body
    const { registrationId, notificationType, customMessage } = await req.json()

    if (!registrationId) {
      throw new Error('registrationId is required')
    }

    // Get registration details
    const { data: registration, error: registrationError } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events (
          title,
          date,
          event_time,
          location,
          organizer,
          contact,
          email
        )
      `)
      .eq('id', registrationId)
      .single()

    if (registrationError || !registration) {
      throw new Error('Registration not found')
    }

    const event = registration.events
    const participant = registration

    // Prepare email content based on notification type
    let subject = ''
    let htmlContent = ''

    switch (notificationType) {
      case 'registration_confirmation':
        subject = `Confirmação de Inscrição - ${event.title}`
        htmlContent = generateRegistrationConfirmationEmail(participant, event)
        break
      
      case 'event_reminder':
        subject = `Lembrete - ${event.title}`
        htmlContent = generateEventReminderEmail(participant, event)
        break
      
      case 'event_update':
        subject = `Atualização - ${event.title}`
        htmlContent = generateEventUpdateEmail(participant, event, customMessage)
        break
      
      case 'registration_cancelled':
        subject = `Inscrição Cancelada - ${event.title}`
        htmlContent = generateCancellationEmail(participant, event)
        break
      
      case 'custom':
        subject = `Notificação - ${event.title}`
        htmlContent = generateCustomEmail(participant, event, customMessage)
        break
      
      default:
        throw new Error('Invalid notification type')
    }

    // Send email using Supabase Auth email service
    const { error: emailError } = await supabase.auth.admin.sendRawEmail({
      to: participant.participant_email,
      subject: subject,
      html: htmlContent,
      from: 'eventos@chipindo.gov.ao'
    })

    if (emailError) {
      console.error('Email error:', emailError)
      throw new Error('Failed to send email')
    }

    // Log notification
    await supabase
      .from('notification_logs')
      .insert({
        registration_id: registrationId,
        notification_type: notificationType,
        recipient_email: participant.participant_email,
        sent_at: new Date().toISOString(),
        status: 'sent'
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

function generateRegistrationConfirmationEmail(participant: any, event: any) {
  const eventDate = new Date(event.date).toLocaleDateString('pt-AO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmação de Inscrição</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .event-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Inscrição Confirmada</h1>
          <p>Portal de Chipindo - Administração Municipal</p>
        </div>
        
        <div class="content">
          <h2>Olá ${participant.participant_name}!</h2>
          
          <p>Sua inscrição no evento <strong>${event.title}</strong> foi confirmada com sucesso.</p>
          
          <div class="event-details">
            <h3>📅 Detalhes do Evento</h3>
            <p><strong>Evento:</strong> ${event.title}</p>
            <p><strong>Data:</strong> ${eventDate}</p>
            <p><strong>Hora:</strong> ${event.event_time}</p>
            <p><strong>Local:</strong> ${event.location}</p>
            <p><strong>Organizador:</strong> ${event.organizer}</p>
          </div>
          
          <h3>📋 Informações Importantes</h3>
          <ul>
            <li>Chegue 15 minutos antes do início do evento</li>
            <li>Traga um documento de identificação</li>
            <li>Em caso de cancelamento, contacte-nos com antecedência</li>
            <li>Mantenha este email como comprovante de inscrição</li>
          </ul>
          
          <h3>📞 Contactos</h3>
          <p>Para dúvidas ou alterações:</p>
          <p><strong>Email:</strong> ${event.email}</p>
          <p><strong>Telefone:</strong> ${event.contact}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://chipindo.gov.ao/eventos" class="button">Ver Mais Eventos</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Portal de Chipindo - Administração Municipal</p>
          <p>Este é um email automático, não responda a esta mensagem.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateEventReminderEmail(participant: any, event: any) {
  const eventDate = new Date(event.date).toLocaleDateString('pt-AO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Lembrete do Evento</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #fbbf24); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .event-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Lembrete do Evento</h1>
          <p>Portal de Chipindo - Administração Municipal</p>
        </div>
        
        <div class="content">
          <h2>Olá ${participant.participant_name}!</h2>
          
          <p>Este é um lembrete amigável sobre o evento <strong>${event.title}</strong> que acontece amanhã.</p>
          
          <div class="event-details">
            <h3>📅 Detalhes do Evento</h3>
            <p><strong>Evento:</strong> ${event.title}</p>
            <p><strong>Data:</strong> ${eventDate}</p>
            <p><strong>Hora:</strong> ${event.event_time}</p>
            <p><strong>Local:</strong> ${event.location}</p>
          </div>
          
          <h3>✅ Confirmação</h3>
          <p>Sua inscrição está confirmada e aguardamos sua presença!</p>
          
          <h3>📋 Não se esqueça</h3>
          <ul>
            <li>Chegue 15 minutos antes do início</li>
            <li>Traga documento de identificação</li>
            <li>Use roupas confortáveis</li>
            <li>Traga água se necessário</li>
          </ul>
          
          <h3>📞 Contactos</h3>
          <p>Para dúvidas ou cancelamento:</p>
          <p><strong>Email:</strong> ${event.email}</p>
          <p><strong>Telefone:</strong> ${event.contact}</p>
        </div>
        
        <div class="footer">
          <p>Portal de Chipindo - Administração Municipal</p>
          <p>Este é um email automático, não responda a esta mensagem.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateEventUpdateEmail(participant: any, event: any, customMessage: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Atualização do Evento</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .update-box { background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📢 Atualização do Evento</h1>
          <p>Portal de Chipindo - Administração Municipal</p>
        </div>
        
        <div class="content">
          <h2>Olá ${participant.participant_name}!</h2>
          
          <p>Informamos que houve uma atualização no evento <strong>${event.title}</strong>.</p>
          
          <div class="update-box">
            <h3>📝 Atualização</h3>
            <p>${customMessage}</p>
          </div>
          
          <h3>📞 Contactos</h3>
          <p>Para dúvidas:</p>
          <p><strong>Email:</strong> ${event.email}</p>
          <p><strong>Telefone:</strong> ${event.contact}</p>
        </div>
        
        <div class="footer">
          <p>Portal de Chipindo - Administração Municipal</p>
          <p>Este é um email automático, não responda a esta mensagem.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateCancellationEmail(participant: any, event: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Inscrição Cancelada</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Inscrição Cancelada</h1>
          <p>Portal de Chipindo - Administração Municipal</p>
        </div>
        
        <div class="content">
          <h2>Olá ${participant.participant_name}!</h2>
          
          <p>Sua inscrição no evento <strong>${event.title}</strong> foi cancelada conforme solicitado.</p>
          
          <h3>📞 Contactos</h3>
          <p>Para futuras inscrições:</p>
          <p><strong>Email:</strong> ${event.email}</p>
          <p><strong>Telefone:</strong> ${event.contact}</p>
        </div>
        
        <div class="footer">
          <p>Portal de Chipindo - Administração Municipal</p>
          <p>Este é um email automático, não responda a esta mensagem.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateCustomEmail(participant: any, event: any, customMessage: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Notificação do Evento</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📢 Notificação</h1>
          <p>Portal de Chipindo - Administração Municipal</p>
        </div>
        
        <div class="content">
          <h2>Olá ${participant.participant_name}!</h2>
          
          <p>Recebemos uma notificação relacionada ao evento <strong>${event.title}</strong>.</p>
          
          <div class="message-box">
            <h3>💬 Mensagem</h3>
            <p>${customMessage}</p>
          </div>
          
          <h3>📞 Contactos</h3>
          <p>Para dúvidas:</p>
          <p><strong>Email:</strong> ${event.email}</p>
          <p><strong>Telefone:</strong> ${event.contact}</p>
        </div>
        
        <div class="footer">
          <p>Portal de Chipindo - Administração Municipal</p>
          <p>Este é um email automático, não responda a esta mensagem.</p>
        </div>
      </div>
    </body>
    </html>
  `
} 