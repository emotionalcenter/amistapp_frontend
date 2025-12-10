import { BrowserRouter, Routes, Route } from "react-router-dom";

// CONTENEDOR PRINCIPAL
import App from "./App";

// PUBLIC PAGES
import UserSelect from "./pages/UserSelect";
import TeacherLogin from "./pages/TeacherLoginPage";
import TeacherRegister from "./pages/TeacherRegisterPage";
import TeacherSuccess from "./pages/TeacherSuccess";

// STUDENT LOGIN + REGISTER
import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";

// GOOGLE CALLBACK
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

// STUDENT PAGES
import StudentHome from "./pages/StudentHome";
import StudentProfile from "./pages/StudentProfile";
import StudentEmotions from "./pages/StudentEmotions";
import StudentRewards from "./pages/StudentRewards";
import StudentReports from "./pages/StudentReports";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<UserSelect />} />
        <Route path="/login" element={<TeacherLogin />} />
        <Route path="/register/teacher" element={<TeacherRegister />} />
        <Route path="/teacher/success" element={<TeacherSuccess />} />

        {/* LOGIN ESTUDIANTE */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />

        {/* GOOGLE AUTH */}
        <Route path="/auth/choice" element={<AuthChoice />} />

        {/* PRIVATE ROUTES */}
        <Route element={<App />}>

          {/* TEACHER PAGES */}
          <Route path="/teacher/home" element={<ProtectedRoute><TeacherHome /></ProtectedRoute>} />
          <Route path="/teacher/profile" element={<ProtectedRoute><TeacherProfile /></ProtectedRoute>} />
          <Route path="/teacher/emotions" element={<ProtectedRoute><TeacherEmotions /></ProtectedRoute>} />
          <Route path="/teacher/rewards" element={<ProtectedRoute><TeacherRewards /></ProtectedRoute>} />
          <Route path="/teacher/reports" element={<ProtectedRoute><TeacherReports /></ProtectedRoute>} />
          <Route path="/teacher/students" element={<ProtectedRoute><TeacherStudents /></ProtectedRoute>} />

          {/* STUDENT PAGES */}
          <Route path="/student/home" element={<ProtectedRoute><StudentHome /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
          <Route path="/student/emotions" element={<ProtectedRoute><StudentEmotions /></ProtectedRoute>} />
          <Route path="/student/rewards" element={<ProtectedRoute><StudentRewards /></ProtectedRoute>} />
          <Route path="/student/reports" element={<ProtectedRoute><StudentReports /></ProtectedRoute>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
