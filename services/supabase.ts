
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO DO SUPABASE ---

// Uso de optional chaining (?.) para evitar erro se import.meta.env for undefined
const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const envKey = (import.meta as any).env?.VITE_SUPABASE_KEY;

// Chaves configuradas diretamente conforme solicitado
const supabaseUrl = (envUrl || "https://bddrplazegybeytuurhe.supabase.co").trim();
const supabaseKey = (envKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkZHJwbGF6ZWd5YmV5dHV1cmhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyODg1NDMsImV4cCI6MjA3OTg2NDU0M30.FDW28EbO-fl-6icHZCXFrlC7ziBU7u_e6pFwwIepgt0").trim();

if (!supabaseUrl.startsWith("http")) {
  console.warn("⚠️ SUPABASE: URL inválida. Verifique o arquivo services/supabase.ts");
}

export const isSupabaseConfigured = supabaseUrl.includes("supabase.co") && supabaseKey.length > 20;

export const supabase = createClient(supabaseUrl, supabaseKey);
