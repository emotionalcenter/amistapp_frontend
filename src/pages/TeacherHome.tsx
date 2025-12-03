import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";
import mascot from "../assets/mascot.png";
import { useNavigate } from "react-router-dom";

export default function TeacherHome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState<any>(null);

  useEffect(() => {
    async function loadTeacher() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      const userId = sessionData.session.user.id;

      const { data, error } = await supabase
        .from("teachers_v2")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        setTeacher(data);
      } else {
        console.warn("Profesor no encontrado en teachers_v2");
      }

      setLoading(false);
    }

    loadTeacher();
  }, []);

  if (loading) return <p className="p-6 text-white">Cargando datos...</p>;

  if (!teacher)
    return (
      <div className="p-6 text-white">
        <p className="text-lg font-bold">
          No se encontró el perfil del profesor.
        </p>
        <p className="mt-2">Por favor vuelve a iniciar sesión.</p>

        <button
          onClick={() => {
            supabase.auth.signOut();
            navigate("/login");
          }}
          className="mt-4 bg-red-600 px-4 py-2 rounded-lg text-white"
        >
          Cerrar sesión
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 pb-24">

      {/* HEADER */}
      <header className="p-6 text-white">
        <h1 className="text-3xl font-bold">
          ¡Bienvenido, {teacher.full_name}! 👋
        </h1>
      </header>

      <main className="p-5 space-y-6">

        {/* INFO PROFESOR */}
        <section className="bg-white shadow-xl p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-purple-600">Tu información</h2>

          <p><strong>Asignatura:</strong> {teacher.subject}</p>
          <p><strong>Curso:</strong> {teacher.course}</p>

          <div className="mt-4">
            <strong>Código Profesor:</strong>
            <p className="text-purple-700 text-2xl font-extrabold">
              {teacher.teacher_code}
            </p>

            <button
              className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
              onClick={() => navigator.clipboard.writeText(teacher.teacher_code)}
            >
              Copiar código
            </button>
          </div>

          <div className="mt-4">
            <strong>Puntos disponibles:</strong>
            <p className="text-green-600 text-3xl font-extrabold">
              {teacher.points_available}
            </p>
          </div>
        </section>

        {/* MASCOTA MOTIVACIONAL */}
        <section className="flex flex-col items-center">
          <img src={mascot} className="w-40 h-40 animate-bounce" />
          <p className="text-center text-white text-lg mt-3 font-semibold px-6">
            ¡Recuerda entregar puntos positivos hoy!
            Cada reconocimiento mejora la convivencia educativa y motiva
            a tus estudiantes a desarrollar habilidades socioemocionales. 💜
          </p>
        </section>

        {/* DAR PUNTAJE */}
        <button
          onClick={() => navigate("/teacher/give-points/students")}
          className="w-full bg-purple-700 text-white py-4 rounded-xl text-xl font-bold shadow-lg hover:bg-purple-800 transition"
        >
          🎁 Dar Puntaje
        </button>

        {/* ATAJOS */}
        <section className="grid grid-cols-2 gap-4">

          {/* Mis Estudiantes */}
          <div
            className="p-4 bg-purple-100 rounded-xl text-center shadow-md cursor-pointer"
            onClick={() => navigate("/teacher/students")}
          >
            <p className="text-purple-600 font-bold">Mis Estudiantes</p>
          </div>

          {/* Puntajes */}
          <div
            className="p-4 bg-blue-100 rounded-xl text-center shadow-md cursor-pointer"
            onClick={() => navigate("/teacher/give-points/students")}
          >
            <p className="text-blue-600 font-bold">Puntajes</p>
          </div>

          {/* Emociones */}
          <div
            className="p-4 bg-green-100 rounded-xl text-center shadow-md cursor-pointer"
            onClick={() => navigate("/teacher/emotions")}
          >
            <p className="text-green-600 font-bold">Emociones</p>
          </div>

          {/* Reportes */}
          <div
            className="p-4 bg-yellow-100 rounded-xl text-center shadow-md cursor-pointer"
            onClick={() => navigate("/teacher/reports")}
          >
            <p className="text-yellow-600 font-bold">Reportes</p>
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}
