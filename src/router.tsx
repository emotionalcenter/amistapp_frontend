import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserSelect from "./pages/UserSelect";
import TeacherLogin from "./pages/TeacherLoginPage";
import TeacherRegister from "./pages/TeacherRegisterPage";
import TeacherSuccess from "./pages/TeacherSuccess";

import ProtectedRoute from "./components/ProtectedRoute";

import TeacherHome from "./pages/TeacherHome";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherEmotions from "./pages/TeacherEmotions";
import TeacherRewards from "./pages/TeacherRewards";
import TeacherReports from "./pages/TeacherReports";

import GivePointsStudents from "./pages/GivePointsStudents";
import GivePointsActions from "./pages/GivePointsActions";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<UserSelect />} />
        <Route path="/login" element={<TeacherLogin />} />
        <Route path="/register/teacher" element={<TeacherRegister />} />
        <Route path="/teacher/success" element={<TeacherSuccess />} />

        {/* PRIVATE ROUTES */}
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

        {/* GIVE POINTS FLOW */}
        <Route
          path="/teacher/give-points/students"
          element={
            <ProtectedRoute>
              <GivePointsStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/give-points/actions"
          element={
            <ProtectedRoute>
              <GivePointsActions />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
