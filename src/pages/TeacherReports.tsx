import BottomNav from "../components/BottomNav";

interface Report {
  id: number;
  student: string;
  summary: string;
  status: "visto" | "pendiente" | "rechazado";
}

const mockReports: Report[] = [
  { id: 1, student: "Ana", summary: "Conflicto en el recreo", status: "visto" },
  { id: 2, student: "Luis", summary: "Dificultades para participar en clase", status: "pendiente" },
  { id: 3, student: "Martina", summary: "Uso de lenguaje inapropiado", status: "rechazado" },
];

function getStatusStyles(status: Report["status"]) {
  if (status === "visto") return "bg-green-100 text-green-700";
  if (status === "pendiente") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function TeacherReports() {
  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
        <p className="text-sm text-gray-600">
          Revisa el estado de los reportes de tus estudiantes
        </p>
      </header>

      <section className="space-y-3">
        {mockReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {report.student}
                </p>
                <p className="text-xs text-gray-500">{report.summary}</p>
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
      </section>

      <BottomNav active="reports" />
    </div>
  );
}
