import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
