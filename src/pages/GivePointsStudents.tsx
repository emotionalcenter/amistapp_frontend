import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";

export default function GivePointsStudents() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedAction = location.state?.selectedAction;

  const [students, setStudents] = useState<any[]>([]);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!selectedAction) {
      navigate("/give-points/actions");
      return;
    }

    async function load() {
      setLoading(true);

      const { data: sessionData, error: sessionErr } =
        await supabase.auth.getSession();

      if (sessionErr || !sessionData.session) {
        navigate("/login");
        return;
      }

      const userId = sessionData.session.user.id;

      const { data: teacher, error: teacherErr } = await supabase
        .from("teachers_v2")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (teacherErr || !teacher) {
        alert("No se encontró tu perfil de profesor.");
        setLoading(false);
        return;
      }

      setTeacherId(teacher.id);

      const { data: studentsRows, error: studentsErr } = await supabase
        .from("students")
        .select("id, name, email")
        .eq("teacher_id", teacher.id)
        .order("name", { ascending: true });

      if (studentsErr) {
        console.error(studentsErr);
        alert("No se pudieron cargar los estudiantes.");
      }

      setStudents(studentsRows || []);
      setLoading(false);
    }

    load();
  }, [navigate, selectedAction]);

  async function givePoints(student: any) {
    if (!selectedAction || !teacherId) return;

    const pts = Number(selectedAction.points || 0);
    if (!Number.isFinite(pts) || pts <= 0) {
      alert("La acción seleccionada tiene puntaje inválido.");
      return;
    }

    const ok = confirm(
      `¿Premiar a ${student.name} con ${pts} puntos por "${selectedAction.name}"?`
    );
    if (!ok) return;

    try {
      setSending(true);

      const { error } = await supabase.rpc("give_points_to_student", {
        p_student_id: student.id,
        p_points: pts,
        p_reason: String(selectedAction.name || "Reconocimiento"),
      });

      if (error) {
        console.error(error);
        alert(error.message || "Error al entregar puntaje");
        return;
      }

      alert("¡Puntaje entregado correctamente! 💜");

      // Volvemos al home. TeacherHome se refresca solo.
      navigate("/teacher/home", { replace: true });
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Error inesperado al entregar puntaje");
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

      {students.length === 0 && (
        <p className="text-gray-600">
          No tienes estudiantes registrados con tu código.
        </p>
      )}

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
