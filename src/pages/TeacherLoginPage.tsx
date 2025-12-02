import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function TeacherLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // LOGIN NORMAL
  // -----------------------------
  async function handleLogin() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/teacher/home");
  }

  // -----------------------------
  // LOGIN CON GOOGLE
  // -----------------------------
  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/teacher/success",
      },
    });

    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex justify-center items-center">
      <div className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-xl">

        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          Iniciar Sesión
        </h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-3 border rounded-lg mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 border rounded-lg mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {/* LOGIN CON GOOGLE */}
        <button
          onClick={handleGoogle}
          className="mt-3 w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg shadow hover:bg-gray-100 transition text-sm"
        >
          🔵 Iniciar con Google
        </button>

        {/* REGISTRO */}
        <p className="text-center text-sm mt-4">
          ¿No tienes cuenta?{" "}
          <Link className="text-purple-600 font-semibold" to="/register/teacher">
            Registrarme
          </Link>
        </p>
      </div>
    </div>
  );
}
