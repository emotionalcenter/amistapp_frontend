import { Link } from "react-router-dom";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t flex justify-around p-3 z-50">
      <Link to="/teacher/home" className="text-purple-600 font-bold">Inicio</Link>
      <Link to="/teacher/emotions" className="text-purple-600 font-bold">Emociones</Link>
      <Link to="/teacher/rewards" className="text-purple-600 font-bold">Premios</Link>
      <Link to="/teacher/reports" className="text-purple-600 font-bold">Reportes</Link>
      <Link to="/teacher/profile" className="text-purple-600 font-bold">Perfil</Link>
    </nav>
  );
}
