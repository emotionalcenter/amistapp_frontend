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
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validación rápida
      if (!form.accept) throw new Error("Debes aceptar los términos y condiciones.");
      if (form.password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres.");
      if (!form.email.includes("@")) throw new Error("Correo electrónico inválido.");

      // NORMALIZAR
      const code = form.teacherCode.trim().toUpperCase();
      const email = form.email.trim().toLowerCase();

      // 1. Validar profesor
      const { data: teacher, error: teacherError } = await supabase
        .from("teachers_v2")
        .select("id, full_name, course")
        .eq("teacher_code", code)
        .single();

      if (teacherError || !teacher) {
        throw new Error("El código del profesor no existe o es incorrecto.");
      }

      // 2. Prevenir estudiantes duplicados
      const { data: existing } = await supabase
        .from("students")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existing) {
        throw new Error("Ya existe una cuenta asociada a este correo.");
      }

      // 3. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: form.password,
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || "No se pudo crear el usuario.");
      }

      const userId = authData.user.id;

      // 4. Crear registro del estudiante
      const { error: insertError } = await supabase.from("students").insert({
        user_id: userId,
        name: form.name.trim(),
        email,
        school_name: form.schoolName.trim(),
        teacher_id: teacher.id,
        points: 0,
      });

      if (insertError) throw insertError;

      setSuccess("Cuenta creada con éxito 🎉 Redirigiendo...");
      setTimeout(() => navigate("/student/home"), 1200);

    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">

        {/* ENCABEZADO */}
        <div className="flex flex-col items-center">
          <img src={mascot} className="w-20 h-20 mb-2" />
          <h1 className="text-2xl font-bold text-purple-700 text-center">
            Registro de Estudiante
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Únete a la clase ingresando el código único de tu profesor(a).
          </p>
        </div>

        {/* ERRORES */}
        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* ÉXITO */}
        {success && (
          <p className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            {success}
          </p>
        )}

        {/* FORMULARIO */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            name="teacherCode"
            placeholder="Código del profesor (ej: PROFE-123ABC)"
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
              </span>.
            </span>
          </label>

          <button
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 rounded-lg mt-2 transition"
          >
            {loading ? "Registrando..." : "Crear mi cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
