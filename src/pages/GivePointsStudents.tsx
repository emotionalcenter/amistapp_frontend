import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function GivePointsStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) setStudents(data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading)
    return <div className="p-6 text-center text-purple-700 font-bold">Cargando estudiantes...</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">Selecciona un estudiante</h1>

      <div className="space-y-4">
        {students.map((s) => (
          <div
            key={s.id}
            onClick={() =>
              navigate("/teacher/give-points/actions", {
                state: { studentId: s.id, studentName: s.name, classroom: s.classroom },
              })
            }
            className="p-4 bg-white shadow-md rounded-xl cursor-pointer hover:bg-purple-100"
          >
            <p className="text-lg font-semibold">{s.name}</p>
            <p className="text-gray-500 text-sm">Curso: {s.classroom}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
