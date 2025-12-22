import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";

interface ReportRow {
  id: string;
  status: string;
  created_at: string;
  description: string;
  response_message: string | null;
  students: {
    name: string;
    email: string;
  };
}

export default function TeacherReports() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ReportRow | null>(null);
  const [response, setResponse] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return;

    const { data: teacher } = await supabase
      .from("teachers_v2")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!teacher) return;

    const { data } = await supabase
      .from("reports")
      .select(`
        id,
        status,
        description,
        created_at,
        response_message,
        students(name, email)
      `)
      .eq("teacher_id", teacher.id)
      .order("created_at", { ascending: false });

    setReports(data || []);
    setLoading(false);
  }

  function statusStyle(status: string) {
    if (status === "respondido")
      return "bg-green-100 text-green-700";
    if (status === "pendiente")
      return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  }

  async function updateStatus(
    status: "respondido" | "pendiente" | "rechazado"
  ) {
    if (!selected) return;

    setSaving(true);

    await supabase.rpc("teacher_update_report", {
      p_report_id: selected.id,
      p_status: status,
      p_response_message: response || null,
    });

    alert("Reporte actualizado correctamente 💜");

    setSelected(null);
    setResponse("");
    loadReports();
    setSaving(false);
  }

  if (loading) return <p className="p-6">Cargando reportes...</p>;

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4 space-y-4">
      <h1 className="text-2xl font-bold text-purple-700">
        Reportes de estudiantes
      </h1>

      {reports.length === 0 && (
        <p className="text-gray-600 text-sm">
          Aún no hay reportes enviados por tus estudiantes.
        </p>
      )}

      {reports.map((r) => (
        <div
          key={r.id}
          className="bg-white rounded-2xl shadow p-4 space-y-2"
        >
          <div className="flex justify-between items-center">
            <p className="font-semibold text-purple-700">
              {r.students.name}
            </p>
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${statusStyle(
                r.status
              )}`}
            >
              {r.status.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            {new Date(r.created_at).toLocaleString()}
          </p>

          <button
            onClick={() => setSelected(r)}
            className="w-full mt-2 bg-purple-600 text-white py-2 rounded-xl text-sm font-semibold"
          >
            Ver detalle
          </button>
        </div>
      ))}

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-5 w-[90%] max-w-md space-y-4">
            <h2 className="text-lg font-bold text-purple-700">
              Reporte de {selected.students.name}
            </h2>

            <p className="text-xs text-gray-500">
              {new Date(selected.created_at).toLocaleString()}
            </p>

            <pre className="bg-gray-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
              {selected.description}
            </pre>

            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Escribe un mensaje para el estudiante (opcional)"
              className="w-full border rounded-xl p-3 text-sm"
            />

            <div className="grid grid-cols-3 gap-2">
              <button
                disabled={saving}
                onClick={() => updateStatus("respondido")}
                className="bg-green-600 text-white py-2 rounded-lg text-sm"
              >
                Respondido
              </button>
              <button
                disabled={saving}
                onClick={() => updateStatus("pendiente")}
                className="bg-yellow-500 text-white py-2 rounded-lg text-sm"
              >
                Pendiente
              </button>
              <button
                disabled={saving}
                onClick={() => updateStatus("rechazado")}
                className="bg-red-600 text-white py-2 rounded-lg text-sm"
              >
                Rechazar
              </button>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="w-full text-sm text-gray-500 mt-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <BottomNav active="reports" />
    </div>
  );
}
