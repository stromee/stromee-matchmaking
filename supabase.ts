export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      producers: {
        Row: {
          created_at: string
          id: string
          internal_id: number
          name: string
          tag: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          internal_id: number
          name: string
          tag?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          internal_id?: number
          name?: string
          tag?: string
          updated_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
