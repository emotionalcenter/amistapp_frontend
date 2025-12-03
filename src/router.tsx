// src/router.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserSelect from "./pages/UserSelect";

// AUTH PROFESOR
import TeacherLogin from "./pages/TeacherLoginPage";
import TeacherRegister from "./pages/TeacherRegisterPage";
import TeacherSuccess from "./pages/TeacherSuccess";

// AUTH ESTUDIANTE (a futuro)
import StudentRegister from "./pages/StudentRegister";
import StudentLogin from "./pages/StudentLogin";

// PROTECCIÓN
import ProtectedRoute from "./components/ProtectedRoute";

// PROFESOR
import TeacherHome from "./pages/TeacherHome";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherEmotions from "./pages/TeacherEmotions";
import TeacherRewards from "./pages/TeacherRewards";
import TeacherReports from "./pages/TeacherReports";
import TeacherStudents from "./pages/TeacherStudents";

import GivePointsStudents from "./pages/GivePointsStudents";
import GivePointsActions from "./pages/GivePointsActions";

// ESTUDIANTE
import StudentHome from "./pages/StudentHome";
import StudentProfile from "./pages/StudentProfile";
import StudentEmotions from "./pages/StudentEmotions";
import StudentRewards from "./pages/StudentRewards";
import StudentReports from "./pages/StudentReports";
import StudentGivePoints from "./pages/StudentGivePoints";
import StudentRewardHistory from "./pages/StudentRewardHistory";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 RUTAS PÚBLICAS */}
        <Route path="/" element={<UserSelect />} />

        {/* LOGIN PROFESOR */}
        <Route path="/login" element={<TeacherLogin />} />
        <Route path="/register/teacher" element={<TeacherRegister />} />
        <Route path="/teacher/success" element={<TeacherSuccess />} />

        {/* LOGIN ESTUDIANTE */}
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/student/login" element={<StudentLogin />} />

        {/* 🔒 PROFESOR (solo logueado) */}
        <Route
          path="/teacher/home"
          element={
            <ProtectedRoute>
              <TeacherHome />
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
        <Route
          path="/teacher/students"
          element={
            <ProtectedRoute>
              <TeacherStudents />
            </ProtectedRoute>
          }
        />

        {/* DAR PUNTAJE PROFESOR */}
        <Route
          path="/teacher/give-points/actions"
          element={
            <ProtectedRoute>
              <GivePointsActions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/give-points/students"
          element={
            <ProtectedRoute>
              <GivePointsStudents />
            </ProtectedRoute>
          }
        />

        {/* 🔒 ESTUDIANTE */}
        <Route
          path="/student/home"
          element={
            <ProtectedRoute>
              <StudentHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/emotions"
          element={
            <ProtectedRoute>
              <StudentEmotions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/rewards"
          element={
            <ProtectedRoute>
              <StudentRewards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/rewards/history"
          element={
            <ProtectedRoute>
              <StudentRewardHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/reports"
          element={
            <ProtectedRoute>
              <StudentReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/give-points"
          element={
            <ProtectedRoute>
              <StudentGivePoints />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
