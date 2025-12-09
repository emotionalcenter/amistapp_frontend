// src/components/BottomNav.tsx
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Heart,
  Trophy,
  BarChart3,
} from "lucide-react"; // Asegúrate de tener lucide-react instalado

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isTeacher = path.startsWith("/teacher");
  const isStudent = path.startsWith("/student");

  if (!isTeacher && !isStudent) return null;

  const menu = isTeacher
    ? [
        { label: "Inicio", route: "/teacher/home", icon: <Home size={22} /> },
        { label: "Perfil", route: "/teacher/profile", icon: <User size={22} /> },
        { label: "Emociones", route: "/teacher/emotions", icon: <Heart size={30} />, center: true },
        { label: "Premios", route: "/teacher/rewards", icon: <Trophy size={22} /> },
        { label: "Reportes", route: "/teacher/reports", icon: <BarChart3 size={22} /> },
      ]
    : [
        { label: "Inicio", route: "/student/home", icon: <Home size={22} /> },
        { label: "Perfil", route: "/student/profile", icon: <User size={22} /> },
        { label: "Emociones", route: "/student/emotions", icon: <Heart size={30} />, center: true },
        { label: "Premios", route: "/student/rewards", icon: <Trophy size={22} /> },
        { label: "Reportes", route: "/student/reports", icon: <BarChart3 size={22} /> },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl z-50">
      <div className="flex justify-around py-2">
        {menu.map((item) => {
          const active = path === item.route;

          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`flex flex-col items-center ${
                item.center ? "mt-[-12px]" : ""
              }`}
            >
              <div
                className={`${
                  active
                    ? "text-purple-600"
                    : "text-gray-500"
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  active ? "text-purple-600" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
