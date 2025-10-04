import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const realEvents = [
  {
    title: "Festival Cultural de Chipindo",
    description: "Celebração anual da cultura local com danças tradicionais, música, artesanato e gastronomia típica da região. Uma oportunidade única para conhecer e preservar as tradições culturais do município.",
    date: "2025-08-15",
    event_time: "09:00:00",
    location: "Praça Central de Chipindo",
    organizer: "Câmara Municipal de Chipindo",
    contact: "+244 123 456 789",
    email: "cultura@chipindo.gov.ao",
    website: "https://festival.chipindo.gov.ao",
    price: "Gratuito",
    max_participants: 3000,
    current_participants: 1250,
    category: "cultural",
    status: "upcoming",
    featured: true
  },
  {
    title: "Feira Agrícola e Comercial",
    description: "Exposição de produtos agrícolas locais, artesanato e oportunidades de negócio para agricultores e comerciantes. Promove o desenvolvimento económico local e fortalece as cadeias produtivas.",
    date: "2025-09-20",
    event_time: "08:00:00",
    location: "Mercado Municipal de Chipindo",
    organizer: "Direcção de Agricultura e Desenvolvimento Rural",
    contact: "+244 123 456 790",
    email: "agricultura@chipindo.gov.ao",
    price: "Gratuito",
    max_participants: 1000,
    current_participants: 450,
    category: "business",
    status: "upcoming",
    featured: true
  },
  {
    title: "Conferência de Desenvolvimento Sustentável",
    description: "Discussão sobre projectos de desenvolvimento sustentável, meio ambiente e crescimento económico do município. Reúne especialistas e stakeholders para debater o futuro de Chipindo.",
    date: "2025-07-30",
    event_time: "14:00:00",
    location: "Auditório Municipal",
    organizer: "Direcção de Educação e Cultura",
    contact: "+244 123 456 791",
    email: "educacao@chipindo.gov.ao",
    price: "Gratuito",
    max_participants: 200,
    current_participants: 180,
    category: "educational",
    status: "upcoming",
    featured: false
  },
  {
    title: "Campeonato de Futebol Local",
    description: "Torneio de futebol entre equipas locais para promover o desporto e a união comunitária. Uma competição que fortalece os laços entre os bairros e fomenta o talento local.",
    date: "2025-07-25",
    event_time: "15:00:00",
    location: "Estádio Municipal",
    organizer: "Direcção de Desporto e Juventude",
    contact: "+244 123 456 792",
    email: "desporto@chipindo.gov.ao",
    price: "Gratuito",
    max_participants: 500,
    current_participants: 320,
    category: "sports",
    status: "upcoming",
    featured: false
  },
  {
    title: "Workshop de Empreendedorismo",
    description: "Formação sobre criação e gestão de pequenos negócios, com foco em microempresas e cooperativas. Capacita jovens e adultos para o mercado de trabalho e auto-emprego.",
    date: "2025-08-10",
    event_time: "14:00:00",
    location: "Sala de Conferências Municipal",
    organizer: "Direcção de Economia e Finanças",
    contact: "+244 123 456 793",
    email: "economia@chipindo.gov.ao",
    price: "Gratuito",
    max_participants: 100,
    current_participants: 85,
    category: "educational",
    status: "upcoming",
    featured: true
  },
  {
    title: "Limpeza Comunitária",
    description: "Iniciativa de limpeza e preservação ambiental envolvendo toda a comunidade. Promove a consciência ambiental e a responsabilidade cívica dos cidadãos.",
    date: "2025-07-20",
    event_time: "08:00:00",
    location: "Várias localizações do município",
    organizer: "Direcção de Ambiente e Saneamento",
    contact: "+244 123 456 794",
    email: "ambiente@chipindo.gov.ao",
    price: "Gratuito",
    max_participants: 0,
    current_participants: 0,
    category: "community",
    status: "upcoming",
    featured: false
  },
  {
    title: "Feira de Saúde e Bem-estar",
    description: "Evento dedicado à promoção da saúde, com rastreios gratuitos, palestras sobre prevenção e demonstrações de práticas saudáveis. Foca na prevenção e educação para a saúde.",
    date: "2025-08-05",
    event_time: "09:00:00",
    location: "Centro de Saúde Municipal",
    organizer: "Direcção de Saúde Pública",
    contact: "+244 123 456 795",
    email: "saude@chipindo.gov.ao",
    price: "Gratuito",
    max_participants: 300,
    current_participants: 150,
    category: "health",
    status: "upcoming",
    featured: false
  },
  {
    title: "Exposição de Artesanato Local",
    description: "Mostra do talento artístico local com venda de peças únicas e demonstrações ao vivo. Valoriza os artesãos locais e promove o turismo cultural.",
    date: "2025-09-10",
    event_time: "10:00:00",
    location: "Centro Cultural Municipal",
    organizer: "Associação de Artesãos de Chipindo",
    contact: "+244 123 456 796",
    email: "artesanato@chipindo.gov.ao",
    price: "Gratuito",
    max_participants: 200,
    current_participants: 75,
    category: "cultural",
    status: "upcoming",
    featured: false
  }
];

async function insertEventsViaRPC() {
  try {
    console.log('🚀 Iniciando inserção de eventos via RPC...');

    // Primeiro, verificar se a função create_event existe
    console.log('🔍 Verificando função create_event...');
    
    const insertedEvents = [];

    for (let i = 0; i < realEvents.length; i++) {
      const event = realEvents[i];
      console.log(`\n📝 Inserindo evento ${i + 1}/${realEvents.length}: ${event.title}`);
      
      try {
        const { data, error } = await supabase.rpc('create_event', {
          p_title: event.title,
          p_description: event.description,
          p_date: event.date,
          p_event_time: event.event_time,
          p_location: event.location,
          p_organizer: event.organizer,
          p_contact: event.contact,
          p_email: event.email,
          p_website: event.website,
          p_price: event.price,
          p_max_participants: event.max_participants,
          p_category: event.category,
          p_status: event.status,
          p_featured: event.featured
        });

        if (error) {
          console.error(`❌ Erro ao inserir evento "${event.title}":`, error.message);
        } else {
          console.log(`✅ Evento "${event.title}" inserido com sucesso! ID: ${data}`);
          insertedEvents.push({ ...event, id: data });
        }
      } catch (err) {
        console.error(`❌ Erro inesperado ao inserir "${event.title}":`, err.message);
      }
    }

    console.log('\n🎉 Processo concluído!');
    console.log(`📊 Total de eventos inseridos: ${insertedEvents.length}/${realEvents.length}`);
    
    if (insertedEvents.length > 0) {
      console.log('\n📋 Eventos inseridos:');
      insertedEvents.forEach((event, index) => {
        console.log(`${index + 1}. ${event.title} (ID: ${event.id})`);
      });
    }

    if (insertedEvents.length < realEvents.length) {
      console.log('\n⚠️  Alguns eventos não foram inseridos devido a erros.');
      console.log('💡 Verifique as políticas RLS da tabela events.');
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar o script
insertEventsViaRPC(); 