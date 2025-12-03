import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

export default function TeacherProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState<any | null>(null);

  useEffect(() => {
    async function loadTeacher() {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      if (!userId) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("teachers_v2")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        setTeacher(data);
      }

      setLoading(false);
    }

    loadTeacher();
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  if (loading) {
    return <p className="p-6">Cargando perfil...</p>;
  }

  if (!teacher) {
    return <p className="p-6">No se encontró el perfil del docente.</p>;
  }

  const initials =
    (teacher.full_name || "")
      .split(" ")
      .map((p: string) => p[0])
      .join("")
      .toUpperCase() || "P";

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
        <p className="text-sm text-gray-600">Información personal del docente</p>
      </header>

      {/* Card de perfil */}
      <section className="bg-white rounded-2xl shadow-md p-4 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900">
            {teacher.full_name || `${teacher.first_name} ${teacher.last_name}`}
          </p>
          <p className="text-xs text-gray-500">{teacher.email}</p>
          <p className="text-xs text-gray-500 mt-1">
            {teacher.subject} · {teacher.course}
          </p>
        </div>
      </section>

      {/* Acciones (UI, aún sin lógica extra) */}
      <section className="space-y-3">
        <button className="w-full text-left bg-white rounded-xl shadow-sm px-4 py-3 text-sm font-semibold text-gray-800 flex justify-between items-center">
          Editar datos personales
          <span className="text-gray-400">✏️</span>
        </button>

        <button className="w-full text-left bg-white rounded-xl shadow-sm px-4 py-3 text-sm font-semibold text-gray-800 flex justify-between items-center">
          Enviar mis datos por correo
          <span className="text-blue-500 text-xs">Notificar</span>
        </button>

        <button className="w-full text-left bg-white rounded-xl shadow-sm px-4 py-3 text-sm font-semibold text-gray-800 flex justify-between items-center">
          Historial de actividades
          <span className="text-gray-400">📜</span>
        </button>

        <button className="w-full text-left bg-white rounded-xl shadow-sm px-4 py-3 text-sm font-semibold text-gray-800 flex justify-between items-center">
          Configuraciones
          <span className="text-gray-400">⚙️</span>
        </button>
      </section>

      {/* Cerrar sesión */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white font-semibold py-3 rounded-xl shadow"
        >
          Cerrar sesión
        </button>
      </div>

      <BottomNav active="profile" />
    </div>
  );
}
