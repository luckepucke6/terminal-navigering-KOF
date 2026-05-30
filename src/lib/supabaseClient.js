// This file creates the connection to our Supabase database.
// Think of Supabase as a cloud spreadsheet + API combined.
// We set it up once here, and every other file imports `supabase` from here
// to read or write data — never set it up again elsewhere.

import { createClient } from '@supabase/supabase-js'

// To find your real values:
// 1. Go to supabase.com and open your project
// 2. Click "Settings" → "API"
// 3. Copy "Project URL" and "anon public" key
// Replace the placeholder strings below with your real values.
const SUPABASE_URL = 'https://xjyujxhxefwjragzvnsz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqeXVqeGh4ZWZ3anJhZ3p2bnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMDAxNDcsImV4cCI6MjA5NTY3NjE0N30.WhJTOI9FsYuiZt8olV76vXsXB-j4UXe4NZB7-RcFr5Y'

// createClient builds the connection object.
// We export it so any component can do: import { supabase } from '../lib/supabaseClient'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
