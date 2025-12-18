import { useNavigate } from "react-router-dom";
import mascot from "../assets/mascot.png";

export default function StudentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col items-center justify-center p-6 text-center">
      <img src={mascot} className="w-28 h-28 mb-4" />
      <h1 className="text-3xl font-bold text-purple-700 mb-2">¡Registro exitoso!</h1>
      <p className="text-gray-700 mb-6">
        Tu cuenta y tu perfil de estudiante se crearon correctamente.
      </p>

      <button
        onClick={() => navigate("/student/home")}
        className="bg-purple-600 text-white px-8 py-3 rounded-xl text-lg font-semibold"
      >
        Ir a mi panel
      </button>
    </div>
  );
}
