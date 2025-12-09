// src/components/ProtectedRoute.tsx
import { Navigate, useOutletContext } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  // Recuperamos el user que App.tsx proporciona
  const { user } = useOutletContext<any>();

  // Mientras espera a que authListener recupere sesión
  if (user === undefined) {
    return <p>Cargando sesión...</p>;
  }

  // Si NO hay usuario -> redirige
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si hay usuario -> permite el acceso
  return children;
}
