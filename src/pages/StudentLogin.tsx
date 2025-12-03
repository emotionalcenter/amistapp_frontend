import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    // 1. Verificar si el código existe en teachers_v2
    const { data: teacher, error } = await supabase
      .from("teachers_v2")
      .select("id")
      .eq("teacher_code", code.trim())
      .single();

    if (error || !teacher) {
      alert("Código inválido. Pide a tu profesor que te comparta su código.");
      setLoading(false);
      return;
    }

    // 2. Crear sesión local del estudiante
    localStorage.setItem("student_teacher_id", teacher.id);

    // 3. Ir al registro de estudiante
    navigate("/student/register");
  }

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">
        Ingreso Estudiante
      </h1>
      <p className="text-gray-700 text-center mb-6">
        Ingresa el código que te entregó tu profesor
      </p>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full max-w-sm px-4 py-3 rounded-xl border text-lg"
        placeholder="Código del profesor"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-purple-600 text-white px-8 py-3 w-full max-w-sm rounded-xl mt-4 text-lg font-semibold"
      >
        {loading ? "Verificando..." : "Ingresar"}
      </button>
    </div>
  );
}
