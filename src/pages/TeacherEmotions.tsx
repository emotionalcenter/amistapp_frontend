import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";

interface Student {
  id: string;
  name: string;
}

interface EmotionLog {
  student_id: string;
  logged_date: string;      // YYYY-MM-DD
  streak_count: number;
}

interface StudentEmotionStatus {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
}

export default function TeacherEmotions() {
  const [loading, setLoading] = useState(true);
  const [studentsStatus, setStudentsStatus] = useState<StudentEmotionStatus[]>(
    []
  );

  async function loadEmotions() {
    setLoading(true);

    // 1️⃣ Sesión
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    // 2️⃣ Profesor
    const { data: teacher } = await supabase
      .from("teachers_v2")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!teacher) {
      setLoading(false);
      return;
    }

    // 3️⃣ Estudiantes del profesor
    const { data: students } = await supabase
      .from("students")
      .select("id, name")
      .eq("teacher_id", teacher.id);

    const studentList: Student[] = students || [];

    if (studentList.length === 0) {
      setStudentsStatus([]);
      setLoading(false);
      return;
    }

    const studentIds = studentList.map((s) => s.id);

    // 4️⃣ Últimos registros emocionales
    const { data: logs } = await supabase
      .from("emotions_log")
      .select("student_id, logged_date, streak_count")
      .in("student_id", studentIds)
      .order("logged_date", { ascending: false })
      .limit(200);

    const emotions: EmotionLog[] = logs || [];

    const todayStr = new Date().toISOString().slice(0, 10);

    const result: StudentEmotionStatus[] = studentList.map((student) => {
      const logsOfStudent = emotions.filter(
        (e) => e.student_id === student.id
      );

      if (logsOfStudent.length === 0) {
        return {
          id: student.id,
          name: student.name,
          streak: 0,
          completedToday: false,
        };
      }

      const lastLog = logsOfStudent[0];

      return {
        id: student.id,
        name: student.name,
        streak: lastLog.streak_count ?? 0,
        completedToday: lastLog.logged_date === todayStr,
      };
    });

    setStudentsStatus(result);
    setLoading(false);
  }

  useEffect(() => {
    loadEmotions();

    // refresco automático cada 15s
    const interval = setInterval(loadEmotions, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="p-6">Cargando emociones...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Emociones</h1>
        <p className="text-sm text-gray-600">
          Seguimiento emocional diario de tus estudiantes
        </p>
      </header>

      {/* Resumen */}
      <section className="bg-white rounded-2xl shadow-md p-4 mb-4">
        <p className="text-sm text-gray-700">
          Estudiantes que registraron su emoción hoy:
        </p>
        <p className="text-2xl font-bold text-green-600 mt-1">
          {studentsStatus.filter((s) => s.completedToday).length} /{" "}
          {studentsStatus.length}
        </p>
      </section>

      {/* Lista */}
      <section className="space-y-3">
        {studentsStatus.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-xl shadow-sm px-4 py-3 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {student.name}
              </p>
              <p className="text-xs text-gray-500">
                Racha: {student.streak} días
              </p>
            </div>

            <span
              className={
                "text-xs font-semibold px-2 py-1 rounded-full " +
                (student.completedToday
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700")
              }
            >
              {student.completedToday ? "Registró hoy" : "Pendiente"}
            </span>
          </div>
        ))}

        {studentsStatus.length === 0 && (
          <p className="text-sm text-gray-600">
            Aún no hay registros de emociones para tus estudiantes.
          </p>
        )}
      </section>

      <BottomNav active="emotions" />
    </div>
  );
}
