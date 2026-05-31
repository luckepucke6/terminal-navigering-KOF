// This file creates the Supabase client using environment variables.
// Environment variables that start with VITE_ are available in the browser
// via import.meta.env — Vite injects them at build time.
//
// If no env file is present (e.g. on GitHub Pages without secrets),
// the hardcoded values are used as fallback. The anon key is a public
// read-only key so it is safe to have in the source code.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://xjyujxhxefwjragzvnsz.supabase.co'

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqeXVqeGh4ZWZ3anJhZ3p2bnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMDAxNDcsImV4cCI6MjA5NTY3NjE0N30.WhJTOI9FsYuiZt8olV76vXsXB-j4UXe4NZB7-RcFr5Y'

// createClient gives us a single object we can use to query the database.
// Export it so any component can: import { supabase } from '../lib/supabase'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
