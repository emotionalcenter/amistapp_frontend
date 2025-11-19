import { createClient, type SupabaseClient } from "@supabase/supabase-js";

<<<<<<< HEAD
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // No rompemos la app en build, pero mostramos un error en consola.
  // En producción, asegúrate de configurar las variables en Vercel.
  // eslint-disable-next-line no-console
  console.error("❌ ERROR: Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY");
}

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY ?? ""
=======
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
>>>>>>> 7edc912eb716b41f89e346c5f1285fd1cb1682c5
);
