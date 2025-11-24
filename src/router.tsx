import { createBrowserRouter } from "react-router-dom";
import UserSelect from "./pages/UserSelect";
import TeacherRegister from "./pages/TeacherRegister";

const router = createBrowserRouter([
  { path: "/", element: <UserSelect /> },
  { path: "/register/teacher", element: <TeacherRegister /> },
  { path: "/register/student", element: <div>Registro Estudiante</div> },
  { path: "/register/tutor", element: <div>Registro Tutor</div> },
]);

export default router;
