// src/components/BottomNav.tsx
import { useLocation, useNavigate } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname;

  const isTeacher = path.startsWith("/teacher");
  const isStudent = path.startsWith("/student");

  if (!isTeacher && !isStudent) return null;

  const menu = isTeacher
    ? [
        { label: "Inicio", route: "/teacher/home" },
        { label: "Emociones", route: "/teacher/emotions" },
        { label: "Premios", route: "/teacher/rewards" },
        { label: "Reportes", route: "/teacher/reports" },
        { label: "Perfil", route: "/teacher/profile" },
      ]
    : [
        { label: "Inicio", route: "/student/home" },
        { label: "Emociones", route: "/student/emotions" },
        { label: "Premios", route: "/student/rewards" },
        { label: "Reportes", route: "/student/reports" },
        { label: "Perfil", route: "/student/profile" },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t py-2 flex justify-around z-50">
      {menu.map((item) => {
        const active = path === item.route;

        return (
          <button
            key={item.route}
            onClick={() => navigate(item.route)}
            className={`flex flex-col items-center text-xs font-semibold ${
              active ? "text-purple-600" : "text-gray-500"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
