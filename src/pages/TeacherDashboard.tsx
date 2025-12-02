import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import mascot from "../assets/mascot.png";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTeacher() {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      if (!userId) return;

      const { data, error } = await supabase
        .from("teachers_v2")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        setTeacher(data);
      }
    }

    loadTeacher();
  }, []);

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 text-white">
        Cargando tu panel docente...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-6 text-white">
      {/* ENCABEZADO */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
        Bienvenido, {teacher.full_name} 👋
      </h1>

      {/* TARJETA PRINCIPAL */}
      <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl space-y-3 max-w-3xl">
        <p className="text-lg">
          <span className="font-bold">Asignatura:</span>{" "}
          {teacher.subject || "No registrado"}
        </p>
        <p className="text-lg">
          <span className="font-bold">Curso:</span>{" "}
          {teacher.course || "No registrado"}
        </p>
        <p className="text-lg">
          <span className="font-bold">Código Profesor:</span>{" "}
          <span className="text-purple-700 font-mono">
            {teacher.teacher_code}
          </span>
        </p>
        <p className="text-lg">
          <span className="font-bold">Puntos disponibles:</span>{" "}
          <span className="text-green-600 text-2xl font-extrabold">
            {teacher.points_available ?? 1000}
          </span>
        </p>
        <p className="text-sm text-gray-500 italic">
          Estos son los puntos que puedes usar para premiar a tus estudiantes.
        </p>
      </div>

      {/* SECCIÓN MASCOTA + ACCIÓN */}
      <div className="mt-10 flex flex-col md:flex-row items-center gap-8 max-w-3xl">
        {/* Mascota */}
        <div className="flex flex-col items-center">
          <img
            src={mascot}
            alt="Mascota AmistApp"
            className="w-40 h-40 rounded-full shadow-xl border-4 border-white mb-4"
          />
          <p className="text-center text-lg font-semibold">
            ¡Recuerda entregar puntos positivos hoy! 🌟
          </p>
          <p className="text-center text-sm text-purple-100">
            Cada reconocimiento mejora la convivencia educativa en tu curso.
          </p>
        </div>

        {/* Botón de acción */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <button
            onClick={() => navigate("/teacher/rewards")}
            className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl text-lg font-bold shadow-lg hover:bg-yellow-500 transition w-full md:w-auto"
          >
            🎁 Dar puntaje ahora
          </button>

          <p className="mt-3 text-sm text-purple-100 text-center md:text-left">
            Usa este botón para ir a la sección de premios y asignar puntos
            positivos a tus estudiantes por habilidades socioemocionales.
          </p>
        </div>
      </div>
    </div>
  );
}
