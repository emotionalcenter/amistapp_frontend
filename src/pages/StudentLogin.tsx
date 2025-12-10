import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    // Ir al home del estudiante
    navigate("/student/home");
  }

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">
        Ingreso Estudiante
      </h1>

      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-3">

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <input
          className="w-full px-4 py-3 rounded-xl border"
          placeholder="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full px-4 py-3 rounded-xl border"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-8 py-3 w-full rounded-xl mt-2 text-lg font-semibold"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <p
          onClick={() => navigate("/student/register")}
          className="text-sm text-purple-600 text-center underline cursor-pointer mt-2"
        >
          ¿No tienes cuenta? Registrarme
        </p>
      </form>
    </div>
  );
}
