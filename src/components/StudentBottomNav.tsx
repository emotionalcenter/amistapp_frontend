import { useNavigate } from "react-router-dom";

interface Props {
  active?: "home" | "profile" | "emotions" | "rewards" | "reports";
}

export default function StudentBottomNav({ active }: Props) {
  const navigate = useNavigate();

  const base =
    "flex flex-col items-center justify-center flex-1 py-2 text-xs";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex">
      <button
        className={
          base +
          (active === "home"
            ? " text-purple-600 font-semibold"
            : " text-gray-500")
        }
        onClick={() => navigate("/student/home")}
      >
        <span className="text-lg">🏠</span>
        <span>Inicio</span>
      </button>

      <button
        className={
          base +
          (active === "profile"
            ? " text-purple-600 font-semibold"
            : " text-gray-500")
        }
        onClick={() => navigate("/student/profile")}
      >
        <span className="text-lg">👤</span>
        <span>Perfil</span>
      </button>

      <button
        className={
          base +
          (active === "emotions"
            ? " text-purple-600 font-semibold"
            : " text-gray-500")
        }
        onClick={() => navigate("/student/emotions")}
      >
        <span className="text-lg">💜</span>
        <span>Emociones</span>
      </button>

      <button
        className={
          base +
          (active === "rewards"
            ? " text-purple-600 font-semibold"
            : " text-gray-500")
        }
        onClick={() => navigate("/student/rewards")}
      >
        <span className="text-lg">🎁</span>
        <span>Premios</span>
      </button>

      <button
        className={
          base +
          (active === "reports"
            ? " text-purple-600 font-semibold"
            : " text-gray-500")
        }
        onClick={() => navigate("/student/reports")}
      >
        <span className="text-lg">🚩</span>
        <span>Reportes</span>
      </button>
    </nav>
  );
}
