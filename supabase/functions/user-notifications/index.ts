import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  try {
    const { action, userData, adminData, oldValues, newValues } = await req.json();

    // Configurações do email
    const emailConfig = {
      from: 'noreply@chipindo-portal-cidad.ao',
      to: userData.email,
      subject: '',
      html: ''
    };

    // Determinar assunto e conteúdo baseado na ação
    switch (action) {
      case 'CREATE':
        emailConfig.subject = 'Conta Criada - Portal Cidadão de Chipindo';
        emailConfig.html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Bem-vindo ao Portal Cidadão de Chipindo!</h2>
            <p>Olá ${userData.full_name},</p>
            <p>A sua conta foi criada com sucesso pelo administrador ${adminData.full_name}.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Detalhes da Conta:</h3>
              <p><strong>Email:</strong> ${userData.email}</p>
              <p><strong>Nome:</strong> ${userData.full_name}</p>
              <p><strong>Função:</strong> ${getRoleLabel(userData.role)}</p>
              ${userData.setor_id ? `<p><strong>Setor:</strong> ${getSetorName(userData.setor_id)}</p>` : ''}
            </div>
            <p>Para aceder ao sistema, utilize o seu email e a senha temporária fornecida pelo administrador.</p>
            <p><strong>Importante:</strong> Por favor, altere a sua senha no primeiro login por questões de segurança.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                Esta é uma notificação automática do Portal Cidadão de Chipindo.<br>
                Se não solicitou esta conta, contacte o administrador.
              </p>
            </div>
          </div>
        `;
        break;

      case 'UPDATE':
        emailConfig.subject = 'Conta Atualizada - Portal Cidadão de Chipindo';
        emailConfig.html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Conta Atualizada</h2>
            <p>Olá ${userData.full_name},</p>
            <p>A sua conta foi atualizada pelo administrador ${adminData.full_name}.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Alterações Realizadas:</h3>
              ${generateChangesList(oldValues, newValues)}
            </div>
            <p>Se não reconhece estas alterações, contacte imediatamente o administrador.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                Esta é uma notificação automática do Portal Cidadão de Chipindo.
              </p>
            </div>
          </div>
        `;
        break;

      case 'BLOCK':
        emailConfig.subject = 'Conta Bloqueada - Portal Cidadão de Chipindo';
        emailConfig.html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Conta Bloqueada</h2>
            <p>Olá ${userData.full_name},</p>
            <p>A sua conta foi bloqueada pelo administrador ${adminData.full_name}.</p>
            <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <p style="margin: 0; color: #dc2626;">
                <strong>Atenção:</strong> A sua conta está temporariamente inacessível.
              </p>
            </div>
            <p>Para resolver esta situação, contacte o administrador do sistema.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                Esta é uma notificação automática do Portal Cidadão de Chipindo.
              </p>
            </div>
          </div>
        `;
        break;

      case 'UNBLOCK':
        emailConfig.subject = 'Conta Desbloqueada - Portal Cidadão de Chipindo';
        emailConfig.html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Conta Desbloqueada</h2>
            <p>Olá ${userData.full_name},</p>
            <p>A sua conta foi desbloqueada pelo administrador ${adminData.full_name}.</p>
            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
              <p style="margin: 0; color: #059669;">
                <strong>Boa notícia:</strong> A sua conta está novamente acessível.
              </p>
            </div>
            <p>Pode agora aceder normalmente ao sistema.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                Esta é uma notificação automática do Portal Cidadão de Chipindo.
              </p>
            </div>
          </div>
        `;
        break;

      case 'ROLE_CHANGE':
        emailConfig.subject = 'Função Alterada - Portal Cidadão de Chipindo';
        emailConfig.html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Função Alterada</h2>
            <p>Olá ${userData.full_name},</p>
            <p>A sua função no sistema foi alterada pelo administrador ${adminData.full_name}.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Alteração de Função:</h3>
              <p><strong>Função Anterior:</strong> ${getRoleLabel(oldValues.role)}</p>
              <p><strong>Nova Função:</strong> ${getRoleLabel(newValues.role)}</p>
              ${newValues.setor_id ? `<p><strong>Setor Atribuído:</strong> ${getSetorName(newValues.setor_id)}</p>` : ''}
            </div>
            <p>Esta alteração pode afetar as suas permissões de acesso no sistema.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                Esta é uma notificação automática do Portal Cidadão de Chipindo.
              </p>
            </div>
          </div>
        `;
        break;

      case 'DELETE':
        emailConfig.subject = 'Conta Removida - Portal Cidadão de Chipindo';
        emailConfig.html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Conta Removida</h2>
            <p>Olá ${userData.full_name},</p>
            <p>A sua conta foi removida do sistema pelo administrador ${adminData.full_name}.</p>
            <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <p style="margin: 0; color: #dc2626;">
                <strong>Atenção:</strong> A sua conta não está mais ativa no sistema.
              </p>
            </div>
            <p>Se acredita que esta ação foi um erro, contacte imediatamente o administrador.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                Esta é uma notificação automática do Portal Cidadão de Chipindo.
              </p>
            </div>
          </div>
        `;
        break;

      default:
        return new Response(JSON.stringify({ error: 'Ação não reconhecida' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // Enviar email usando Resend ou outro serviço
    const emailResponse = await sendEmail(emailConfig);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Notificação enviada com sucesso',
      emailResponse 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending user notification:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro ao enviar notificação',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Funções auxiliares
function getRoleLabel(role: string): string {
  const roleLabels: Record<string, string> = {
    'admin': 'Administrador',
    'editor': 'Editor',
    'user': 'Utilizador',
    'educacao': 'Educação',
    'saude': 'Saúde',
    'agricultura': 'Agricultura',
    'sector-mineiro': 'Setor Mineiro',
    'desenvolvimento-economico': 'Desenvolvimento Económico',
    'cultura': 'Cultura',
    'tecnologia': 'Tecnologia',
    'energia-agua': 'Energia e Água'
  };
  return roleLabels[role] || role;
}

function getSetorName(setorId: string): string {
  // Esta função deveria buscar o nome do setor na base de dados
  // Por agora, retorna um valor genérico
  return 'Setor Específico';
}

function generateChangesList(oldValues: any, newValues: any): string {
  const changes: string[] = [];
  
  if (oldValues.email !== newValues.email) {
    changes.push(`<li><strong>Email:</strong> ${oldValues.email} → ${newValues.email}</li>`);
  }
  
  if (oldValues.full_name !== newValues.full_name) {
    changes.push(`<li><strong>Nome:</strong> ${oldValues.full_name} → ${newValues.full_name}</li>`);
  }
  
  if (oldValues.role !== newValues.role) {
    changes.push(`<li><strong>Função:</strong> ${getRoleLabel(oldValues.role)} → ${getRoleLabel(newValues.role)}</li>`);
  }
  
  if (oldValues.setor_id !== newValues.setor_id) {
    changes.push(`<li><strong>Setor:</strong> ${oldValues.setor_id ? getSetorName(oldValues.setor_id) : 'Nenhum'} → ${newValues.setor_id ? getSetorName(newValues.setor_id) : 'Nenhum'}</li>`);
  }
  
  return changes.length > 0 ? `<ul style="margin: 0; padding-left: 20px;">${changes.join('')}</ul>` : '<p>Nenhuma alteração específica registada.</p>';
}

async function sendEmail(emailConfig: any) {
  // Implementar envio de email usando Resend, SendGrid, ou outro serviço
  // Por agora, simula o envio
  console.log('Enviando email:', emailConfig);
  
  // Exemplo usando Resend (requer configuração)
  /*
  const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
  
  const { data, error } = await resend.emails.send({
    from: emailConfig.from,
    to: emailConfig.to,
    subject: emailConfig.subject,
    html: emailConfig.html
  });
  
  if (error) {
    throw new Error(`Erro ao enviar email: ${error.message}`);
  }
  
  return data;
  */
  
  // Simulação para desenvolvimento
  return { id: 'simulated-email-id', status: 'sent' };
} 