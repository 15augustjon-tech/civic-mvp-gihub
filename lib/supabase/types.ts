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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          state: string | null
          party_preference: 'R' | 'D' | 'I' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          state?: string | null
          party_preference?: 'R' | 'D' | 'I' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          state?: string | null
          party_preference?: 'R' | 'D' | 'I' | null
          created_at?: string
          updated_at?: string
        }
      }
      watchlists: {
        Row: {
          id: string
          user_id: string
          politician_id: string
          politician_name: string
          politician_party: 'R' | 'D' | 'I'
          politician_state: string
          politician_chamber: 'senate' | 'house'
          alerts_enabled: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          politician_id: string
          politician_name: string
          politician_party: 'R' | 'D' | 'I'
          politician_state: string
          politician_chamber: 'senate' | 'house'
          alerts_enabled?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          politician_id?: string
          politician_name?: string
          politician_party?: 'R' | 'D' | 'I'
          politician_state?: string
          politician_chamber?: 'senate' | 'house'
          alerts_enabled?: boolean
          created_at?: string
        }
      }
      trade_alerts: {
        Row: {
          id: string
          user_id: string
          watchlist_id: string
          politician_name: string
          ticker: string
          trade_type: string
          amount: string
          trade_date: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          watchlist_id: string
          politician_name: string
          ticker: string
          trade_type: string
          amount: string
          trade_date: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          watchlist_id?: string
          politician_name?: string
          ticker?: string
          trade_type?: string
          amount?: string
          trade_date?: string
          read?: boolean
          created_at?: string
        }
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
  }
}
