export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
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
      concursos: {
        Row: {
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
      departamentos: {
        Row: {
          ativo: boolean | null
          codigo: string | null
          created_at: string
          descricao: string | null
          id: string
          nome: string
          ordem: number | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          ordem?: number | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      hero_carousel: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          image_url: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
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
      news: {
        Row: {
          author_id: string
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
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
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact_address: string | null
          contact_email: string | null
          contact_phone: string | null
          copyright_text: string | null
          created_at: string
          departments_count: string | null
          departments_description: string | null
          footer_about_description: string | null
          footer_about_subtitle: string | null
          footer_about_title: string | null
          hero_location_badge: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
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
          updated_at: string
        }
        Insert: {
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          copyright_text?: string | null
          created_at?: string
          departments_count?: string | null
          departments_description?: string | null
          footer_about_description?: string | null
          footer_about_subtitle?: string | null
          footer_about_title?: string | null
          hero_location_badge?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
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
          updated_at?: string
        }
        Update: {
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          copyright_text?: string | null
          created_at?: string
          departments_count?: string | null
          departments_description?: string | null
          footer_about_description?: string | null
          footer_about_subtitle?: string | null
          footer_about_title?: string | null
          hero_location_badge?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
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
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_current_user_admin: {
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
