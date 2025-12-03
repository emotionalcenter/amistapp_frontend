import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import mascot from "../assets/mascot.png";
import StudentBottomNav from "../components/StudentBottomNav";

interface StudentRow {
  id: string;
  teacher_id: string;
}

interface ReportRow {
  id: string;
  description: string;
  status: string;
  created_at: string;
}

export default function StudentReports() {
  const [student, setStudent] = useState<StudentRow | null>(null);
  const [anonymous, setAnonymous] = useState(false);
  const [place, setPlace] = useState("");
  const [description, setDescription] = useState("");
  const [expectation, setExpectation] = useState("");
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      const { data: stu } = await supabase
        .from("students")
        .select("id, teacher_id")
        .eq("user_id", userId)
        .single();

      if (!stu) {
        setLoading(false);
        return;
      }

      setStudent(stu);

      const { data: reps } = await supabase
        .from("reports")
        .select("id, description, status, created_at")
        .eq("student_id", stu.id)
        .order("created_at", { ascending: false });

      setReports(reps || []);
      setLoading(false);
    }

    load();
  }, []);

  function statusColor(status: string) {
    if (status === "visto" || status === "resuelto")
      return "bg-green-100 text-green-700";
    if (status === "pendiente") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!student) return;

    if (!place || !description || !expectation) {
      alert("Completa todos los campos del formulario.");
      return;
    }

    try {
      setSending(true);

      const fullDescription = `Lugar: ${place}\nDescripción: ${description}\nLo que espero que pase: ${expectation}\nAnonimo: ${
        anonymous ? "sí" : "no"
      }`;

      await supabase.from("reports").insert({
        teacher_id: student.teacher_id,
        student_id: student.id,
        report_type: "reporte estudiante",
        description: fullDescription,
        status: "pendiente",
      });

      alert(
        "Tu reporte fue enviado al docente. Gracias por confiar en AmistApp 💜"
      );

      setPlace("");
      setDescription("");
      setExpectation("");

      // Recargar historial
      const { data: reps } = await supabase
        .from("reports")
        .select("id, description, status, created_at")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false });

      setReports(reps || []);
    } catch (err) {
      console.error(err);
      alert("No se pudo enviar el reporte.");
    } finally {
      setSending(false);
    }
  }

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Cargando reportes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4 space-y-4">
      <header className="flex gap-3 items-center">
        <img src={mascot} className="w-12 h-12" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
          <p className="text-sm text-gray-600">
            Amis te ayuda a pedir apoyo cuando algo no se siente justo o seguro.
          </p>
        </div>
      </header>

      {/* Formulario */}
      <section className="bg-white rounded-2xl shadow-md p-4 space-y-3">
        <h2 className="text-sm font-semibold text-gray-800">
          Crear un nuevo reporte
        </h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="w-4 h-4"
            />
            Quiero que mi reporte sea anónimo para mis compañeros.
          </label>

          <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Lugar donde ocurrió (ej. patio, sala, comedor)"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm min-h-[70px]"
            placeholder="Describe qué pasó"
          />

          <textarea
            value={expectation}
            onChange={(e) => setExpectation(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm min-h-[70px]"
            placeholder="¿Qué esperas que pase después de este reporte?"
          />

          <button
            disabled={sending}
            className="w-full bg-purple-600 text-white text-sm font-semibold py-2 rounded-lg"
          >
            {sending ? "Enviando..." : "Enviar reporte"}
          </button>
        </form>

        <p className="text-[11px] text-gray-500 mt-2">
          Amis te recuerda: pedir ayuda es una forma de cuidar tu bienestar y el
          de tus compañeros 💜
        </p>
      </section>

      {/* Historial */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-800">
          Historial de mis reportes
        </h2>

        {reports.length === 0 && (
          <p className="text-xs text-gray-500">
            Aún no has enviado reportes.
          </p>
        )}

        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-col gap-1"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {new Date(r.created_at).toLocaleString()}
              </span>
              <span
                className={
                  "text-[11px] font-semibold px-2 py-1 rounded-full " +
                  statusColor(r.status)
                }
              >
                {r.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-700 whitespace-pre-line">
              {r.description}
            </p>
          </div>
        ))}
      </section>

      <StudentBottomNav active="reports" />
    </div>
  );
}
