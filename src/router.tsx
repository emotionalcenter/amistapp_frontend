import { BrowserRouter, Routes, Route } from "react-router-dom";

// CONTENEDOR PRINCIPAL (maneja sesión + outlet)
import App from "./App";

// PUBLIC PAGES
import UserSelect from "./pages/UserSelect";
import TeacherLogin from "./pages/TeacherLoginPage";
import TeacherRegister from "./pages/TeacherRegisterPage";
import TeacherSuccess from "./pages/TeacherSuccess";

import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";

// GOOGLE / AUTH CALLBACK
import AuthChoice from "./pages/AuthChoice";

// PROTECTED ROUTE
import ProtectedRoute from "./components/ProtectedRoute";

// TEACHER PAGES
import TeacherHome from "./pages/TeacherHome";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherEmotions from "./pages/TeacherEmotions";
import TeacherRewards from "./pages/TeacherRewards";
import TeacherReports from "./pages/TeacherReports";
import TeacherStudents from "./pages/TeacherStudents";

// TEACHER GIVE POINTS FLOW
import GivePointsActions from "./pages/GivePointsActions";
import GivePointsStudents from "./pages/GivePointsStudents";

// STUDENT PAGES
import StudentHome from "./pages/StudentHome";
import StudentProfile from "./pages/StudentProfile";
import StudentEmotions from "./pages/StudentEmotions";
import StudentRewards from "./pages/StudentRewards";
import StudentReports from "./pages/StudentReports";

// STUDENT GIVE POINTS FLOW
import StudentGivePoints from "./pages/StudentGivePoints";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ----------------------- */}
        {/*        PUBLIC ROUTES    */}
        {/* ----------------------- */}
        <Route path="/" element={<UserSelect />} />
        <Route path="/login" element={<TeacherLogin />} />
        <Route path="/register/teacher" element={<TeacherRegister />} />
        <Route path="/teacher/success" element={<TeacherSuccess />} />

        {/* LOGIN ESTUDIANTE */}
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />

        {/* CALLBACK PARA GOOGLE AUTH */}
        <Route path="/auth/choice" element={<AuthChoice />} />


        {/* ----------------------- */}
        {/*     PRIVATE ROUTES      */}
        {/*  El App envuelve TODAS   */}
        {/* ----------------------- */}
        <Route element={<App />}>

          {/* ---- TEACHER ---- */}
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

          {/* DAR PUNTOS PROFESOR */}
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


          {/* ---- STUDENT ---- */}
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

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
