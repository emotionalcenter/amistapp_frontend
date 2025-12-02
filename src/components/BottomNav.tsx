import { Home, User, Heart, Award, Flag } from "lucide-react";
import { Link } from "react-router-dom";

interface BottomNavProps {
  active?: string;
}

export default function BottomNav({ active }: BottomNavProps) {
  const baseStyle = "flex flex-col items-center text-xs";
  const inactive = "text-gray-500";
  const activeStyle = "text-purple-600 font-semibold";

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg flex justify-around py-2 z-50 border-t border-gray-200">
      {/* INICIO */}
      <Link to="/teacher/home" className={baseStyle}>
        <Home size={24} className={active === "home" ? activeStyle : inactive} />
        <span className={active === "home" ? activeStyle : inactive}>Inicio</span>
      </Link>

      {/* PERFIL */}
      <Link to="/teacher/profile" className={baseStyle}>
        <User size={24} className={active === "profile" ? activeStyle : inactive} />
        <span className={active === "profile" ? activeStyle : inactive}>Perfil</span>
      </Link>

      {/* EMOCIONES */}
      <Link to="/teacher/emotions" className={baseStyle}>
        <Heart size={24} className={active === "emotions" ? activeStyle : inactive} />
        <span className={active === "emotions" ? activeStyle : inactive}>Emociones</span>
      </Link>

      {/* PREMIOS */}
      <Link to="/teacher/rewards" className={baseStyle}>
        <Award size={24} className={active === "rewards" ? activeStyle : inactive} />
        <span className={active === "rewards" ? activeStyle : inactive}>Premios</span>
      </Link>

      {/* REPORTES */}
      <Link to="/teacher/reports" className={baseStyle}>
        <Flag size={24} className={active === "reports" ? activeStyle : inactive} />
        <span className={active === "reports" ? activeStyle : inactive}>Reportes</span>
      </Link>
    </nav>
  );
}
