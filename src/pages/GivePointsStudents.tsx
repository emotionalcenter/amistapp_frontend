import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";

export default function GivePointsStudents() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedAction = location.state?.selectedAction;

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!selectedAction) {
      navigate("/give-points/actions");
      return;
    }

    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      const { data: teacher } = await supabase
        .from("teachers_v2")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!teacher) return;

      const { data: studentsRows } = await supabase
        .from("students")
        .select("id, name, email")
        .eq("teacher_id", teacher.id)
        .order("name");

      setStudents(studentsRows || []);
      setLoading(false);
    }

    load();
  }, []);

  async function givePoints(student: any) {
    if (!selectedAction) return;

    if (
      !confirm(
        `¿Premiar a ${student.name} con ${selectedAction.points} puntos por "${selectedAction.name}"?`
      )
    )
      return;

    try {
      setSending(true);

      // 🔑 UNA SOLA LLAMADA
      await supabase.rpc("give_points_to_student", {
        p_student_id: student.id,
        p_points: selectedAction.points,
        p_reason: selectedAction.name,
      });

      alert("¡Puntaje entregado correctamente! 💜");
      navigate("/teacher/home");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al entregar puntaje");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <p className="p-6">Cargando estudiantes...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-4">
      <h1 className="text-2xl font-bold text-purple-700">
        Selecciona un estudiante
      </h1>

      <p className="text-sm text-gray-600">
        Acción:{" "}
        <span className="font-semibold text-purple-700">
          {selectedAction.name}
        </span>{" "}
        (+{selectedAction.points} puntos)
      </p>

      {students.map((student) => (
        <div
          key={student.id}
          onClick={() => givePoints(student)}
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-purple-100 transition"
        >
          <p className="font-bold">{student.name}</p>
          <p className="text-sm text-gray-500">{student.email}</p>
        </div>
      ))}

      {sending && (
        <p className="text-center text-purple-700 font-bold">
          Enviando reconocimiento...
        </p>
      )}
    </div>
  );
}
