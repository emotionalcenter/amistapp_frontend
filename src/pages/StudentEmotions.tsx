import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import mascot from "../assets/mascot.png";
import StudentBottomNav from "../components/StudentBottomNav";

const EMOTIONS = ["Feliz", "Triste", "Enojado/a", "Ansioso/a", "Agradecido/a"];

interface EmotionLog {
  emotion: string;
  created_at: string;
}

export default function StudentEmotions() {
  const [emotionToday, setEmotionToday] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadEmotions() {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    // Obtener estudiante
    const { data: student } = await supabase
      .from("students")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!student) {
      setLoading(false);
      return;
    }

    // Historial de emociones (últimos 30 días)
    const { data: logs } = await supabase
      .from("emotions_log")
      .select("emotion, created_at")
      .eq("student_id", student.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (!logs || logs.length === 0) {
      setStreak(0);
      setEmotionToday(null);
      setLoading(false);
      return;
    }

    // ¿Ya registró hoy?
    const todayStr = new Date().toISOString().slice(0, 10);
    const first = logs[0];
    if (first.created_at.slice(0, 10) === todayStr) {
      setEmotionToday(first.emotion);
      setSelectedEmotion(first.emotion);
    } else {
      setEmotionToday(null);
    }

    // Calcular racha (días consecutivos)
    let currentStreak = 0;
    let expectedDate = new Date(todayStr);

    for (const log of logs) {
      const logDateStr = log.created_at.slice(0, 10);
      const expectedStr = expectedDate.toISOString().slice(0, 10);

      if (logDateStr === expectedStr) {
        currentStreak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    setStreak(currentStreak);
    setLoading(false);
  }

  useEffect(() => {
    loadEmotions();
  }, []);

  async function handleSave() {
    if (!selectedEmotion || emotionToday) return;

    try {
      setSaving(true);

      const { error } = await supabase.rpc("log_student_emotion", {
        p_emotion: selectedEmotion,
        p_note: null,
      });

      if (error) {
        console.error(error);
        alert(error.message || "No se pudo registrar la emoción.");
        return;
      }

      alert("Emoción registrada 💜");
      await loadEmotions();
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al registrar la emoción.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Cargando emociones...
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

      {/* Racha */}
      <section className="bg-white rounded-2xl shadow-md p-4 mb-4">
        <p className="text-sm text-gray-700">
          Racha actual de registro emocional:
        </p>
        <p className="text-3xl font-extrabold text-purple-600 mt-1">
          {streak}{" "}
          <span className="text-base font-normal text-gray-500">días</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Registrar emociones ayuda a conocerte mejor 💜
        </p>
      </section>

      {/* Selector */}
      <section className="space-y-3">
        <p className="text-sm text-gray-700">
          ¿Cómo te sientes hoy?
        </p>

        <div className="grid grid-cols-2 gap-3">
          {EMOTIONS.map((emo) => {
            const active = selectedEmotion === emo;
            return (
              <button
                key={emo}
                disabled={!!emotionToday}
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
          disabled={!selectedEmotion || !!emotionToday || saving}
          onClick={handleSave}
          className="w-full mt-4 bg-purple-600 disabled:bg-gray-300 disabled:text-gray-500 text-white py-3 rounded-xl font-semibold shadow"
        >
          {emotionToday
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
