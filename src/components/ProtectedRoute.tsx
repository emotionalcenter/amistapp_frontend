import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function verify() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/login");
      } else {
        setChecking(false);
      }
    }

    verify();
  }, []);

  if (checking) return <p>Cargando...</p>;

  return children;
}
