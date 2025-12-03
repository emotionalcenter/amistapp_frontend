import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function verify() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/login");
      } else {
        setSession(data.session);
        setLoading(false);
      }
    }

    verify();
  }, []);

  if (loading) return <p>Cargando...</p>;

  // Pasamos la sesión como prop interna
  return children;
}
