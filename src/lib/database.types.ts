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
      categories: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      oauth_account: {
        Row: {
          id: string
          provider_id: string | null
          provider_user_id: string
          user_id: string
        }
        Insert: {
          id: string
          provider_id?: string | null
          provider_user_id: string
          user_id: string
        }
        Update: {
          id?: string
          provider_id?: string | null
          provider_user_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_account_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      "product-ranking": {
        Row: {
          created_at: string | null
          id: number
          product_id: string
          rank: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          product_id: string
          rank?: number
        }
        Update: {
          created_at?: string | null
          id?: number
          product_id?: string
          rank?: number
        }
        Relationships: [
          {
            foreignKeyName: "product-ranking_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: number | null
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          last_refreshed_at: string | null
          meta: Json | null
          name: string | null
          owner: string | null
          status_type: Database["public"]["Enums"]["status_type"] | null
          subcategory: Json | null
          url: string | null
          website_image_url: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          last_refreshed_at?: string | null
          meta?: Json | null
          name?: string | null
          owner?: string | null
          status_type?: Database["public"]["Enums"]["status_type"] | null
          subcategory?: Json | null
          url?: string | null
          website_image_url?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          last_refreshed_at?: string | null
          meta?: Json | null
          name?: string | null
          owner?: string | null
          status_type?: Database["public"]["Enums"]["status_type"] | null
          subcategory?: Json | null
          url?: string | null
          website_image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_categories_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      session: {
        Row: {
          expires_at: string
          id: string
          user_id: string
        }
        Insert: {
          expires_at: string
          id: string
          user_id: string
        }
        Update: {
          expires_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          id: string
          image: string | null
          username: string | null
        }
        Insert: {
          id: string
          image?: string | null
          username?: string | null
        }
        Update: {
          id?: string
          image?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      status_type: "active" | "draft" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
