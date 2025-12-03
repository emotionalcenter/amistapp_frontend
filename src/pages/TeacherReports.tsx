import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";

interface ReportRow {
  id: string;
  description: string;
  status: "visto" | "pendiente" | "rechazado";
  student_name: string;
}

function getStatusStyles(status: ReportRow["status"]) {
  if (status === "visto") return "bg-green-100 text-green-700";
  if (status === "pendiente") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function TeacherReports() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<ReportRow[]>([]);

  useEffect(() => {
    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      const { data: teacher } = await supabase
        .from("teachers_v2")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!teacher) {
        setLoading(false);
        return;
      }

      // Traemos reports + nombre de estudiante.
      // Si tienes FK definida, puedes usar "students(name)" en el select.
      const { data: reportsRows } = await supabase
        .from("reports")
        .select("id, description, status, student_id")
        .eq("teacher_id", teacher.id)
        .order("created_at", { ascending: false });

      const rows = reportsRows || [];

      // Cargar nombres de estudiantes para esos IDs
      const studentIds = Array.from(
        new Set(rows.map((r: any) => r.student_id).filter(Boolean))
      );

      let mapNames = new Map<string, string>();

      if (studentIds.length > 0) {
        const { data: studentsRows } = await supabase
          .from("students")
          .select("id, name")
          .in("id", studentIds);

        (studentsRows || []).forEach((s: any) => {
          mapNames.set(s.id, s.name);
        });
      }

      const mapped: ReportRow[] = rows.map((r: any) => ({
        id: r.id,
        description: r.description,
        status: r.status,
        student_name: mapNames.get(r.student_id) || "Estudiante",
      }));

      setReports(mapped);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <p className="p-6">Cargando reportes...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
        <p className="text-sm text-gray-600">
          Revisa el estado de los reportes de tus estudiantes
        </p>
      </header>

      <section className="space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {report.student_name}
                </p>
                <p className="text-xs text-gray-500">{report.description}</p>
              </div>
              <span
                className={
                  "text-[11px] font-semibold px-2 py-1 rounded-full " +
                  getStatusStyles(report.status)
                }
              >
                {report.status.toUpperCase()}
              </span>
            </div>

            <button className="self-end text-[11px] text-blue-600 font-semibold">
              Notificar que su caso fue visto
            </button>
          </div>
        ))}

        {reports.length === 0 && (
          <p className="text-sm text-gray-600">
            Aún no hay reportes registrados para tus estudiantes.
          </p>
        )}
      </section>

      <BottomNav active="reports" />
    </div>
  );
}
