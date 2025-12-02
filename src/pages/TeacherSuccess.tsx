import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import mascot from "../assets/mascot.png";

export default function TeacherSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // Recibir el código desde TeacherRegister
  const teacherCode = location.state?.teacherCode;

  // Si alguien entra sin código → volver a inicio
  if (!teacherCode) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 p-6 text-white">
      
      {/* MASCOTA */}
      <motion.img
        src={mascot}
        alt="Mascota AmistApp"
        className="w-32 h-32 rounded-full shadow-xl border-4 border-white mb-6"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
      />

      {/* TARJETA DEL CÓDIGO */}
      <motion.div
        className="bg-white text-gray-800 w-full max-w-md p-6 rounded-2xl shadow-xl text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-purple-700">
          ¡Registro exitoso! 🎉
        </h2>

        <p className="mt-2">Tu código docente es:</p>

        <div className="mt-4 bg-purple-100 border border-purple-300 p-4 rounded-xl">
          <p className="text-3xl font-extrabold text-purple-700">
            {teacherCode}
          </p>
        </div>

        <button
          onClick={() => navigator.clipboard.writeText(teacherCode)}
          className="w-full bg-purple-600 text-white py-3 mt-6 rounded-xl font-semibold hover:bg-purple-700 transition"
        >
          Copiar Código
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-gray-600 text-white py-3 mt-3 rounded-xl font-semibold hover:bg-gray-700 transition"
        >
          Iniciar Sesión
        </button>
      </motion.div>
    </div>
  );
}
