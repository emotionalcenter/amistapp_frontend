import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";

interface StudentRow {
  id: string;
  name: string;
}

interface EmotionRow {
  student_id: string;
  streak_count: number;
  logged_date: string; // date
}

interface StudentEmotion {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
}

export default function TeacherEmotions() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentEmotion[]>([]);

  useEffect(() => {
    async function load() {
      // 1. sesión
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      // 2. teacher.id
      const { data: teacher } = await supabase
        .from("teachers_v2")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!teacher) {
        setLoading(false);
        return;
      }

      // 3. estudiantes de este profesor
      const { data: studentsRows } = await supabase
        .from("students")
        .select("id, name")
        .eq("teacher_id", teacher.id);

      const studentList: StudentRow[] = studentsRows || [];

      if (studentList.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      const studentIds = studentList.map((s) => s.id);

      // 4. último registro de emoción por estudiante
      const { data: emotionsRows } = await supabase
        .from("emotions_log")
        .select("student_id, streak_count, logged_date")
        .in("student_id", studentIds)
        .order("logged_date", { ascending: false });

      const emotions: EmotionRow[] = emotionsRows || [];

      const mapLastEmotion = new Map<string, EmotionRow>();
      for (const row of emotions) {
        if (!mapLastEmotion.has(row.student_id)) {
          mapLastEmotion.set(row.student_id, row);
        }
      }

      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

      const result: StudentEmotion[] = studentList.map((s) => {
        const emo = mapLastEmotion.get(s.id);
        const loggedDate = emo?.logged_date?.slice(0, 10);
        return {
          id: s.id,
          name: s.name,
          streak: emo?.streak_count ?? 0,
          completedToday: loggedDate === today,
        };
      });

      setStudents(result);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <p className="p-6">Cargando emociones...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Emociones</h1>
        <p className="text-sm text-gray-600">
          Rachas y participación emocional de tus estudiantes
        </p>
      </header>

      {/* Resumen */}
      <section className="bg-white rounded-2xl shadow-md p-4 mb-4">
        <p className="text-sm text-gray-700">
          Estudiantes que completaron su emoción hoy:
        </p>
        <p className="text-2xl font-bold text-green-600 mt-1">
          {students.filter((s) => s.completedToday).length} / {students.length}
        </p>
      </section>

      {/* Lista */}
      <section className="space-y-3">
        {students.map((student) => (
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
            <div className="flex flex-col items-end gap-1">
              <span
                className={
                  "text-xs font-semibold px-2 py-1 rounded-full " +
                  (student.completedToday
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700")
                }
              >
                {student.completedToday ? "Completó hoy" : "Pendiente"}
              </span>
              {!student.completedToday && (
                <button className="text-[11px] text-blue-600 font-semibold">
                  Enviar recordatorio
                </button>
              )}
            </div>
          </div>
        ))}

        {students.length === 0 && (
          <p className="text-sm text-gray-600">
            Aún no hay registros de emociones para tus estudiantes.
          </p>
        )}
      </section>

      <BottomNav active="emotions" />
    </div>
  );
}
