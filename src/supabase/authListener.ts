import { supabase } from "./client";

export const initAuthListener = (setUser: any) => {
  // 1. Recuperar sesión actual al iniciar la app
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error("Error al recuperar sesión:", error);
      return;
    }

    setUser(data?.session?.user || null);
  });

  // 2. Escuchar cualquier cambio de sesión (login, logout, refresh)
  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setUser(session?.user || null);
    }
  );

  // 3. Importante: devolver cleanup para React
  return () => {
    listener.subscription.unsubscribe();
  };
};
