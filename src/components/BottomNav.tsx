import { NavLink } from "react-router-dom";
import {
  Home,
  User,
  Heart,
  Gift,
  Flag,
} from "lucide-react";

interface Props {
  active: string;
  userType: "teacher" | "student";
}

export default function BottomNav({ active, userType }: Props) {
  const base = userType === "teacher" ? "/teacher" : "/student";

  const items = [
    { id: "home", label: "Inicio", icon: <Home size={22} />, to: `${base}/home` },
    { id: "profile", label: "Perfil", icon: <User size={22} />, to: `${base}/profile` },
    { id: "emotions", label: "Emociones", icon: <Heart size={24} />, to: `${base}/emotions`, center: true },
    { id: "rewards", label: "Premios", icon: <Gift size={22} />, to: `${base}/rewards` },
    { id: "reports", label: "Reportes", icon: <Flag size={22} />, to: `${base}/reports` },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.08)] border-t z-50 py-2">
      <div className="flex justify-around items-center">

        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className="flex flex-col items-center text-xs font-medium"
          >
            <div
              className={`
                flex items-center justify-center mb-1
                ${item.center ? "bg-purple-600 text-white p-3 rounded-full shadow-md" : ""}
                ${active === item.id && !item.center ? "text-purple-600" : "text-gray-500"}
              `}
            >
              {item.icon}
            </div>
            <span className={`${active === item.id ? "text-purple-600" : "text-gray-500"}`}>
              {item.label}
            </span>
          </NavLink>
        ))}

      </div>
    </nav>
  );
}
