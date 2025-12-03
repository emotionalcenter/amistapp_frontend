import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import StudentBottomNav from "../components/StudentBottomNav";

interface StudentRow {
  id: string;
  name: string;
  email: string;
}

interface ActionRow {
  id: string;
  name: string;
  description: string | null;
  points: number;
}

export default function StudentGivePoints() {
  const [me, setMe] = useState<{ id: string; teacher_id: string; points: number } | null>(null);
  const [classmates, setClassmates] = useState<StudentRow[]>([]);
  const [actions, setActions] = useState<ActionRow[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      // 1. Mi perfil de estudiante
      const { data: meRow } = await supabase
        .from("students")
        .select("id, teacher_id, points")
        .eq("user_id", userId)
        .single();

      if (!meRow) {
        setError("No se encontró tu perfil de estudiante.");
        setLoading(false);
        return;
      }

      setMe(meRow);

      // 2. Compañeros del mismo profesor
      const { data: classmatesRows } = await supabase
        .from("students")
        .select("id, name, email")
        .eq("teacher_id", meRow.teacher_id)
        .neq("id", meRow.id)
        .order("name");

      setClassmates(classmatesRows || []);

      // 3. Catálogo de acciones socioemocionales
      const { data: actionsRows } = await supabase
        .from("actions_catalog")
        .select("id, name, description, points")
        .order("points", { ascending: true });

      setActions(actionsRows || []);
      setLoading(false);
    }

    load();
  }, []);

  async function handleGivePoints(action: ActionRow) {
    if (!me || !selectedStudent) return;

    if (me.points < action.points) {
      alert("No tienes suficientes puntos para esta acción.");
      return;
    }

    if (!confirm(`¿Quieres premiar a ${selectedStudent.name} con ${action.points} puntos por "${action.name}"?`)) {
      return;
    }

    try {
      setSending(true);

      // 1. Insertar registro en points (reconocimiento entre pares)
      await supabase.from("points").insert({
        student_id: selectedStudent.id,
        teacher_id: me.teacher_id,
        points: action.points,
        reason: `Reconocimiento entre pares: ${action.name}`,
      });

      // 2. Sumar puntos al compañero
      await supabase.rpc("increment_student_points", {
        student_id_input: selectedStudent.id,
        points_input: action.points,
      });

      // 3. Restar puntos al estudiante que premia (puntos_input negativo)
      await supabase.rpc("increment_student_points", {
        student_id_input: me.id,
        points_input: -action.points,
      });

      // 4. Notificaciones (ajusta columnas según tu tabla)
      await supabase.from("notifications").insert([
        {
          student_id: selectedStudent.id,
          message: `${selectedStudent.name} recibió ${action.points} puntos por: ${action.name}`,
        },
        {
          student_id: me.id,
          message: `Premiaste a ${selectedStudent.name} por: ${action.name}`,
        },
      ]);

      alert("¡Puntaje entregado con éxito! 💜");
      setSelectedStudent(null);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al entregar el puntaje.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Cargando compañeros...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 px-4 pt-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Dar puntaje a un compañero
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Primero elige a quién quieres premiar. Luego selecciona la acción positiva.
      </p>

      {/* Paso 1: elegir compañero */}
      {!selectedStudent && (
        <section className="space-y-2">
          {classmates.length === 0 && (
            <p className="text-gray-500 text-sm">
              Aún no hay compañeros registrados en tu curso.
            </p>
          )}

          {classmates.map((s) => (
            <button
              key={s.id}
              className="w-full text-left bg-white rounded-xl shadow px-4 py-3 flex justify-between items-center"
              onClick={() => setSelectedStudent(s)}
            >
              <div>
                <p className="font-semibold text-sm text-gray-900">
                  {s.name}
                </p>
                <p className="text-xs text-gray-500">{s.email}</p>
              </div>
              <span className="text-xs text-purple-600 font-semibold">
                Elegir 👉
              </span>
            </button>
          ))}
        </section>
      )}

      {/* Paso 2: elegir acción */}
      {selectedStudent && (
        <section className="mt-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-700">
              Premiando a:{" "}
              <span className="font-semibold">{selectedStudent.name}</span>
            </p>
            <button
              className="text-xs text-blue-600 underline"
              onClick={() => setSelectedStudent(null)}
            >
              Cambiar compañero
            </button>
          </div>

          {actions.map((a) => (
            <button
              key={a.id}
              disabled={sending}
              onClick={() => handleGivePoints(a)}
              className="w-full text-left bg-white rounded-xl shadow px-4 py-3 hover:bg-purple-50 transition"
            >
              <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
              {a.description && (
                <p className="text-xs text-gray-500 mt-1">{a.description}</p>
              )}
              <p className="text-xs font-bold text-purple-700 mt-2">
                +{a.points} puntos
              </p>
            </button>
          ))}

          {sending && (
            <p className="text-center text-purple-700 text-sm font-semibold mt-2">
              Enviando reconocimiento...
            </p>
          )}
        </section>
      )}

      <StudentBottomNav active="home" />
    </div>
  );
}
