import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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
    const { to, subject, body, html, from } = await req.json()

    // Validate required fields
    if (!to || !subject || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Configure SMTP client
    const client = new SmtpClient()

    // Use environment variables for SMTP configuration
    await client.connectTLS({
      hostname: Deno.env.get('SMTP_HOST') || 'smtp.gmail.com',
      port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
      username: Deno.env.get('SMTP_USERNAME') || '',
      password: Deno.env.get('SMTP_PASSWORD') || '',
    })

    // Send email
    await client.send({
      from: from || Deno.env.get('SMTP_FROM') || 'noreply@chipindo.gov.ao',
      to: to,
      subject: subject,
      content: html || body,
      html: html || undefined,
    })

    await client.close()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        to: to,
        subject: subject
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 