import BottomNav from "../components/BottomNav";

interface StudentEmotion {
  id: number;
  name: string;
  streak: number;
  completedToday: boolean;
}

const mockStudents: StudentEmotion[] = [
  { id: 1, name: "Ana", streak: 5, completedToday: true },
  { id: 2, name: "Luis", streak: 2, completedToday: false },
  { id: 3, name: "Martina", streak: 0, completedToday: false },
];

export default function TeacherEmotions() {
  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Emociones</h1>
        <p className="text-sm text-gray-600">
          Rachas y participación emocional de tus estudiantes
        </p>
      </header>

      {/* Resumen */}
      <section className="bg-white rounded-2xl shadow-md p-4 mb-4">
        <p className="text-sm text-gray-700">
          Estudiantes que completaron su emoción hoy:
        </p>
        <p className="text-2xl font-bold text-green-600 mt-1">
          {
            mockStudents.filter((s) => s.completedToday)
              .length
          }{" "}
          / {mockStudents.length}
        </p>
      </section>

      {/* Lista de estudiantes */}
      <section className="space-y-3">
        {mockStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-xl shadow-sm px-4 py-3 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {student.name}
              </p>
              <p className="text-xs text-gray-500">
                Racha: {student.streak} días
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={
                  "text-xs font-semibold px-2 py-1 rounded-full " +
                  (student.completedToday
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700")
                }
              >
                {student.completedToday ? "Completó hoy" : "Pendiente"}
              </span>
              {!student.completedToday && (
                <button className="text-[11px] text-blue-600 font-semibold">
                  Enviar recordatorio
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      <BottomNav active="emotions" />
    </div>
  );
}
