import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthChoice() {
  const navigate = useNavigate();

  useEffect(() => {
    async function run() {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;

      if (!user) {
        navigate("/");
        return;
      }

      const role = user.user_metadata?.role;

      if (role === "teacher") navigate("/teacher/home");
      else if (role === "student") navigate("/student/home");
      else navigate("/");
    }

    run();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center text-purple-600">
      <p>Validando acceso...</p>
    </div>
  );
}
