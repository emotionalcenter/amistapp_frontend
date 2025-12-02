import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<any>(null);

  useEffect(() => {
    async function loadTeacher() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      const userId = sessionData.session.user.id;

      const { data, error } = await supabase
        .from("teachers_v2")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error) setTeacher(data);
    }

    loadTeacher();
  }, []);

  if (!teacher) return <p>Cargando perfil...</p>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-purple-700">
        Bienvenido, {teacher.full_name}
      </h2>

      <div className="bg-white rounded-xl shadow p-4 space-y-2">
        <p><strong>Asignatura:</strong> {teacher.subject}</p>
        <p><strong>Curso:</strong> {teacher.course}</p>
        <p><strong>Código Profesor:</strong> <span className="text-blue-600 font-mono">{teacher.teacher_code}</span></p>
        <p><strong>Puntos disponibles:</strong> <span className="text-green-600 text-2xl">{teacher.points_available}</span></p>
      </div>
    </div>
  );
}
