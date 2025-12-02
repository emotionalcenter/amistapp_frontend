import BottomNav from "../components/BottomNav";

export default function TeacherProfile() {
  const teacher = {
    name: "Profe Jose",
    email: "profe.jose@colegio.cl",
    subject: "Lenguaje y Comunicación",
    course: "6°A",
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
        <p className="text-sm text-gray-600">Información personal del docente</p>
      </header>

      {/* Card de perfil */}
      <section className="bg-white rounded-2xl shadow-md p-4 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl">
          {teacher.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{teacher.name}</p>
          <p className="text-xs text-gray-500">{teacher.email}</p>
          <p className="text-xs text-gray-500 mt-1">
            {teacher.subject} · {teacher.course}
          </p>
        </div>
      </section>

      {/* Acciones */}
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
        <button className="w-full bg-red-500 text-white font-semibold py-3 rounded-xl shadow">
          Cerrar sesión
        </button>
      </div>

      <BottomNav active="profile" />
    </div>
  );
}
