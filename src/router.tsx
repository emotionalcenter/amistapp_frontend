import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Páginas públicas */
import UserSelect from "./pages/UserSelect";
import TeacherLogin from "./pages/TeacherLoginPage";
import TeacherRegister from "./pages/TeacherRegisterPage";
import TeacherSuccess from "./pages/TeacherSuccess";

/* Páginas del panel docente */
import TeacherHome from "./pages/TeacherHome";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherEmotions from "./pages/TeacherEmotions";
import TeacherRewards from "./pages/TeacherRewards";
import TeacherReports from "./pages/TeacherReports";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Pantalla inicial */}
        <Route path="/" element={<UserSelect />} />

        {/* Autenticación */}
        <Route path="/login" element={<TeacherLogin />} />
        <Route path="/register/teacher" element={<TeacherRegister />} />
        <Route path="/teacher/success" element={<TeacherSuccess />} />

        {/* Panel del profesor */}
        <Route path="/teacher/home" element={<TeacherHome />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        <Route path="/teacher/emotions" element={<TeacherEmotions />} />
        <Route path="/teacher/rewards" element={<TeacherRewards />} />
        <Route path="/teacher/reports" element={<TeacherReports />} />

      </Routes>
    </BrowserRouter>
  );
}
