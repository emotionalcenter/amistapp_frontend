import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import mascot from "../assets/mascot.png";

export default function StudentRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    teacherCode: "",
    name: "",
    email: "",
    schoolName: "",
    password: "",
    accept: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!form.accept) {
        throw new Error("Debes aceptar los términos y condiciones.");
      }

      // 1. Buscar profesor por código
      const { data: teacher, error: teacherError } = await supabase
        .from("teachers_v2")
        .select("*")
        .eq("teacher_code", form.teacherCode.trim())
        .single();

      if (teacherError || !teacher) {
        throw new Error("Código de profesor no válido.");
      }

      // 2. Crear usuario auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || "No se pudo crear el usuario.");
      }

      const userId = authData.user.id;

      // 3. Insertar en tabla students
      const { error: insertError } = await supabase.from("students").insert({
        user_id: userId,
        name: form.name,
        email: form.email,
        school_name: form.schoolName,
        teacher_id: teacher.id,
        points: 0,
      });

      if (insertError) {
        throw insertError;
      }

      // 4. Ir a home estudiante
      navigate("/student/home");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex flex-col items-center">
          <img src={mascot} className="w-20 h-20 mb-2" />
          <h1 className="text-2xl font-bold text-purple-700 text-center">
            Registro Estudiante
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Ingresa el código de tu profesor para unirte a su curso en AmistApp.
          </p>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            name="teacherCode"
            placeholder="Código del profesor (ej. PROFE-ABCD12)"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            onChange={handleChange}
            required
          />

          <input
            name="name"
            placeholder="Tu nombre y apellido"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            onChange={handleChange}
            required
          />

          <input
            name="schoolName"
            placeholder="Nombre del colegio"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Tu correo electrónico"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Crea una contraseña"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            onChange={handleChange}
            required
          />

          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              name="accept"
              checked={form.accept}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>
              Acepto las{" "}
              <span className="text-purple-600 underline">
                normas de convivencia y términos de uso
              </span>
              .
            </span>
          </label>

          <button
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 rounded-lg mt-2"
          >
            {loading ? "Registrando..." : "Crear mi cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
