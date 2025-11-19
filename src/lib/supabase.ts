import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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
);
