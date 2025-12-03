import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";
import mascot from "../assets/mascot.png"; // Asegúrate de que existe la imagen

export default function TeacherHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 pb-24">
      
      {/* HEADER */}
      <header className="p-6 text-white">
        <h1 className="text-3xl font-bold">¡Bienvenido, Profe! 👋</h1>
      </header>

      <main className="p-5 space-y-6">

        {/* 🔵 TARJETA DE INFORMACIÓN */}
        <section className="bg-white shadow-xl p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-purple-600">Tu información</h2>
          <p><strong>Asignatura:</strong> Educación Socioemocional</p>
          <p><strong>Curso:</strong> Primero Medio</p>

          <div className="mt-4">
            <strong>Código Profesor:</strong>
            <p className="text-purple-700 text-2xl font-extrabold">PROFE-XXXXXXX</p>

            <button
              className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
              onClick={() => navigator.clipboard.writeText("PROFE-XXXXXXX")}
            >
              Copiar código
            </button>
          </div>

          <div className="mt-4">
            <strong>Puntos disponibles:</strong>
            <p className="text-green-600 text-3xl font-extrabold">1000</p>
          </div>
        </section>

        {/* 🟣 MASCOTA MOTIVACIONAL */}
        <section className="flex flex-col items-center">
          <img
            src={mascot}
            alt="Mascota AmistApp"
            className="w-40 h-40 animate-bounce"
          />
          <p className="text-center text-white text-lg mt-3 font-semibold px-6">
            ¡Recuerda entregar puntos positivos hoy!  
            Cada reconocimiento mejora la convivencia educativa  
            y motiva a tus estudiantes a desarrollar habilidades socioemocionales. 💜
          </p>
        </section>

        {/* 🎁 BOTÓN DAR PUNTAJE */}
        <button
          onClick={() => navigate("/teacher/give-points/students")}
          className="w-full bg-purple-700 text-white py-4 rounded-xl text-xl font-bold shadow-lg hover:bg-purple-800 transition"
        >
          🎁 Dar Puntaje
        </button>

        {/* 🟡 ATAJOS */}
        <section className="grid grid-cols-2 gap-4">

          <div className="p-4 bg-purple-100 rounded-xl text-center shadow-md">
            <p className="text-purple-600 font-bold">Mis Estudiantes</p>
          </div>

          <div className="p-4 bg-blue-100 rounded-xl text-center shadow-md">
            <p className="text-blue-600 font-bold">Puntajes</p>
          </div>

          <div className="p-4 bg-green-100 rounded-xl text-center shadow-md">
            <p className="text-green-600 font-bold">Emociones</p>
          </div>

          <div className="p-4 bg-yellow-100 rounded-xl text-center shadow-md">
            <p className="text-yellow-600 font-bold">Reportes</p>
          </div>

        </section>
      </main>

      {/* 🔻 Navegación inferior */}
      <BottomNav />
    </div>
  );
}
