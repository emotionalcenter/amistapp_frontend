import { Home, User, Award } from "lucide-react";
import { Link } from "react-router-dom";

interface BottomNavProps {
  active?: string;
}

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md flex justify-around py-3 z-50">
      
      <Link to="/teacher/home" className="flex flex-col items-center">
        <Home className={active === "home" ? "text-purple-600" : "text-gray-500"} size={24} />
      </Link>

      <Link to="/teacher/profile" className="flex flex-col items-center">
        <User className={active === "profile" ? "text-purple-600" : "text-gray-500"} size={24} />
      </Link>

      <Link to="/teacher/rewards" className="flex flex-col items-center">
        <Award className={active === "rewards" ? "text-purple-600" : "text-gray-500"} size={24} />
      </Link>

    </nav>
  );
}
