export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          active: boolean
          code: string
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          click_count: number
          created_at: string
          event_name: string
          id: string
          updated_at: string
        }
        Insert: {
          click_count?: number
          created_at?: string
          event_name: string
          id?: string
          updated_at?: string
        }
        Update: {
          click_count?: number
          created_at?: string
          event_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      freight_agent_referrals: {
        Row: {
          agent_code: string
          contact_date: string | null
          created_at: string
          freight_id: string
          id: string
        }
        Insert: {
          agent_code: string
          contact_date?: string | null
          created_at?: string
          freight_id: string
          id?: string
        }
        Update: {
          agent_code?: string
          contact_date?: string | null
          created_at?: string
          freight_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "freight_agent_referrals_freight_id_fkey"
            columns: ["freight_id"]
            isOneToOne: false
            referencedRelation: "freights"
            referencedColumns: ["id"]
          },
        ]
      }
      freights: {
        Row: {
          cargo_content: string | null
          cargo_type: string
          contact: string
          created_at: string
          date: string
          description: string | null
          destination: string
          dry_cargo: boolean | null
          expected_delivery_date: string | null
          freight_distance: number | null
          has_insurance: boolean | null
          has_tracker: boolean | null
          hashFrete: string | null
          id: string
          live_cargo: boolean | null
          loading_date: string | null
          observations: string | null
          origin: string
          processing_date: string | null
          refrigerated: boolean | null
          requires_mopp: boolean | null
          sender_company: string | null
          status: string
          tarp_required: boolean | null
          toll_included: boolean | null
          truck_type: string
          updated_at: string
          value: number | null
          weight: number | null
        }
        Insert: {
          cargo_content?: string | null
          cargo_type: string
          contact: string
          created_at?: string
          date?: string
          description?: string | null
          destination: string
          dry_cargo?: boolean | null
          expected_delivery_date?: string | null
          freight_distance?: number | null
          has_insurance?: boolean | null
          has_tracker?: boolean | null
          hashFrete?: string | null
          id?: string
          live_cargo?: boolean | null
          loading_date?: string | null
          observations?: string | null
          origin: string
          processing_date?: string | null
          refrigerated?: boolean | null
          requires_mopp?: boolean | null
          sender_company?: string | null
          status?: string
          tarp_required?: boolean | null
          toll_included?: boolean | null
          truck_type: string
          updated_at?: string
          value?: number | null
          weight?: number | null
        }
        Update: {
          cargo_content?: string | null
          cargo_type?: string
          contact?: string
          created_at?: string
          date?: string
          description?: string | null
          destination?: string
          dry_cargo?: boolean | null
          expected_delivery_date?: string | null
          freight_distance?: number | null
          has_insurance?: boolean | null
          has_tracker?: boolean | null
          hashFrete?: string | null
          id?: string
          live_cargo?: boolean | null
          loading_date?: string | null
          observations?: string | null
          origin?: string
          processing_date?: string | null
          refrigerated?: boolean | null
          requires_mopp?: boolean | null
          sender_company?: string | null
          status?: string
          tarp_required?: boolean | null
          toll_included?: boolean | null
          truck_type?: string
          updated_at?: string
          value?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      mascot_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          likes_count: number
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          likes_count?: number
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          likes_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      municipalities: {
        Row: {
          id: number
          lat: string | null
          lng: string | null
          name: string
          state: string
        }
        Insert: {
          id?: number
          lat?: string | null
          lng?: string | null
          name: string
          state: string
        }
        Update: {
          id?: number
          lat?: string | null
          lng?: string | null
          name?: string
          state?: string
        }
        Relationships: []
      }
      promotional_banners: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          redirect_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          redirect_url: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          redirect_url?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_freights: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      increment_analytics_event: {
        Args: { _event_name: string }
        Returns: undefined
      }
      record_freight_agent_referral: {
        Args: { _freight_id: string; _agent_code: string }
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
