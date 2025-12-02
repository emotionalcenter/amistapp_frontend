import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import mascot from "../assets/mascot.png"; // asegúrate de tener este archivo

export default function TeacherHome() {
  const [teacher, setTeacher] = useState<any>(null);

  useEffect(() => {
    async function loadTeacher() {
      // 1. Obtener sesión del usuario
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      if (!userId) return;

      // 2. Obtener su perfil
      const { data, error } = await supabase
        .from("teachers_v2")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error) setTeacher(data);
    }

    loadTeacher();
  }, []);

  if (!teacher) return <p>Cargando perfil...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-6 text-white">

      {/* ENCABEZADO */}
      <h1 className="text-3xl font-bold mb-4">
        Hola, {teacher.full_name} 👋
      </h1>

      {/* TARJETA DE INFORMACIÓN */}
      <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl space-y-3">

        <p className="text-lg">
          <strong>Código Profesor:</strong>{" "}
          <span className="text-purple-700 font-mono">{teacher.teacher_code}</span>
        </p>

        <p className="text-lg">
          <strong>Puntos disponibles:</strong>{" "}
          <span className="text-green-600 text-2xl">
            {teacher.points_available}
          </span>
        </p>

        <p className="text-md text-gray-500 italic">
          (Estos son los puntos que tienes para premiar semanalmente a tu curso)
        </p>

      </div>

      {/* MASCOTA MOTIVADORA */}
      <div className="flex flex-col items-center mt-8">
        
        <img
          src={mascot}
          alt="Mascota AmistApp"
          className="w-40 h-40 rounded-full shadow-xl border-4 border-white mb-4"
        />

        <p className="text-center text-xl font-semibold">
          ¡No olvides motivar a tus estudiantes! 🌟  
        </p>

        <p className="text-center text-md text-purple-100 mt-1">
          Entregar puntos positivos mejora la convivencia educativa.
        </p>

        <button
          onClick={() => window.location.href = "/teacher/rewards"}
          className="mt-6 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl text-lg font-bold shadow-lg hover:bg-yellow-500 transition"
        >
          🎁 Dar puntaje ahora
        </button>

      </div>
    </div>
  );
}
