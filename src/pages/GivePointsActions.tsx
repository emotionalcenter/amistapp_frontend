import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function GivePointsActions() {
  const location = useLocation();
  const navigate = useNavigate();

  const { studentId, studentName, classroom } = location.state || {};

  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar acciones desde actions_catalog
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("actions_catalog")
        .select("*")
        .order("points", { ascending: false });

      if (!error && data) setActions(data);

      setLoading(false);
    };

    load();
  }, []);

  const givePoints = async (action: any) => {
    // 1. Registrar en points_log
    await supabase.from("points_log").insert({
      student_id: studentId,
      action: action.name,
      points: action.points,
      created_at: new Date(),
    });

    // 2. Notificar al estudiante
    await supabase.from("notifications").insert({
      student_id: studentId,
      message: `🎉 ¡Recibiste ${action.points} puntos por: ${action.name}!`,
    });

    // 3. Notificar a sus compañeros del mismo curso
    const { data: classmates } = await supabase
      .from("students")
      .select("id")
      .eq("classroom", classroom)
      .neq("id", studentId);

    if (classmates && classmates.length > 0) {
      const messages = classmates.map((c) => ({
        student_id: c.id,
        message: `📣 ${studentName} fue premiado con ${action.points} puntos por: ${action.name}`,
      }));

      await supabase.from("notifications").insert(messages);
    }

    // 4. Volver al Home
    navigate("/teacher/home");
  };

  if (loading)
    return <div className="p-6 text-center text-purple-700 font-bold">Cargando acciones...</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-purple-700">
        ¿Qué acción realizó {studentName}?
      </h1>

      <div className="mt-6 space-y-4">
        {actions.map((a) => (
          <div
            key={a.id}
            onClick={() => givePoints(a)}
            className="p-4 bg-purple-100 cursor-pointer rounded-xl shadow hover:bg-purple-200"
          >
            <p className="text-lg font-semibold">{a.name}</p>
            <p className="text-purple-600 font-bold">{a.points} pts</p>
          </div>
        ))}
      </div>
    </div>
  );
}
