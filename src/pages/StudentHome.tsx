import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import mascot from "../assets/mascot.png";
import StudentBottomNav from "../components/StudentBottomNav";

interface StudentRow {
  id: string;
  name: string;
  email: string;
  points: number;
  teacher_id: string;
}

interface TeacherRow {
  id: string;
  full_name: string | null;
  subject: string | null;
  course: string | null;
  teacher_code: string;
}

export default function StudentHome() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentRow | null>(null);
  const [teacher, setTeacher] = useState<TeacherRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      if (!userId) {
        navigate("/login");
        return;
      }

      // 1. Buscar estudiante por user_id
      const { data: stu, error: stuError } = await supabase
        .from("students")
        .select("id, name, email, points, teacher_id")
        .eq("user_id", userId)
        .single();

      if (stuError || !stu) {
        setError("No se encontró tu perfil de estudiante.");
        setLoading(false);
        return;
      }

      setStudent(stu as StudentRow);

      // 2. Buscar profesor asociado
      if (stu.teacher_id) {
        const { data: tea } = await supabase
          .from("teachers_v2")
          .select("id, full_name, subject, course, teacher_code")
          .eq("id", stu.teacher_id)
          .single();

        if (tea) setTeacher(tea as TeacherRow);
      }

      setLoading(false);
    }

    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-white">
        Cargando tu panel...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600 text-sm">{error || "Error al cargar datos"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 pb-24">
      <header className="p-6 text-white">
        <h1 className="text-2xl font-bold">
          Hola, {student.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm opacity-90">
          Este es tu espacio en AmistApp. ¡Construimos convivencia positiva juntos!
        </p>
      </header>

      <main className="p-5 space-y-6">
        {/* Tarjeta de puntos */}
        <section className="bg-white rounded-2xl shadow-xl p-5">
          <p className="text-sm text-gray-500">Tus puntos disponibles</p>
          <p className="text-4xl font-extrabold text-green-600 mt-1">
            {student.points}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Puedes usar estos puntos para premiar a compañeros y canjear premios.
          </p>

          {teacher && (
            <div className="mt-4 border-t pt-3 text-sm text-gray-700">
              <p>
                <strong>Profesor/a:</strong>{" "}
                {teacher.full_name || "Tu docente"}
              </p>
              <p>
                <strong>Curso:</strong> {teacher.course || "-"}
              </p>
              <p>
                <strong>Código del profesor:</strong>{" "}
                <span className="font-mono text-purple-600 font-bold">
                  {teacher.teacher_code}
                </span>
              </p>
            </div>
          )}
        </section>

        {/* Mascota motivando */}
        <section className="flex flex-col items-center text-center text-white">
          <img src={mascot} className="w-32 h-32 mb-2 animate-bounce" />
          <p className="font-semibold">
            Amis te recuerda: cada punto que entregas por una buena acción
            hace tu curso más amable y respetuoso 💜
          </p>
        </section>

        {/* Acciones principales */}
        <section className="space-y-3">
          <button
            onClick={() => navigate("/student/give-points")}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            🎁 Dar puntaje a un compañero
          </button>

          <button
            onClick={() => navigate("/student/emotions")}
            className="w-full bg-white/90 text-purple-700 border border-purple-200 font-semibold py-3 rounded-xl shadow flex items-center justify-center gap-2"
          >
            💜 Registrar emoción del día
          </button>

          <button
            onClick={() => navigate("/student/rewards")}
            className="w-full bg-yellow-300/90 text-yellow-900 font-semibold py-3 rounded-xl shadow flex items-center justify-center gap-2"
          >
            🛍️ Ver y canjear premios
          </button>
        </section>
      </main>

      <StudentBottomNav active="home" />
    </div>
  );
}
