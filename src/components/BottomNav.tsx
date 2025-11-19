import React from "react";
import { NavLink } from "react-router-dom";

type TabKey = "inicio" | "perfil" | "emociones" | "premios" | "reportar";

interface BottomNavProps {
  active: TabKey;
}

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "inicio", label: "Inicio", icon: "home" },
  { key: "perfil", label: "Perfil", icon: "user" },
  { key: "emociones", label: "Emociones", icon: "heart" },
  { key: "premios", label: "Premios", icon: "trophy" },
  { key: "reportar", label: "Reportar", icon: "flag" }
];

const BottomNav: React.FC<BottomNavProps> = ({ active }) => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`flex flex-col items-center text-xs ${
              active === tab.key ? "text-purple-600" : "text-slate-400"
            }`}
          >
            <span
              className={`mb-1 inline-flex h-7 w-7 items-center justify-center rounded-full ${
                active === tab.key ? "bg-purple-100" : ""
              }`}
            >
              {/* íconos simples usando emojis para evitar dependencias extras */}
              {tab.icon === "home" && "🏠"}
              {tab.icon === "user" && "👤"}
              {tab.icon === "heart" && "💜"}
              {tab.icon === "trophy" && "🏆"}
              {tab.icon === "flag" && "🚩"}
            </span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
