// src/App.tsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import { initAuthListener } from "./supabase/authListener";

export default function App() {
  // EL CAMBIO IMPORTANTE ESTÁ AQUÍ
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    initAuthListener(setUser);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="pt-20 pb-20">
        <Outlet context={{ user }} />
      </main>

      <BottomNav />
    </div>
  );
}
