import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function TeacherStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      // 1) Obtener sesión actual
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      const userId = sessionData.session.user.id;

      // 2) Obtener información del profesor
      const { data: teacher, error: teacherError } = await supabase
        .from("teachers_v2")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (teacherError || !teacher) {
        console.error("Error cargando profesor:", teacherError);
        setLoading(false);
        return;
      }

      // 3) Obtener estudiantes del profesor
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .eq("teacher_id", teacher.id)
        .order("name", { ascending: true });

      if (studentsError) {
        console.error("Error cargando estudiantes:", studentsError);
      } else {
        setStudents(studentsData || []);
      }

      setLoading(false);
    }

    loadStudents();
  }, []);

  if (loading) {
    return <p className="p-5 text-lg">Cargando estudiantes...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 pb-24">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Mis Estudiantes</h1>

      {/* Si no hay estudiantes */}
      {students.length === 0 && (
        <p className="text-gray-600">
          Aún no tienes estudiantes registrados con tu código.
        </p>
      )}

      {/* Lista simple */}
      <div className="space-y-3">
        {students.map(student => (
          <div
            key={student.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">{student.name}</p>
              <p className="text-sm text-gray-500">{student.email}</p>
            </div>

            <button
              className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm"
              onClick={() =>
                navigate("/teacher/give-points/actions", {
                  state: { studentId: student.id, studentName: student.name }
                })
              }
            >
              Dar puntos
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
