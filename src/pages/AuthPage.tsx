import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -------------------------
  // LOGIN EMAIL + PASSWORD
  // -------------------------
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

    // Redirección según metadata (si existe)
    const role = data.user?.user_metadata?.role;

    if (role === "teacher") {
      navigate("/teacher/dashboard");
      return;
    }

    if (role === "student") {
      navigate("/student/dashboard");
      return;
    }

    navigate("/"); // fallback
  };

  // -------------------------
  // LOGIN / REGISTRO CON GOOGLE
  // -------------------------
  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/register/teacher/complete",
      },
    });

    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-600 to-blue-500 p-6">
      <div className="bg-white p-6 w-full max-w-md rounded-xl shadow-xl space-y-6">
        <h1 className="text-3xl font-bold text-purple-700 text-center">
          Ingresar a AmistApp
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

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

        {/* BOTÓN LOGIN */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {/* BOTÓN GOOGLE */}
        <button
          onClick={handleGoogle}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Ingresar con Google
        </button>

        {/* LINK A REGISTRO */}
        <p className="text-center text-sm">
          ¿No tienes cuenta?{" "}
          <span
            onClick={() => navigate("/register/teacher")}
            className="text-blue-600 underline cursor-pointer"
          >
            Registrarme
          </span>
        </p>
      </div>
    </div>
  );
}
