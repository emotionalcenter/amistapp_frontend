<<<<<<< HEAD
import React from "react";
import AppRouter from "./router";

const App: React.FC = () => {
  return <AppRouter />;
};

export default App;
=======
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
>>>>>>> 7edc912eb716b41f89e346c5f1285fd1cb1682c5
