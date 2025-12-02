// Ejemplo de rutas para integrar las pantallas del profesor.
// NO reemplaza tu router actual directamente; copia solo las <Route> que necesites.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import TeacherHome from "./pages/TeacherHome";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherEmotions from "./pages/TeacherEmotions";
import TeacherRewards from "./pages/TeacherRewards";
import TeacherReports from "./pages/TeacherReports";

export default function TeacherRouterExample() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/teacher/home" element={<TeacherHome />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        <Route path="/teacher/emotions" element={<TeacherEmotions />} />
        <Route path="/teacher/rewards" element={<TeacherRewards />} />
        <Route path="/teacher/reports" element={<TeacherReports />} />
      </Routes>
    </BrowserRouter>
  );
}
