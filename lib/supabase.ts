import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  'https://valqwehmerdljzseplwi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhbHF3ZWhtZXJkbGp6c2VwbHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzEyNjMsImV4cCI6MjA5MjgwNzI2M30.xLMBjTtGlgn6KuvIVGkZkZwzgjWrpZg-dl2AYNmyGZc'
)