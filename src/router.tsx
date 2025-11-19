<<<<<<< HEAD
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
=======
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

const router = createBrowserRouter([
  {
    path:"/",
    element:<App />,
    children:[
      { index:true, element:<Home /> },
      { path:"login", element:<Auth /> }
    ]
  }
]);

export default router;
>>>>>>> 7edc912eb716b41f89e346c5f1285fd1cb1682c5
