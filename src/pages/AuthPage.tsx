import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || "teacher";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-600 to-blue-500 p-6">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl space-y-4">
        <h2 className="text-2xl font-bold text-center text-purple-700">
          Iniciar Sesión
        </h2>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="text-center text-sm">
          ¿No tienes cuenta?{" "}
          <span
            className="text-blue-600 underline cursor-pointer"
            onClick={() => navigate(`/register/${role}`, { state: { role } })}
          >
            Registrarme
          </span>
        </p>
      </div>
    </div>
  );
}
