import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function GivePointsStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // 1. Obtener sesión
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      // 2. Obtener teacher.id
      const { data: teacher } = await supabase
        .from("teachers_v2")
        .select("id")
        .eq("user_id", userId)
        .single();

      // 3. Obtener estudiantes asociados
      const { data: studentsData } = await supabase
        .from("students")
        .select("*")
        .eq("teacher_id", teacher.id)
        .order("name");

      setStudents(studentsData || []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <p className="p-4">Cargando estudiantes...</p>;

  return (
    <div className="p-6 space-y-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-purple-700">Selecciona un estudiante</h1>

      {students.length === 0 && (
        <p className="text-gray-600">Aún no tienes estudiantes registrados.</p>
      )}

      <div className="space-y-3">
        {students.map(student => (
          <div
            key={student.id}
            onClick={() =>
              navigate("/teacher/give-points/actions", {
                state: {
                  studentId: student.id,
                  studentName: student.name,
                },
              })
            }
            className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-purple-100 transition"
          >
            <p className="font-bold">{student.name}</p>
            <p className="text-sm text-gray-500">{student.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
