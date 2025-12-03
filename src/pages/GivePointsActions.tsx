import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";

export default function GivePointsActions() {
  const navigate = useNavigate();
  const location = useLocation();
  const { studentId, studentName } = location.state;

  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function loadActions() {
      const { data } = await supabase
        .from("actions_catalog")
        .select("*")
        .order("points", { ascending: false });

      setActions(data || []);
      setLoading(false);
    }

    loadActions();
  }, []);

  async function givePoints(action: any) {
    setSending(true);

    // 1. Obtener sesión
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    // 2. Obtener teacher.id y puntos disponibles
    const { data: teacher } = await supabase
      .from("teachers_v2")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (teacher.points_available < action.points) {
      alert("No tienes suficientes puntos.");
      setSending(false);
      return;
    }

    // 3. Crear registro en tabla points
    await supabase.from("points").insert({
      student_id: studentId,
      teacher_id: teacher.id,
      points: action.points,
      reason: action.name,
    });

    // 4. Sumar puntos al estudiante
    await supabase.rpc("increment_student_points", {
      student_id_input: studentId,
      points_input: action.points,
    });

    // 5. Descontar puntos al profesor
    await supabase.rpc("decrement_teacher_points", {
      teacher_id_input: teacher.id,
      points_input: action.points,
    });

    // 6. Crear notificación
    await supabase.from("notifications").insert({
      teacher_id: teacher.id,
      student_id: studentId,
      message: `${studentName} fue premiado por: ${action.name}`,
      course: teacher.course,
    });

    setSending(false);
    navigate("/teacher/home");
  }

  if (loading) return <p className="p-5">Cargando acciones...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-4">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">
        Selecciona una acción para: {studentName}
      </h1>

      {actions.map(action => (
        <div
          key={action.id}
          onClick={() => givePoints(action)}
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-purple-100"
        >
          <p className="font-bold">{action.name}</p>
          <p className="text-sm text-gray-600">{action.description}</p>
          <p className="text-purple-600 font-bold mt-2">
            +{action.points} puntos
          </p>
        </div>
      ))}

      {sending && (
        <p className="text-center text-purple-700 font-bold">Enviando...</p>
      )}
    </div>
  );
}
