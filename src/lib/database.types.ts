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
      reports: {
        Row: {
          id: string
          client_id: string
          user_id: string
          status: 'pending' | 'processing' | 'completed' | 'failed'
          file_url: string | null
          original_file_url: string
          webhook_id: string | null
          created_at: string
          updated_at: string
          error_message: string | null
        }
        Insert: {
          id?: string
          client_id: string
          user_id: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          file_url?: string | null
          original_file_url: string
          webhook_id?: string | null
          created_at?: string
          updated_at?: string
          error_message?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          user_id?: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          file_url?: string | null
          original_file_url?: string
          webhook_id?: string | null
          created_at?: string
          updated_at?: string
          error_message?: string | null
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          address: string
          status: string
          reports_count: number
          last_report_date: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          address: string
          status?: string
          reports_count?: number
          last_report_date?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          status?: string
          reports_count?: number
          last_report_date?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
  }
}