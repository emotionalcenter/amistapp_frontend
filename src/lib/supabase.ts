import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// =============================
// VARIABLES DE ENTORNO
// =============================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validación suave (no bloquea la app en desarrollo)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "❌ ERROR: No se encontraron variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY"
  );
}

// =============================
// CLIENTE DE SUPABASE
// =============================
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY ?? "",
  {
    auth: { persistSession: true },
  }
);
