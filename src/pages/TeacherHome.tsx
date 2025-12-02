import BottomNav from "../components/BottomNav";

export default function TeacherHome() {
  // Datos mock por ahora (luego se conectan a Supabase)
  const teacherName = "Profe Jose";
  const subscription = {
    type: "Premium",
    expires: "2025-03-20",
    points: 120,
  };

  const metrics = {
    students: 24,
    activeToday: 68,
    courses: 2,
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
      {/* Encabezado */}
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel Docente</h1>
          <p className="text-sm text-gray-600">Bienvenido, {teacherName} 👋</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-sm">
          PJ
        </div>
      </header>

      {/* Selector de curso */}
      <div className="flex justify-end mb-4">
        <select className="border rounded-lg px-3 py-2 text-xs text-purple-700 font-semibold shadow-sm">
          <option>Todos los cursos</option>
          <option>6°A</option>
          <option>7°B</option>
        </select>
      </div>

      {/* Suscripción */}
      <section className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-2xl p-4 shadow-md mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-80">
              Suscripción anual {subscription.type}
            </p>
            <p className="text-xs mt-1">Expira: {subscription.expires}</p>
          </div>
          <span className="text-3xl">👑</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs opacity-80">Puntos disponibles</p>
            <p className="text-2xl font-bold">{subscription.points}</p>
          </div>
          <button className="bg-white text-purple-700 text-xs font-semibold px-4 py-2 rounded-xl shadow">
            Renovar
          </button>
        </div>
      </section>

      {/* Estadísticas */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Estadísticas y métricas
          </h2>
          <select className="border rounded-lg px-2 py-1 text-[11px] text-gray-600">
            <option>Este mes</option>
            <option>Esta semana</option>
            <option>Hoy</option>
          </select>
        </div>

        {/* Card Estudiantes */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">👥</span>
            <h3 className="text-sm font-semibold text-gray-800">Estudiantes</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.students}</p>
          <p className="text-xs text-green-600 font-semibold mt-1">
            {metrics.activeToday}% activos hoy
          </p>
        </div>

        {/* Card Cursos */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🏫</span>
            <h3 className="text-sm font-semibold text-gray-800">Cursos</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.courses}</p>
          <button className="text-xs text-blue-600 font-semibold mt-2">
            Ver detalles
          </button>
        </div>
      </section>

      <BottomNav active="home" />
    </div>
  );
}
