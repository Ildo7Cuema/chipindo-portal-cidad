export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      acervo_digital: {
        Row: {
          author_id: string
          category: string | null
          created_at: string
          department: string
          description: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_public: boolean
          mime_type: string | null
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category?: string | null
          created_at?: string
          department: string
          description?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_public?: boolean
          mime_type?: string | null
          thumbnail_url?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string | null
          created_at?: string
          department?: string
          description?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_public?: boolean
          mime_type?: string | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      acervo_views: {
        Row: {
          acervo_id: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          acervo_id: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          acervo_id?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "acervo_views_acervo_id_fkey"
            columns: ["acervo_id"]
            isOneToOne: false
            referencedRelation: "acervo_digital"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      budget_execution: {
        Row: {
          category: string
          created_at: string
          executed_budget: number
          id: string
          percentage: number
          status: string
          total_budget: number
          updated_at: string
          year: string
        }
        Insert: {
          category: string
          created_at?: string
          executed_budget: number
          id?: string
          percentage: number
          status?: string
          total_budget: number
          updated_at?: string
          year: string
        }
        Update: {
          category?: string
          created_at?: string
          executed_budget?: number
          id?: string
          percentage?: number
          status?: string
          total_budget?: number
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      concursos: {
        Row: {
          area: string | null
          categorias_disponiveis: string | null
          contact_info: string | null
          created_at: string
          deadline: string | null
          description: string
          id: string
          published: boolean | null
          requirements: string | null
          title: string
          updated_at: string
        }
        Insert: {
          area?: string | null
          categorias_disponiveis?: string | null
          contact_info?: string | null
          created_at?: string
          deadline?: string | null
          description: string
          id?: string
          published?: boolean | null
          requirements?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          area?: string | null
          categorias_disponiveis?: string | null
          contact_info?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          published?: boolean | null
          requirements?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          assunto: string
          categoria: string
          created_at: string
          departamento: string | null
          email: string
          id: string
          mensagem: string
          nome: string
          status: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          assunto: string
          categoria: string
          created_at?: string
          departamento?: string | null
          email: string
          id?: string
          mensagem: string
          nome: string
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          assunto?: string
          categoria?: string
          created_at?: string
          departamento?: string | null
          email?: string
          id?: string
          mensagem?: string
          nome?: string
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cultura_areas: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          estado: string
          eventos: string
          grupos: string
          id: string
          nome: string
          ordem: number | null
          participantes: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          estado: string
          eventos: string
          grupos: string
          id?: string
          nome: string
          ordem?: number | null
          participantes: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          estado?: string
          eventos?: string
          grupos?: string
          id?: string
          nome?: string
          ordem?: number | null
          participantes?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cultura_contactos: {
        Row: {
          created_at: string | null
          email: string
          endereco: string
          horario: string
          id: string
          responsavel: string
          telefone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          endereco: string
          horario: string
          id?: string
          responsavel: string
          telefone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          endereco?: string
          horario?: string
          id?: string
          responsavel?: string
          telefone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cultura_estatisticas: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          icon: string
          id: string
          label: string
          ordem: number | null
          updated_at: string | null
          value: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          icon: string
          id?: string
          label: string
          ordem?: number | null
          updated_at?: string | null
          value: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          icon?: string
          id?: string
          label?: string
          ordem?: number | null
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      cultura_eventos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          data: string
          descricao: string | null
          estado: string
          id: string
          local: string
          nome: string
          ordem: number | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          data: string
          descricao?: string | null
          estado: string
          id?: string
          local: string
          nome: string
          ordem?: number | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          data?: string
          descricao?: string | null
          estado?: string
          id?: string
          local?: string
          nome?: string
          ordem?: number | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cultura_info: {
        Row: {
          created_at: string | null
          description: string
          id: string
          mission: string
          subtitle: string
          title: string
          updated_at: string | null
          vision: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          mission: string
          subtitle: string
          title: string
          updated_at?: string | null
          vision: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          mission?: string
          subtitle?: string
          title?: string
          updated_at?: string | null
          vision?: string
        }
        Relationships: []
      }
      cultura_infraestruturas: {
        Row: {
          ativo: boolean | null
          capacidade: string
          created_at: string | null
          equipamentos: string[]
          estado: string
          id: string
          localizacao: string
          nome: string
          ordem: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          capacidade: string
          created_at?: string | null
          equipamentos: string[]
          estado: string
          id?: string
          localizacao: string
          nome: string
          ordem?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          capacidade?: string
          created_at?: string | null
          equipamentos?: string[]
          estado?: string
          id?: string
          localizacao?: string
          nome?: string
          ordem?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cultura_oportunidades: {
        Row: {
          ativo: boolean | null
          beneficios: string[]
          created_at: string | null
          description: string
          id: string
          ordem: number | null
          prazo: string
          requisitos: string[]
          title: string
          updated_at: string | null
          vagas: string
        }
        Insert: {
          ativo?: boolean | null
          beneficios: string[]
          created_at?: string | null
          description: string
          id?: string
          ordem?: number | null
          prazo: string
          requisitos: string[]
          title: string
          updated_at?: string | null
          vagas: string
        }
        Update: {
          ativo?: boolean | null
          beneficios?: string[]
          created_at?: string | null
          description?: string
          id?: string
          ordem?: number | null
          prazo?: string
          requisitos?: string[]
          title?: string
          updated_at?: string | null
          vagas?: string
        }
        Relationships: []
      }
      cultura_programas: {
        Row: {
          ativo: boolean | null
          beneficios: string[]
          contact: string
          created_at: string | null
          description: string
          id: string
          ordem: number | null
          requisitos: string[]
          title: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          beneficios: string[]
          contact: string
          created_at?: string | null
          description: string
          id?: string
          ordem?: number | null
          requisitos: string[]
          title: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          beneficios?: string[]
          contact?: string
          created_at?: string | null
          description?: string
          id?: string
          ordem?: number | null
          requisitos?: string[]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      departamento_contactos: {
        Row: {
          created_at: string
          departamento_id: string
          email: string | null
          horario_especial: string | null
          id: string
          observacoes: string | null
          responsavel: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          departamento_id: string
          email?: string | null
          horario_especial?: string | null
          id?: string
          observacoes?: string | null
          responsavel?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          departamento_id?: string
          email?: string | null
          horario_especial?: string | null
          id?: string
          observacoes?: string | null
          responsavel?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departamento_contactos_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: true
            referencedRelation: "departamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      departamentos: {
        Row: {
          ativo: boolean | null
          codigo: string | null
          created_at: string
          descricao: string | null
          email: string | null
          endereco: string | null
          funcionarios: number | null
          id: string
          nome: string
          ordem: number | null
          responsavel: string | null
          telefone: number | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          email?: string | null
          endereco?: string | null
          funcionarios?: number | null
          id?: string
          nome: string
          ordem?: number | null
          responsavel?: string | null
          telefone?: number | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          email?: string | null
          endereco?: string | null
          funcionarios?: number | null
          id?: string
          nome?: string
          ordem?: number | null
          responsavel?: string | null
          telefone?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      economico_contactos: {
        Row: {
          created_at: string | null
          email: string
          endereco: string
          horario: string
          id: string
          responsavel: string
          telefone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          endereco: string
          horario: string
          id?: string
          responsavel: string
          telefone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          endereco?: string
          horario?: string
          id?: string
          responsavel?: string
          telefone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      economico_estatisticas: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          icon: string
          id: string
          label: string
          ordem: number | null
          updated_at: string | null
          value: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          icon: string
          id?: string
          label: string
          ordem?: number | null
          updated_at?: string | null
          value: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          icon?: string
          id?: string
          label?: string
          ordem?: number | null
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      economico_info: {
        Row: {
          created_at: string | null
          description: string
          id: string
          mission: string
          subtitle: string
          title: string
          updated_at: string | null
          vision: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          mission: string
          subtitle: string
          title: string
          updated_at?: string | null
          vision: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          mission?: string
          subtitle?: string
          title?: string
          updated_at?: string | null
          vision?: string
        }
        Relationships: []
      }
      economico_infraestruturas: {
        Row: {
          ativo: boolean | null
          capacidade: string
          created_at: string | null
          equipamentos: string[]
          estado: string
          id: string
          localizacao: string
          nome: string
          ordem: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          capacidade: string
          created_at?: string | null
          equipamentos: string[]
          estado: string
          id?: string
          localizacao: string
          nome: string
          ordem?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          capacidade?: string
          created_at?: string | null
          equipamentos?: string[]
          estado?: string
          id?: string
          localizacao?: string
          nome?: string
          ordem?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      economico_oportunidades: {
        Row: {
          ativo: boolean | null
          beneficios: string[]
          created_at: string | null
          description: string
          id: string
          ordem: number | null
          prazo: string
          requisitos: string[]
          title: string
          updated_at: string | null
          vagas: string
        }
        Insert: {
          ativo?: boolean | null
          beneficios: string[]
          created_at?: string | null
          description: string
          id?: string
          ordem?: number | null
          prazo: string
          requisitos: string[]
          title: string
          updated_at?: string | null
          vagas: string
        }
        Update: {
          ativo?: boolean | null
          beneficios?: string[]
          created_at?: string | null
          description?: string
          id?: string
          ordem?: number | null
          prazo?: string
          requisitos?: string[]
          title?: string
          updated_at?: string | null
          vagas?: string
        }
        Relationships: []
      }
      economico_programas: {
        Row: {
          ativo: boolean | null
          beneficios: string[]
          contact: string
          created_at: string | null
          description: string
          id: string
          ordem: number | null
          requisitos: string[]
          title: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          beneficios: string[]
          contact: string
          created_at?: string | null
          description: string
          id?: string
          ordem?: number | null
          requisitos: string[]
          title: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          beneficios?: string[]
          contact?: string
          created_at?: string | null
          description?: string
          id?: string
          ordem?: number | null
          requisitos?: string[]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      economico_setores: {
        Row: {
          ativo: boolean | null
          contribuicao: string
          created_at: string | null
          empregos: string
          empresas: string
          estado: string
          id: string
          nome: string
          ordem: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          contribuicao: string
          created_at?: string | null
          empregos: string
          empresas: string
          estado: string
          id?: string
          nome: string
          ordem?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          contribuicao?: string
          created_at?: string | null
          empregos?: string
          empresas?: string
          estado?: string
          id?: string
          nome?: string
          ordem?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          phone: string
          priority: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          phone: string
          priority?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          phone?: string
          priority?: number
          updated_at?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string | null
          dietary_restrictions: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          event_id: number
          id: number
          notes: string | null
          participant_address: string | null
          participant_age: number | null
          participant_email: string
          participant_gender: string | null
          participant_name: string
          participant_occupation: string | null
          participant_organization: string | null
          participant_phone: string | null
          registration_date: string | null
          special_needs: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dietary_restrictions?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          event_id: number
          id?: number
          notes?: string | null
          participant_address?: string | null
          participant_age?: number | null
          participant_email: string
          participant_gender?: string | null
          participant_name: string
          participant_occupation?: string | null
          participant_organization?: string | null
          participant_phone?: string | null
          registration_date?: string | null
          special_needs?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dietary_restrictions?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          event_id?: number
          id?: number
          notes?: string | null
          participant_address?: string | null
          participant_age?: number | null
          participant_email?: string
          participant_gender?: string | null
          participant_name?: string
          participant_occupation?: string | null
          participant_organization?: string | null
          participant_phone?: string | null
          registration_date?: string | null
          special_needs?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          contact: string | null
          created_at: string | null
          current_participants: number | null
          date: string
          description: string | null
          email: string | null
          event_time: string | null
          featured: boolean | null
          id: number
          location: string | null
          max_participants: number | null
          organizer: string | null
          price: string | null
          status: string | null
          title: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          category?: string | null
          contact?: string | null
          created_at?: string | null
          current_participants?: number | null
          date: string
          description?: string | null
          email?: string | null
          event_time?: string | null
          featured?: boolean | null
          id?: number
          location?: string | null
          max_participants?: number | null
          organizer?: string | null
          price?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          category?: string | null
          contact?: string | null
          created_at?: string | null
          current_participants?: number | null
          date?: string
          description?: string | null
          email?: string | null
          event_time?: string | null
          featured?: boolean | null
          id?: number
          location?: string | null
          max_participants?: number | null
          organizer?: string | null
          price?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      hero_carousel: {
        Row: {
          active: boolean
          button_text: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          link_url: string | null
          order_index: number
          overlay_opacity: number | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          button_text?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          link_url?: string | null
          order_index?: number
          overlay_opacity?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          button_text?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          link_url?: string | null
          order_index?: number
          overlay_opacity?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      inscricoes: {
        Row: {
          arquivos: Json
          bilhete_identidade: string
          categoria: string | null
          concurso_id: string
          created_at: string | null
          data_nascimento: string
          email: string
          id: string
          nome_completo: string
          observacoes: string | null
          telefone: string
          updated_at: string | null
        }
        Insert: {
          arquivos: Json
          bilhete_identidade: string
          categoria?: string | null
          concurso_id: string
          created_at?: string | null
          data_nascimento: string
          email: string
          id?: string
          nome_completo: string
          observacoes?: string | null
          telefone: string
          updated_at?: string | null
        }
        Update: {
          arquivos?: Json
          bilhete_identidade?: string
          categoria?: string | null
          concurso_id?: string
          created_at?: string | null
          data_nascimento?: string
          email?: string
          id?: string
          nome_completo?: string
          observacoes?: string | null
          telefone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inscricoes_concurso_id_fkey"
            columns: ["concurso_id"]
            isOneToOne: false
            referencedRelation: "concursos"
            referencedColumns: ["id"]
          },
        ]
      }
      interest_registrations: {
        Row: {
          additional_info: string | null
          areas_of_interest: string[]
          created_at: string
          email: string
          experience_years: number | null
          full_name: string
          id: string
          phone: string | null
          profession: string | null
          terms_accepted: boolean
          updated_at: string
        }
        Insert: {
          additional_info?: string | null
          areas_of_interest: string[]
          created_at?: string
          email: string
          experience_years?: number | null
          full_name: string
          id?: string
          phone?: string | null
          profession?: string | null
          terms_accepted?: boolean
          updated_at?: string
        }
        Update: {
          additional_info?: string | null
          areas_of_interest?: string[]
          created_at?: string
          email?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          phone?: string | null
          profession?: string | null
          terms_accepted?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      municipality_characterization: {
        Row: {
          created_at: string | null
          culture: Json | null
          demography: Json | null
          economy: Json | null
          geography: Json | null
          id: number
          infrastructure: Json | null
          natural_resources: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          culture?: Json | null
          demography?: Json | null
          economy?: Json | null
          geography?: Json | null
          id?: number
          infrastructure?: Json | null
          natural_resources?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          culture?: Json | null
          demography?: Json | null
          economy?: Json | null
          geography?: Json | null
          id?: number
          infrastructure?: Json | null
          natural_resources?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      municipality_locations: {
        Row: {
          active: boolean
          address: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          opening_hours: string | null
          phone: string | null
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          opening_hours?: string | null
          phone?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          opening_hours?: string | null
          phone?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          author_id: string
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean | null
          featured_image_index: number | null
          id: string
          image_url: string | null
          images: Json | null
          published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          featured_image_index?: number | null
          id?: string
          image_url?: string | null
          images?: Json | null
          published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          featured_image_index?: number | null
          id?: string
          image_url?: string | null
          images?: Json | null
          published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_likes: {
        Row: {
          created_at: string
          id: string
          news_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          news_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          news_id?: string
          user_id?: string
        }
        Relationships: []
      }
      news_views: {
        Row: {
          id: string
          ip_address: string | null
          news_id: string
          user_agent: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          news_id: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          news_id?: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_views_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      organigrama: {
        Row: {
          ativo: boolean | null
          cargo: string
          created_at: string
          departamento: string
          descricao: string | null
          email: string | null
          foto_url: string | null
          id: string
          nome: string
          ordem: number | null
          superior_id: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          cargo: string
          created_at?: string
          departamento: string
          descricao?: string | null
          email?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          ordem?: number | null
          superior_id?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          cargo?: string
          created_at?: string
          departamento?: string
          descricao?: string | null
          email?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          superior_id?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organigrama_superior_id_fkey"
            columns: ["superior_id"]
            isOneToOne: false
            referencedRelation: "organigrama"
            referencedColumns: ["id"]
          },
        ]
      }
      ouvidoria_categorias: {
        Row: {
          ativo: boolean | null
          bg_color: string | null
          cor: string | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          bg_color?: string | null
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          id: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          bg_color?: string | null
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ouvidoria_forward_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          forward_type: string
          forwarded_at: string | null
          forwarded_by: string
          id: string
          manifestacao_id: string | null
          message: string
          recipient_phone: string
          request_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          forward_type: string
          forwarded_at?: string | null
          forwarded_by: string
          id?: string
          manifestacao_id?: string | null
          message: string
          recipient_phone: string
          request_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          forward_type?: string
          forwarded_at?: string | null
          forwarded_by?: string
          id?: string
          manifestacao_id?: string | null
          message?: string
          recipient_phone?: string
          request_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ouvidoria_forward_logs_manifestacao_id_fkey"
            columns: ["manifestacao_id"]
            isOneToOne: false
            referencedRelation: "ouvidoria_manifestacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ouvidoria_forward_logs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ouvidoria_forward_logs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests_view"
            referencedColumns: ["id"]
          },
        ]
      }
      ouvidoria_manifestacoes: {
        Row: {
          anexos: string[] | null
          assunto: string
          avaliacao: number | null
          categoria: string
          comentario_avaliacao: string | null
          created_at: string | null
          data_abertura: string | null
          data_resposta: string | null
          departamento_responsavel: string | null
          descricao: string
          email: string
          id: string
          nome: string
          prioridade: string | null
          protocolo: string
          resposta: string | null
          status: string | null
          telefone: string | null
          tempo_resposta: number | null
          updated_at: string | null
        }
        Insert: {
          anexos?: string[] | null
          assunto: string
          avaliacao?: number | null
          categoria: string
          comentario_avaliacao?: string | null
          created_at?: string | null
          data_abertura?: string | null
          data_resposta?: string | null
          departamento_responsavel?: string | null
          descricao: string
          email: string
          id?: string
          nome: string
          prioridade?: string | null
          protocolo: string
          resposta?: string | null
          status?: string | null
          telefone?: string | null
          tempo_resposta?: number | null
          updated_at?: string | null
        }
        Update: {
          anexos?: string[] | null
          assunto?: string
          avaliacao?: number | null
          categoria?: string
          comentario_avaliacao?: string | null
          created_at?: string | null
          data_abertura?: string | null
          data_resposta?: string | null
          departamento_responsavel?: string | null
          descricao?: string
          email?: string
          id?: string
          nome?: string
          prioridade?: string | null
          protocolo?: string
          resposta?: string | null
          status?: string | null
          telefone?: string | null
          tempo_resposta?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ouvidoria_stats: {
        Row: {
          categorias_mais_comuns: Json | null
          created_at: string | null
          id: string
          pendentes: number | null
          resolvidas: number | null
          respondidas: number | null
          satisfacao_geral: number | null
          tempo_medio_resposta: number | null
          total_manifestacoes: number | null
          ultima_atualizacao: string | null
          updated_at: string | null
        }
        Insert: {
          categorias_mais_comuns?: Json | null
          created_at?: string | null
          id?: string
          pendentes?: number | null
          resolvidas?: number | null
          respondidas?: number | null
          satisfacao_geral?: number | null
          tempo_medio_resposta?: number | null
          total_manifestacoes?: number | null
          ultima_atualizacao?: string | null
          updated_at?: string | null
        }
        Update: {
          categorias_mais_comuns?: Json | null
          created_at?: string | null
          id?: string
          pendentes?: number | null
          resolvidas?: number | null
          respondidas?: number | null
          satisfacao_geral?: number | null
          tempo_medio_resposta?: number | null
          total_manifestacoes?: number | null
          ultima_atualizacao?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      population_history: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          population_count: number
          source: string | null
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          population_count: number
          source?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          population_count?: number
          source?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string | null
          setor_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          role?: string | null
          setor_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          setor_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores_estrategicos"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          admin_notes: string | null
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          message: string
          notification_sent: boolean | null
          notification_sent_at: string | null
          priority: string | null
          requester_email: string
          requester_name: string
          requester_phone: string | null
          service_direction: string
          service_id: string | null
          service_name: string
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          message: string
          notification_sent?: boolean | null
          notification_sent_at?: string | null
          priority?: string | null
          requester_email: string
          requester_name: string
          requester_phone?: string | null
          service_direction: string
          service_id?: string | null
          service_name: string
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          message?: string
          notification_sent?: boolean | null
          notification_sent_at?: string | null
          priority?: string | null
          requester_email?: string
          requester_name?: string
          requester_phone?: string | null
          service_direction?: string
          service_id?: string | null
          service_name?: string
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          ativo: boolean | null
          categoria: string
          contacto: string
          created_at: string | null
          description: string
          digital: boolean | null
          direcao: string
          documentos: string[] | null
          email: string
          horario: string
          icon: string | null
          id: string
          localizacao: string
          ordem: number | null
          prazo: string
          prioridade: string | null
          requests: number | null
          requisitos: string[] | null
          setor_id: string | null
          taxa: string
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          ativo?: boolean | null
          categoria: string
          contacto: string
          created_at?: string | null
          description: string
          digital?: boolean | null
          direcao: string
          documentos?: string[] | null
          email: string
          horario: string
          icon?: string | null
          id?: string
          localizacao: string
          ordem?: number | null
          prazo: string
          prioridade?: string | null
          requests?: number | null
          requisitos?: string[] | null
          setor_id?: string | null
          taxa: string
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          ativo?: boolean | null
          categoria?: string
          contacto?: string
          created_at?: string | null
          description?: string
          digital?: boolean | null
          direcao?: string
          documentos?: string[] | null
          email?: string
          horario?: string
          icon?: string | null
          id?: string
          localizacao?: string
          ordem?: number | null
          prazo?: string
          prioridade?: string | null
          requests?: number | null
          requisitos?: string[] | null
          setor_id?: string | null
          taxa?: string
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "servicos_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores_estrategicos"
            referencedColumns: ["id"]
          },
        ]
      }
      setores_contactos: {
        Row: {
          created_at: string | null
          email: string | null
          endereco: string | null
          horario: string | null
          id: string
          responsavel: string | null
          setor_id: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          horario?: string | null
          id?: string
          responsavel?: string | null
          setor_id?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          horario?: string | null
          id?: string
          responsavel?: string | null
          setor_id?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setores_contactos_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores_estrategicos"
            referencedColumns: ["id"]
          },
        ]
      }
      setores_estatisticas: {
        Row: {
          created_at: string | null
          icone: string | null
          id: string
          nome: string
          ordem: number | null
          setor_id: string | null
          updated_at: string | null
          valor: string
        }
        Insert: {
          created_at?: string | null
          icone?: string | null
          id?: string
          nome: string
          ordem?: number | null
          setor_id?: string | null
          updated_at?: string | null
          valor: string
        }
        Update: {
          created_at?: string | null
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          setor_id?: string | null
          updated_at?: string | null
          valor?: string
        }
        Relationships: [
          {
            foreignKeyName: "setores_estatisticas_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores_estrategicos"
            referencedColumns: ["id"]
          },
        ]
      }
      setores_estrategicos: {
        Row: {
          ativo: boolean | null
          cor_primaria: string | null
          cor_secundaria: string | null
          created_at: string | null
          descricao: string | null
          icone: string | null
          id: string
          missao: string | null
          nome: string
          ordem: number | null
          slug: string
          updated_at: string | null
          visao: string | null
        }
        Insert: {
          ativo?: boolean | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          missao?: string | null
          nome: string
          ordem?: number | null
          slug: string
          updated_at?: string | null
          visao?: string | null
        }
        Update: {
          ativo?: boolean | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          missao?: string | null
          nome?: string
          ordem?: number | null
          slug?: string
          updated_at?: string | null
          visao?: string | null
        }
        Relationships: []
      }
      setores_infraestruturas: {
        Row: {
          ativo: boolean | null
          capacidade: string | null
          created_at: string | null
          equipamentos: Json | null
          estado: string | null
          id: string
          localizacao: string | null
          nome: string
          ordem: number | null
          setor_id: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          capacidade?: string | null
          created_at?: string | null
          equipamentos?: Json | null
          estado?: string | null
          id?: string
          localizacao?: string | null
          nome: string
          ordem?: number | null
          setor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          capacidade?: string | null
          created_at?: string | null
          equipamentos?: Json | null
          estado?: string | null
          id?: string
          localizacao?: string | null
          nome?: string
          ordem?: number | null
          setor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setores_infraestruturas_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores_estrategicos"
            referencedColumns: ["id"]
          },
        ]
      }
      setores_oportunidades: {
        Row: {
          ativo: boolean | null
          beneficios: Json | null
          created_at: string | null
          descricao: string | null
          id: string
          ordem: number | null
          prazo: string | null
          requisitos: Json | null
          setor_id: string | null
          titulo: string
          updated_at: string | null
          vagas: number | null
        }
        Insert: {
          ativo?: boolean | null
          beneficios?: Json | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          ordem?: number | null
          prazo?: string | null
          requisitos?: Json | null
          setor_id?: string | null
          titulo: string
          updated_at?: string | null
          vagas?: number | null
        }
        Update: {
          ativo?: boolean | null
          beneficios?: Json | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          ordem?: number | null
          prazo?: string | null
          requisitos?: Json | null
          setor_id?: string | null
          titulo?: string
          updated_at?: string | null
          vagas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "setores_oportunidades_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores_estrategicos"
            referencedColumns: ["id"]
          },
        ]
      }
      setores_programas: {
        Row: {
          ativo: boolean | null
          beneficios: Json | null
          contacto: string | null
          created_at: string | null
          descricao: string | null
          id: string
          ordem: number | null
          requisitos: Json | null
          setor_id: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          beneficios?: Json | null
          contacto?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          ordem?: number | null
          requisitos?: Json | null
          setor_id?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          beneficios?: Json | null
          contacto?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          ordem?: number | null
          requisitos?: Json | null
          setor_id?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setores_programas_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores_estrategicos"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          area_total_count: string | null
          area_total_description: string | null
          contact_address: string | null
          contact_email: string | null
          contact_phone: string | null
          copyright_text: string | null
          created_at: string
          departments_count: string | null
          departments_description: string | null
          facebook_url: string | null
          footer_about_description: string | null
          footer_about_subtitle: string | null
          footer_about_title: string | null
          growth_description: string | null
          growth_period: string | null
          growth_rate: string | null
          hero_location_badge: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          opening_hours_saturday: string | null
          opening_hours_sunday: string | null
          opening_hours_weekdays: string | null
          population_count: string | null
          population_description: string | null
          services_count: string | null
          services_description: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_twitter: string | null
          social_youtube: string | null
          twitter_url: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          area_total_count?: string | null
          area_total_description?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          copyright_text?: string | null
          created_at?: string
          departments_count?: string | null
          departments_description?: string | null
          facebook_url?: string | null
          footer_about_description?: string | null
          footer_about_subtitle?: string | null
          footer_about_title?: string | null
          growth_description?: string | null
          growth_period?: string | null
          growth_rate?: string | null
          hero_location_badge?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          opening_hours_saturday?: string | null
          opening_hours_sunday?: string | null
          opening_hours_weekdays?: string | null
          population_count?: string | null
          population_description?: string | null
          services_count?: string | null
          services_description?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          area_total_count?: string | null
          area_total_description?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          copyright_text?: string | null
          created_at?: string
          departments_count?: string | null
          departments_description?: string | null
          facebook_url?: string | null
          footer_about_description?: string | null
          footer_about_subtitle?: string | null
          footer_about_title?: string | null
          growth_description?: string | null
          growth_period?: string | null
          growth_rate?: string | null
          hero_location_badge?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          opening_hours_saturday?: string | null
          opening_hours_sunday?: string | null
          opening_hours_weekdays?: string | null
          population_count?: string | null
          population_description?: string | null
          services_count?: string | null
          services_description?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      system_backups: {
        Row: {
          backup_id: string
          completed_at: string | null
          compression_enabled: boolean
          created_at: string
          encryption_enabled: boolean
          id: string
          metadata: Json | null
          size: number
          status: string
          tables: string[]
          type: string
        }
        Insert: {
          backup_id: string
          completed_at?: string | null
          compression_enabled?: boolean
          created_at?: string
          encryption_enabled?: boolean
          id?: string
          metadata?: Json | null
          size: number
          status?: string
          tables: string[]
          type?: string
        }
        Update: {
          backup_id?: string
          completed_at?: string | null
          compression_enabled?: boolean
          created_at?: string
          encryption_enabled?: boolean
          id?: string
          metadata?: Json | null
          size?: number
          status?: string
          tables?: string[]
          type?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          allow_registration: string | null
          auto_backup: string | null
          cache_enabled: string | null
          category: string
          cdn_enabled: string | null
          compression_enabled: string | null
          contact_address: string | null
          contact_email: string | null
          contact_phone: number | null
          created_at: string
          date_format: string | null
          description: string | null
          email_notifications: string | null
          id: string
          key: string
          language: string | null
          maintenance_mode: boolean | null
          max_login_attempts: number | null
          notification_frequency: string | null
          push_notifications: string | null
          require_email_verification: string | null
          session_timeout: string | null
          site_description: string | null
          site_name: string | null
          sms_notifications: string | null
          theme: string | null
          timezone: string | null
          updated_at: string
          value: Json
        }
        Insert: {
          allow_registration?: string | null
          auto_backup?: string | null
          cache_enabled?: string | null
          category?: string
          cdn_enabled?: string | null
          compression_enabled?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: number | null
          created_at?: string
          date_format?: string | null
          description?: string | null
          email_notifications?: string | null
          id?: string
          key: string
          language?: string | null
          maintenance_mode?: boolean | null
          max_login_attempts?: number | null
          notification_frequency?: string | null
          push_notifications?: string | null
          require_email_verification?: string | null
          session_timeout?: string | null
          site_description?: string | null
          site_name?: string | null
          sms_notifications?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          value: Json
        }
        Update: {
          allow_registration?: string | null
          auto_backup?: string | null
          cache_enabled?: string | null
          category?: string
          cdn_enabled?: string | null
          compression_enabled?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: number | null
          created_at?: string
          date_format?: string | null
          description?: string | null
          email_notifications?: string | null
          id?: string
          key?: string
          language?: string | null
          maintenance_mode?: boolean | null
          max_login_attempts?: number | null
          notification_frequency?: string | null
          push_notifications?: string | null
          require_email_verification?: string | null
          session_timeout?: string | null
          site_description?: string | null
          site_name?: string | null
          sms_notifications?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      system_stats: {
        Row: {
          id: string
          metric_name: string
          metric_value: Json
          recorded_at: string
        }
        Insert: {
          id?: string
          metric_name: string
          metric_value: Json
          recorded_at?: string
        }
        Update: {
          id?: string
          metric_name?: string
          metric_value?: Json
          recorded_at?: string
        }
        Relationships: []
      }
      tecnologia_areas: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          empresas: string
          estado: string
          id: string
          nome: string
          ordem: number | null
          profissionais: string
          projetos: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          empresas: string
          estado: string
          id?: string
          nome: string
          ordem?: number | null
          profissionais: string
          projetos: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          empresas?: string
          estado?: string
          id?: string
          nome?: string
          ordem?: number | null
          profissionais?: string
          projetos?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tecnologia_contactos: {
        Row: {
          created_at: string | null
          email: string
          endereco: string
          horario: string
          id: string
          responsavel: string
          telefone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          endereco: string
          horario: string
          id?: string
          responsavel: string
          telefone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          endereco?: string
          horario?: string
          id?: string
          responsavel?: string
          telefone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tecnologia_estatisticas: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          icon: string
          id: string
          label: string
          ordem: number | null
          updated_at: string | null
          value: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          icon: string
          id?: string
          label: string
          ordem?: number | null
          updated_at?: string | null
          value: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          icon?: string
          id?: string
          label?: string
          ordem?: number | null
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      tecnologia_info: {
        Row: {
          created_at: string | null
          description: string
          id: string
          mission: string
          subtitle: string
          title: string
          updated_at: string | null
          vision: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          mission: string
          subtitle: string
          title: string
          updated_at?: string | null
          vision: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          mission?: string
          subtitle?: string
          title?: string
          updated_at?: string | null
          vision?: string
        }
        Relationships: []
      }
      tecnologia_infraestruturas: {
        Row: {
          ativo: boolean | null
          capacidade: string
          created_at: string | null
          equipamentos: string[]
          estado: string
          id: string
          localizacao: string
          nome: string
          ordem: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          capacidade: string
          created_at?: string | null
          equipamentos: string[]
          estado: string
          id?: string
          localizacao: string
          nome: string
          ordem?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          capacidade?: string
          created_at?: string | null
          equipamentos?: string[]
          estado?: string
          id?: string
          localizacao?: string
          nome?: string
          ordem?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tecnologia_oportunidades: {
        Row: {
          ativo: boolean | null
          beneficios: string[]
          created_at: string | null
          description: string
          id: string
          ordem: number | null
          prazo: string
          requisitos: string[]
          title: string
          updated_at: string | null
          vagas: string
        }
        Insert: {
          ativo?: boolean | null
          beneficios: string[]
          created_at?: string | null
          description: string
          id?: string
          ordem?: number | null
          prazo: string
          requisitos: string[]
          title: string
          updated_at?: string | null
          vagas: string
        }
        Update: {
          ativo?: boolean | null
          beneficios?: string[]
          created_at?: string | null
          description?: string
          id?: string
          ordem?: number | null
          prazo?: string
          requisitos?: string[]
          title?: string
          updated_at?: string | null
          vagas?: string
        }
        Relationships: []
      }
      tecnologia_programas: {
        Row: {
          ativo: boolean | null
          beneficios: string[]
          contact: string
          created_at: string | null
          description: string
          id: string
          ordem: number | null
          requisitos: string[]
          title: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          beneficios: string[]
          contact: string
          created_at?: string | null
          description: string
          id?: string
          ordem?: number | null
          requisitos: string[]
          title: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          beneficios?: string[]
          contact?: string
          created_at?: string | null
          description?: string
          id?: string
          ordem?: number | null
          requisitos?: string[]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tecnologia_servicos_digitais: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string
          estado: string
          funcionalidades: string[]
          id: string
          nome: string
          ordem: number | null
          servicos: string
          updated_at: string | null
          url_acesso: string | null
          utilizadores: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao: string
          estado: string
          funcionalidades: string[]
          id?: string
          nome: string
          ordem?: number | null
          servicos: string
          updated_at?: string | null
          url_acesso?: string | null
          utilizadores: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string
          estado?: string
          funcionalidades?: string[]
          id?: string
          nome?: string
          ordem?: number | null
          servicos?: string
          updated_at?: string | null
          url_acesso?: string | null
          utilizadores?: string
        }
        Relationships: []
      }
      transparency_documents: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string
          downloads: number
          file_size: string
          file_url: string | null
          id: string
          status: string
          tags: string[]
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          description: string
          downloads?: number
          file_size: string
          file_url?: string | null
          id?: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string
          downloads?: number
          file_size?: string
          file_url?: string | null
          id?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      transparency_projects: {
        Row: {
          beneficiaries: number
          budget: number
          created_at: string
          description: string
          end_date: string
          id: string
          location: string
          name: string
          progress: number
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          beneficiaries?: number
          budget: number
          created_at?: string
          description: string
          end_date: string
          id?: string
          location: string
          name: string
          progress?: number
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          beneficiaries?: number
          budget?: number
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          location?: string
          name?: string
          progress?: number
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      turismo_ambiente_carousel: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string
          location: string | null
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          location?: string | null
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          location?: string | null
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      service_requests_view: {
        Row: {
          admin_notes: string | null
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          id: string | null
          message: string | null
          notification_sent: boolean | null
          notification_sent_at: string | null
          priority: string | null
          requester_email: string | null
          requester_name: string | null
          requester_phone: string | null
          service_category: string | null
          service_contact: string | null
          service_description: string | null
          service_direction: string | null
          service_direction_full: string | null
          service_email: string | null
          service_id: string | null
          service_name: string | null
          service_title: string | null
          status: string | null
          subject: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_population_growth_rate: {
        Args: { end_year: number; start_year: number }
        Returns: number
      }
      check_admin_exists: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_missing_indexes: {
        Args: Record<PropertyKey, never>
        Returns: {
          column_name: string
          recommendation: string
          table_name: string
        }[]
      }
      check_sector_access: {
        Args: { requested_sector_id: string; user_role: string }
        Returns: boolean
      }
      complete_system_backup: {
        Args: { backup_uuid: string; final_size: number; success?: boolean }
        Returns: boolean
      }
      create_event: {
        Args: {
          p_category?: string
          p_contact: string
          p_date: string
          p_description: string
          p_email: string
          p_event_time: string
          p_featured?: boolean
          p_location: string
          p_max_participants?: number
          p_organizer: string
          p_price?: string
          p_status?: string
          p_title: string
          p_website?: string
        }
        Returns: number
      }
      create_manifestacao: {
        Args: {
          p_assunto: string
          p_categoria: string
          p_descricao: string
          p_email: string
          p_nome: string
          p_telefone: string
        }
        Returns: Json
      }
      create_system_backup: {
        Args: { backup_type?: string; tables_to_backup?: string[] }
        Returns: string
      }
      debug_delete_user: {
        Args: { user_profile_id: string }
        Returns: string
      }
      delete_event: {
        Args: { p_id: number }
        Returns: boolean
      }
      delete_user_complete: {
        Args: { user_profile_id: string }
        Returns: Json
      }
      get_backup_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_current_population_growth_rate: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_database_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_event_registrations: {
        Args: { p_event_id?: number; p_status?: string }
        Returns: {
          created_at: string
          dietary_restrictions: string
          emergency_contact_name: string
          emergency_contact_phone: string
          event_id: number
          id: number
          notes: string
          participant_address: string
          participant_age: number
          participant_email: string
          participant_gender: string
          participant_name: string
          participant_occupation: string
          participant_organization: string
          participant_phone: string
          registration_date: string
          special_needs: string
          status: string
        }[]
      }
      get_events: {
        Args: { p_category?: string; p_featured?: boolean; p_status?: string }
        Returns: {
          category: string
          contact: string
          created_at: string
          current_participants: number
          date: string
          description: string
          email: string
          event_time: string
          featured: boolean
          id: number
          location: string
          max_participants: number
          organizer: string
          price: string
          status: string
          title: string
          updated_at: string
          website: string
        }[]
      }
      get_maintenance_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_manifestacoes: {
        Args: {
          p_categoria?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_sort_by?: string
          p_sort_order?: string
          p_status?: string
        }
        Returns: Json
      }
      get_municipality_characterization: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_news_views_count: {
        Args: { p_news_id: string }
        Returns: number
      }
      get_ouvidoria_categorias: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_ouvidoria_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_system_setting: {
        Args: { setting_key: string }
        Returns: Json
      }
      get_system_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_table_sizes: {
        Args: Record<PropertyKey, never>
        Returns: {
          row_count: number
          size: number
          table_name: string
        }[]
      }
      get_transparency_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_sector: {
        Args: { user_role: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      list_system_backups: {
        Args: { limit_count?: number; offset_count?: number }
        Returns: {
          backup_id: string
          completed_at: string
          created_at: string
          id: string
          metadata: Json
          size: number
          status: string
          tables: string[]
          type: string
        }[]
      }
      optimize_database: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      rate_manifestacao: {
        Args: { p_avaliacao: number; p_comentario?: string; p_id: string }
        Returns: Json
      }
      register_acervo_view: {
        Args: {
          p_acervo_id: string
          p_ip_address?: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: boolean
      }
      register_for_event: {
        Args: {
          p_dietary_restrictions?: string
          p_emergency_contact_name?: string
          p_emergency_contact_phone?: string
          p_event_id: number
          p_participant_address?: string
          p_participant_age?: number
          p_participant_email: string
          p_participant_gender?: string
          p_participant_name: string
          p_participant_occupation?: string
          p_participant_organization?: string
          p_participant_phone?: string
          p_special_needs?: string
        }
        Returns: number
      }
      register_news_view: {
        Args: {
          p_ip_address?: string
          p_news_id: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: boolean
      }
      reindex_database: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_event: {
        Args: {
          p_category?: string
          p_contact?: string
          p_date?: string
          p_description?: string
          p_email?: string
          p_event_time?: string
          p_featured?: boolean
          p_id: number
          p_location?: string
          p_max_participants?: number
          p_organizer?: string
          p_price?: string
          p_status?: string
          p_title?: string
          p_website?: string
        }
        Returns: boolean
      }
      update_growth_rate_from_population: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      update_manifestacao_status: {
        Args: { p_id: string; p_resposta?: string; p_status: string }
        Returns: Json
      }
      update_municipality_characterization: {
        Args: {
          p_culture?: Json
          p_demography?: Json
          p_economy?: Json
          p_geography?: Json
          p_infrastructure?: Json
          p_natural_resources?: Json
        }
        Returns: boolean
      }
      update_registration_status: {
        Args: { p_notes?: string; p_registration_id: number; p_status: string }
        Returns: boolean
      }
      update_system_setting: {
        Args: { setting_key: string; setting_value: Json }
        Returns: boolean
      }
      vacuum_database: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
