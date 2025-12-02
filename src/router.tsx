import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Páginas públicas */
import UserSelect from "./pages/UserSelect";
import TeacherLogin from "./pages/TeacherLoginPage";
import TeacherRegister from "./pages/TeacherRegisterPage";
import TeacherSuccess from "./pages/TeacherSuccess";

/* Nuevo ProtectRoute */
import ProtectedRoute from "./components/ProtectedRoute";

/* Panel del profesor */
import TeacherDashboard from "./pages/TeacherDashboard";  // 🔥 Nuevo Dashboard REAL
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

        {/* Panel del profesor — TODAS protegidas */}
        <Route
          path="/teacher/home"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute>
              <TeacherProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/emotions"
          element={
            <ProtectedRoute>
              <TeacherEmotions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/rewards"
          element={
            <ProtectedRoute>
              <TeacherRewards />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/reports"
          element={
            <ProtectedRoute>
              <TeacherReports />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
