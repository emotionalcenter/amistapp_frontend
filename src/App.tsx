// src/App.tsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import { initAuthListener } from "./supabase/authListener";

export default function App() {
  const [user, setUser] = useState(null);

  // Mantiene la sesión aunque vayas atrás o recargues
  useEffect(() => {
    initAuthListener(setUser);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="pt-20 pb-20">
        {/* Le pasamos el usuario al resto del sistema */}
        <Outlet context={{ user }} />
      </main>

      <BottomNav />
    </div>
  );
}
