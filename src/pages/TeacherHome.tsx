import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

export default function TeacherHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* Header */}
      <header className="bg-purple-600 text-white p-6 shadow-lg rounded-b-3xl">
        <h1 className="text-3xl font-extrabold">👩‍🏫 Panel Docente</h1>
        <p className="text-sm opacity-90 mt-1">Bienvenido a tu espacio educativo AmistApp</p>
      </header>

      {/* Contenido */}
      <main className="p-6 space-y-8">

        {/* Sección de Información */}
        <section className="bg-white shadow-md p-6 rounded-2xl border border-purple-100">
          <h2 className="text-xl font-bold text-purple-600 mb-4">Tu información</h2>

          <p className="mb-1"><strong>Asignatura:</strong> Educación Socioemocional</p>
          <p className="mb-1"><strong>Curso:</strong> Primero Medio</p>

          <div className="mt-4">
            <strong>Código Profesor:</strong>
            <p className="text-purple-700 text-2xl font-extrabold">PROFE-XXXXXX</p>

            <button
              className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              onClick={() => navigator.clipboard.writeText("PROFE-XXXXXX")}
            >
              Copiar código
            </button>
          </div>

          <div className="mt-4">
            <strong>Puntos disponibles:</strong>
            <p className="text-green-600 text-3xl font-extrabold">1000</p>
          </div>
        </section>

        {/* BOTÓN DAR PUNTAJE */}
        <button
          onClick={() => navigate("/teacher/give-points/students")}
          className="w-full bg-purple-600 text-white py-4 rounded-2xl text-xl font-bold shadow-lg hover:bg-purple-700 transition"
        >
          🎁 Dar Puntaje
        </button>

        {/* Atajos */}
        <section className="grid grid-cols-2 gap-4">

          {/* Estudiantes */}
          <div
            className="p-5 bg-purple-100 rounded-2xl text-center shadow-md cursor-pointer hover:bg-purple-200 transition"
            onClick={() => navigate("/teacher/profile")}
          >
            <p className="text-purple-700 font-bold">Mis Estudiantes</p>
          </div>

          {/* Puntajes */}
          <div
            className="p-5 bg-blue-100 rounded-2xl text-center shadow-md cursor-pointer hover:bg-blue-200 transition"
            onClick={() => navigate("/teacher/rewards")}
          >
            <p className="text-blue-700 font-bold">Puntajes</p>
          </div>

          {/* Emociones */}
          <div
            className="p-5 bg-green-100 rounded-2xl text-center shadow-md cursor-pointer hover:bg-green-200 transition"
            onClick={() => navigate("/teacher/emotions")}
          >
            <p className="text-green-700 font-bold">Emociones</p>
          </div>

          {/* Reportes */}
          <div
            className="p-5 bg-yellow-100 rounded-2xl text-center shadow-md cursor-pointer hover:bg-yellow-200 transition"
            onClick={() => navigate("/teacher/reports")}
          >
            <p className="text-yellow-700 font-bold">Reportes</p>
          </div>

        </section>

      </main>

      {/* Navegación inferior */}
      <BottomNav />
    </div>
  );
}
