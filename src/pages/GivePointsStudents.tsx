import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";

export default function GivePointsStudents() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedAction = location.state?.selectedAction;

  const [students, setStudents] = useState<any[]>([]);
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // ❗ Si alguien entra sin acción seleccionada, volver al inicio
    if (!selectedAction) {
      navigate("/teacher/give-points/actions");
      return;
    }

    async function load() {
      // 1. Obtener sesión
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      // 2. Obtener teacher data
      const { data: teacherRow } = await supabase
        .from("teachers_v2")
        .select("*")
        .eq("user_id", userId)
        .single();

      setTeacher(teacherRow);

      // 3. Obtener estudiantes por teacher_id
      const { data: studentsRows } = await supabase
        .from("students")
        .select("*")
        .eq("teacher_id", teacherRow.id)
        .order("name");

      setStudents(studentsRows || []);
      setLoading(false);
    }

    load();
  }, []);

  async function givePoints(student: any) {
    if (!teacher || !selectedAction) return;

    if (teacher.points_available < selectedAction.points) {
      alert("No tienes puntos suficientes.");
      return;
    }

    if (
      !confirm(
        `¿Quieres premiar a ${student.name} con ${selectedAction.points} puntos por: "${selectedAction.name}"?`
      )
    ) {
      return;
    }

    try {
      setSending(true);

      // 1. Registrar reconocimiento
      await supabase.from("points").insert({
        student_id: student.id,
        teacher_id: teacher.id,
        points: selectedAction.points,
        reason: selectedAction.name,
      });

      // 2. Sumar puntos al estudiante
      await supabase.rpc("increment_student_points", {
        student_id_input: student.id,
        points_input: selectedAction.points,
      });

      // 3. Restar puntos al profesor
      await supabase.rpc("decrement_teacher_points", {
        teacher_id_input: teacher.id,
        points_input: selectedAction.points,
      });

      // 4. Notificar al estudiante
      await supabase.from("notifications").insert({
        teacher_id: teacher.id,
        student_id: student.id,
        message: `${student.name} recibió ${selectedAction.points} puntos por: ${selectedAction.name}`,
        course: teacher.course,
      });

      // 5. Notificar a compañeros (puedes mejorar luego)
      const classmates = students.filter((s) => s.id !== student.id);

      for (const mate of classmates) {
        await supabase.from("notifications").insert({
          student_id: mate.id,
          message: `${student.name} fue premiado con ${selectedAction.points} puntos por: ${selectedAction.name}`,
          course: teacher.course,
        });
      }

      alert("¡Puntaje entregado con éxito! 💜");

      navigate("/teacher/home");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al entregar el puntaje.");
    } finally {
      setSending(false);
    }
  }

  if (loading)
    return <p className="p-6">Cargando estudiantes...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-4">
      <h1 className="text-2xl font-bold text-purple-700 mb-2">
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
        <p className="text-gray-500">
          No tienes estudiantes registrados.
        </p>
      )}

      <div className="space-y-3">
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
      </div>

      {sending && (
        <p className="text-center text-purple-700 font-bold">
          Enviando reconocimiento...
        </p>
      )}
    </div>
  );
}
