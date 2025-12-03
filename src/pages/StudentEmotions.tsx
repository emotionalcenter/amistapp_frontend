import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import mascot from "../assets/mascot.png";
import StudentBottomNav from "../components/StudentBottomNav";

const EMOTIONS = ["Feliz", "Triste", "Enojado/a", "Ansioso/a", "Agradecido/a"];

interface StudentRow {
  id: string;
  teacher_id: string;
  points: number;
}

export default function StudentEmotions() {
  const [student, setStudent] = useState<StudentRow | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [todayLogged, setTodayLogged] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      const { data: stu } = await supabase
        .from("students")
        .select("id, teacher_id, points")
        .eq("user_id", userId)
        .single();

      if (!stu) {
        setLoading(false);
        return;
      }

      setStudent(stu);

      // Último registro de emociones
      const { data: lastLogs } = await supabase
        .from("emotions_log")
        .select("*")
        .eq("student_id", stu.id)
        .order("logged_date", { ascending: false })
        .limit(1);

      if (lastLogs && lastLogs.length > 0) {
        const last = lastLogs[0];
        setStreak(last.streak_count || 0);

        const todayStr = new Date().toISOString().slice(0, 10);
        if (last.logged_date === todayStr) {
          setTodayLogged(true);
          setSelectedEmotion(last.emotion);
        }
      }

      setLoading(false);
    }

    load();
  }, []);

  async function handleSave() {
    if (!student || !selectedEmotion || todayLogged) return;

    setSaving(true);
    try {
      // Obtener último registro para calcular racha
      const { data: lastLogs } = await supabase
        .from("emotions_log")
        .select("*")
        .eq("student_id", student.id)
        .order("logged_date", { ascending: false })
        .limit(1);

      let newStreak = 1;
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);

      if (lastLogs && lastLogs.length > 0) {
        const last = lastLogs[0];
        const lastDate = new Date(last.logged_date);
        const diffDays =
          (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays >= 1 && diffDays < 2) {
          // Día siguiente
          newStreak = (last.streak_count || 0) + 1;
        } else {
          newStreak = 1;
        }
      }

      // Insertar registro
      await supabase.from("emotions_log").insert({
        teacher_id: student.teacher_id,
        student_id: student.id,
        emotion: selectedEmotion,
        streak_count: newStreak,
        logged_date: todayStr,
      });

      // Si completó racha de 7 días, sumar 10 puntos
      if (newStreak % 7 === 0) {
        await supabase.rpc("increment_student_points", {
          student_id_input: student.id,
          points_input: 10,
        });
        alert(
          "¡Felicitaciones! Completaste una racha de 7 días de registro emocional. Ganaste 10 puntos 🎉"
        );
      } else {
        alert("Emoción registrada. ¡Gracias por compartir cómo te sientes! 💜");
      }

      setStreak(newStreak);
      setTodayLogged(true);
    } catch (err) {
      console.error(err);
      alert("No se pudo registrar tu emoción.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
      <header className="flex items-center gap-3 mb-4">
        <img src={mascot} className="w-12 h-12" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emociones</h1>
          <p className="text-sm text-gray-600">
            Amis te acompaña a revisar cómo te sientes cada día.
          </p>
        </div>
      </header>

      <section className="bg-white rounded-2xl shadow-md p-4 mb-4">
        <p className="text-sm text-gray-700">
          Racha actual de registro emocional:
        </p>
        <p className="text-3xl font-extrabold text-purple-600 mt-1">
          {streak}{" "}
          <span className="text-base font-normal text-gray-500">días</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Cada 7 días seguidos de registro ganas 10 puntos extra.
        </p>
      </section>

      <section className="space-y-3">
        <p className="text-sm text-gray-700">
          ¿Cómo te sientes hoy? Elige una emoción:
        </p>

        <div className="grid grid-cols-2 gap-3">
          {EMOTIONS.map((emo) => {
            const active = selectedEmotion === emo;
            return (
              <button
                key={emo}
                disabled={todayLogged}
                onClick={() => setSelectedEmotion(emo)}
                className={
                  "py-3 rounded-xl text-sm font-semibold shadow " +
                  (active
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-800")
                }
              >
                {emo}
              </button>
            );
          })}
        </div>

        <button
          disabled={!selectedEmotion || todayLogged || saving}
          onClick={handleSave}
          className="w-full mt-4 bg-purple-600 disabled:bg-gray-300 disabled:text-gray-500 text-white py-3 rounded-xl font-semibold shadow"
        >
          {todayLogged
            ? "Ya registraste tu emoción hoy"
            : saving
            ? "Guardando..."
            : "Guardar emoción de hoy"}
        </button>
      </section>

      <StudentBottomNav active="emotions" />
    </div>
  );
}
