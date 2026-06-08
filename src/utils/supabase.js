import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY

let supabaseClient = null

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL atau Anon Key tidak ditemukan. Aplikasi berjalan dengan mode data offline lokal.'
  )
} else {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  } catch (err) {
    console.error('Gagal menginisialisasi client Supabase:', err)
  }
}

export const supabase = supabaseClient
