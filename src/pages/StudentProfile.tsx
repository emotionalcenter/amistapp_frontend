import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import StudentBottomNav from "../components/StudentBottomNav";

interface StudentRow {
  id: string;
  name: string;
  email: string;
  school_name: string | null;
  points: number;
}

export default function StudentProfile() {
  const [student, setStudent] = useState<StudentRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      const { data: stu } = await supabase
        .from("students")
        .select("id, name, email, school_name, points")
        .eq("user_id", userId)
        .single();

      if (stu) setStudent(stu);
      setLoading(false);
    }

    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
        <p className="text-sm text-gray-600">
          Información personal y configuración de tu cuenta.
        </p>
      </header>

      <section className="bg-white rounded-2xl shadow-md p-4 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl">
          {student.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{student.name}</p>
          <p className="text-xs text-gray-500">{student.email}</p>
          <p className="text-xs text-gray-500 mt-1">
            {student.school_name || "Tu colegio"} · Puntos:{" "}
            <span className="font-bold text-green-600">{student.points}</span>
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <button className="w-full text-left bg-white rounded-xl shadow-sm px-4 py-3 text-sm font-semibold text-gray-800 flex justify-between items-center">
          Editar mis datos
          <span className="text-gray-400">✏️</span>
        </button>

        <button className="w-full text-left bg-white rounded-xl shadow-sm px-4 py-3 text-sm font-semibold text-gray-800 flex justify-between items-center">
          Configuraciones de notificaciones
          <span className="text-gray-400">⚙️</span>
        </button>

        <button className="w-full text-left bg-white rounded-xl shadow-sm px-4 py-3 text-sm font-semibold text-gray-800 flex justify-between items-center">
          Ver políticas de convivencia
          <span className="text-gray-400">📜</span>
        </button>
      </section>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white font-semibold py-3 rounded-xl shadow"
        >
          Cerrar sesión
        </button>
      </div>

      <StudentBottomNav active="profile" />
    </div>
  );
}
