const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente necessárias não encontradas');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigrations() {
  console.log('🚀 Aplicando migrações de solicitações de serviços...\n');

  try {
    // 1. Criar tabela de serviços se não existir
    console.log('📋 1. Criando tabela de serviços...');
    const { error: servicosError } = await supabase.rpc('exec_sql', {
      sql_query: `
        -- Create servicos table if it doesn't exist
        CREATE TABLE IF NOT EXISTS servicos (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          direcao TEXT NOT NULL,
          categoria TEXT NOT NULL,
          icon TEXT DEFAULT 'FileTextIcon',
          requisitos TEXT[] DEFAULT '{}',
          documentos TEXT[] DEFAULT '{}',
          horario TEXT NOT NULL,
          localizacao TEXT NOT NULL,
          contacto TEXT NOT NULL,
          email TEXT NOT NULL,
          prazo TEXT NOT NULL,
          taxa TEXT NOT NULL,
          prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
          digital BOOLEAN DEFAULT FALSE,
          ativo BOOLEAN DEFAULT TRUE,
          views INTEGER DEFAULT 0,
          requests INTEGER DEFAULT 0,
          ordem INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_servicos_direcao ON servicos(direcao);
        CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON servicos(categoria);
        CREATE INDEX IF NOT EXISTS idx_servicos_ativo ON servicos(ativo);
        CREATE INDEX IF NOT EXISTS idx_servicos_ordem ON servicos(ordem);

        -- Enable Row Level Security
        ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Public can view active services" ON servicos
          FOR SELECT USING (ativo = true);

        CREATE POLICY "Admins can manage all services" ON servicos
          FOR ALL USING (auth.role() = 'authenticated');

        -- Create function to update updated_at timestamp
        CREATE OR REPLACE FUNCTION update_servicos_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Create trigger for updated_at
        CREATE TRIGGER update_servicos_updated_at
          BEFORE UPDATE ON servicos
          FOR EACH ROW
          EXECUTE FUNCTION update_servicos_updated_at();

        -- Grant permissions
        GRANT SELECT ON servicos TO anon;
        GRANT ALL ON servicos TO authenticated;
      `
    });

    if (servicosError) {
      console.error('❌ Erro ao criar tabela de serviços:', servicosError);
      throw servicosError;
    }
    console.log('✅ Tabela de serviços criada/verificada');

    // 2. Inserir dados de exemplo se a tabela estiver vazia
    console.log('📝 2. Inserindo dados de exemplo...');
    const { data: existingServices, error: checkError } = await supabase
      .from('servicos')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Erro ao verificar serviços existentes:', checkError);
      throw checkError;
    }

    if (!existingServices || existingServices.length === 0) {
      const { error: insertError } = await supabase.rpc('exec_sql', {
        sql_query: `
          INSERT INTO servicos (title, description, direcao, categoria, icon, requisitos, documentos, horario, localizacao, contacto, email, prazo, taxa, prioridade, digital, ordem) VALUES
          (
            'Registo de Nascimento',
            'Registo oficial de nascimento de crianças no município',
            'Departamento Administrativo',
            'Documentação',
            'FileTextIcon',
            ARRAY['Certidão médica de nascimento', 'Bilhete de identidade dos pais', 'Comprovativo de residência'],
            ARRAY['Formulário de registo de nascimento', 'Declaração de paternidade'],
            'Segunda a Sexta: 8h00 - 15h00',
            'Edifício Administrativo Municipal',
            '+244 123 456 789',
            'admin@chipindo.gov.ao',
            '5 dias úteis',
            'Gratuito',
            'alta',
            FALSE,
            1
          ),
          (
            'Bilhete de Identidade',
            'Emissão de bilhete de identidade para cidadãos',
            'Departamento Administrativo',
            'Documentação',
            'UserIcon',
            ARRAY['Certidão de nascimento', 'Fotografia 3x4', 'Comprovativo de residência'],
            ARRAY['Formulário de pedido de BI', 'Declaração de residência'],
            'Segunda a Sexta: 8h00 - 15h00',
            'Edifício Administrativo Municipal',
            '+244 123 456 789',
            'admin@chipindo.gov.ao',
            '15 dias úteis',
            '5.000 Kz',
            'alta',
            FALSE,
            2
          ),
          (
            'Licença de Construção',
            'Autorização para construção de edifícios',
            'Departamento de Obras Públicas',
            'Licenciamento',
            'HammerIcon',
            ARRAY['Plano de construção', 'Comprovativo de propriedade', 'Estudo de impacto ambiental'],
            ARRAY['Formulário de licença', 'Planta do terreno', 'Especificações técnicas'],
            'Segunda a Sexta: 8h00 - 15h00',
            'Departamento de Obras Públicas',
            '+244 123 456 790',
            'obras@chipindo.gov.ao',
            '30 dias úteis',
            '25.000 Kz',
            'media',
            FALSE,
            3
          ),
          (
            'Matrícula Escolar',
            'Inscrição de alunos nas escolas municipais',
            'Departamento de Educação',
            'Educação',
            'GraduationCapIcon',
            ARRAY['Certidão de nascimento', 'Cartão de vacinação', 'Comprovativo de residência'],
            ARRAY['Formulário de matrícula', 'Declaração de responsabilidade'],
            'Segunda a Sexta: 8h00 - 15h00',
            'Departamento de Educação',
            '+244 123 456 791',
            'educacao@chipindo.gov.ao',
            '3 dias úteis',
            'Gratuito',
            'alta',
            FALSE,
            4
          ),
          (
            'Consulta Médica',
            'Agendamento de consultas médicas',
            'Departamento de Saúde',
            'Saúde',
            'HeartIcon',
            ARRAY['Bilhete de identidade', 'Cartão de utente'],
            ARRAY['Formulário de agendamento'],
            'Segunda a Sexta: 8h00 - 16h00',
            'Centro de Saúde Municipal',
            '+244 123 456 792',
            'saude@chipindo.gov.ao',
            '1 dia útil',
            'Gratuito',
            'alta',
            FALSE,
            5
          ),
          (
            'Licença Comercial',
            'Autorização para atividade comercial',
            'Departamento de Finanças',
            'Licenciamento',
            'DollarSignIcon',
            ARRAY['Bilhete de identidade', 'Comprovativo de residência', 'Plano de negócio'],
            ARRAY['Formulário de licença comercial', 'Declaração de responsabilidade'],
            'Segunda a Sexta: 8h00 - 15h00',
            'Departamento de Finanças',
            '+244 123 456 793',
            'financas@chipindo.gov.ao',
            '10 dias úteis',
            '15.000 Kz',
            'media',
            FALSE,
            6
          );
        `
      });

      if (insertError) {
        console.error('❌ Erro ao inserir dados de exemplo:', insertError);
        throw insertError;
      }
      console.log('✅ Dados de exemplo inseridos');
    } else {
      console.log('✅ Dados de exemplo já existem');
    }

    // 3. Criar tabela de solicitações de serviços
    console.log('📋 3. Criando tabela de solicitações de serviços...');
    const { error: requestsError } = await supabase.rpc('exec_sql', {
      sql_query: `
        -- Create service requests table
        CREATE TABLE IF NOT EXISTS service_requests (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          service_id UUID REFERENCES servicos(id) ON DELETE CASCADE,
          service_name TEXT NOT NULL,
          service_direction TEXT NOT NULL,
          requester_name TEXT NOT NULL,
          requester_email TEXT NOT NULL,
          requester_phone TEXT,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
          priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
          assigned_to UUID REFERENCES auth.users(id),
          admin_notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          completed_at TIMESTAMP WITH TIME ZONE,
          notification_sent BOOLEAN DEFAULT FALSE,
          notification_sent_at TIMESTAMP WITH TIME ZONE
        );

        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_service_requests_service_id ON service_requests(service_id);
        CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
        CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests(created_at);
        CREATE INDEX IF NOT EXISTS idx_service_requests_assigned_to ON service_requests(assigned_to);

        -- Enable Row Level Security
        ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Public can create service requests" ON service_requests
          FOR INSERT WITH CHECK (true);

        CREATE POLICY "Admins can view all service requests" ON service_requests
          FOR SELECT USING (auth.role() = 'authenticated');

        CREATE POLICY "Admins can update service requests" ON service_requests
          FOR UPDATE USING (auth.role() = 'authenticated');

        CREATE POLICY "Admins can delete service requests" ON service_requests
          FOR DELETE USING (auth.role() = 'authenticated');

        -- Create function to update updated_at timestamp
        CREATE OR REPLACE FUNCTION update_service_requests_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Create trigger for updated_at
        CREATE TRIGGER update_service_requests_updated_at
          BEFORE UPDATE ON service_requests
          FOR EACH ROW
          EXECUTE FUNCTION update_service_requests_updated_at();

        -- Create function to send notification when request is created
        CREATE OR REPLACE FUNCTION notify_admin_service_request()
        RETURNS TRIGGER AS $$
        BEGIN
          -- Insert notification for admin (sem a coluna priority)
          INSERT INTO admin_notifications (
            title,
            message,
            type,
            data
          ) VALUES (
            'Nova Solicitação de Serviço',
            'Nova solicitação recebida para: ' || NEW.service_name,
            'service_request',
            jsonb_build_object(
              'request_id', NEW.id,
              'service_name', NEW.service_name,
              'requester_name', NEW.requester_name,
              'requester_email', NEW.requester_email,
              'subject', NEW.subject,
              'priority', NEW.priority
            )
          );
          
          -- Mark notification as sent
          UPDATE service_requests 
          SET notification_sent = TRUE, notification_sent_at = NOW()
          WHERE id = NEW.id;
          
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Create trigger for admin notification
        CREATE TRIGGER notify_admin_service_request_trigger
          AFTER INSERT ON service_requests
          FOR EACH ROW
          EXECUTE FUNCTION notify_admin_service_request();

        -- Create view for service requests with service details
        CREATE OR REPLACE VIEW service_requests_view AS
        SELECT 
          sr.*,
          s.title as service_title,
          s.description as service_description,
          s.direcao as service_direction_full,
          s.categoria as service_category,
          s.contacto as service_contact,
          s.email as service_email
        FROM service_requests sr
        LEFT JOIN servicos s ON sr.service_id = s.id;

        -- Grant permissions
        GRANT SELECT, INSERT, UPDATE, DELETE ON service_requests TO authenticated;
        GRANT SELECT ON service_requests_view TO authenticated;
      `
    });

    if (requestsError) {
      console.error('❌ Erro ao criar tabela de solicitações:', requestsError);
      throw requestsError;
    }
    console.log('✅ Tabela de solicitações de serviços criada');

    console.log('\n🎉 Migrações aplicadas com sucesso!');
    console.log('\n📋 Resumo das alterações:');
    console.log('   ✅ Tabela servicos criada/verificada');
    console.log('   ✅ Dados de exemplo inseridos');
    console.log('   ✅ Tabela service_requests criada');
    console.log('   ✅ Triggers e funções configurados');
    console.log('   ✅ Políticas de segurança aplicadas');
    console.log('   ✅ View service_requests_view criada');
    console.log('\n🔧 Próximos passos:');
    console.log('   1. Acesse o painel administrativo');
    console.log('   2. Vá para "Solicitações de Serviços"');
    console.log('   3. Teste criando uma solicitação na página de serviços');

  } catch (error) {
    console.error('\n❌ Erro ao aplicar migrações:', error);
    process.exit(1);
  }
}

applyMigrations(); 