import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudentHome from "./pages/StudentHome";
import TeacherHome from "./pages/TeacherHome";
import TutorHome from "./pages/TutorHome";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/estudiante" element={<StudentHome />} />
      <Route path="/docente" element={<TeacherHome />} />
      <Route path="/tutor" element={<TutorHome />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRouter;
