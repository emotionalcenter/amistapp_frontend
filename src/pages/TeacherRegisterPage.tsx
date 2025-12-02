import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function TeacherRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    subject: "",
    course: "",
    email: "",
    phone: "",
    password: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Manejo de entradas
  function handleChange(e: any) {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  // Generar código único de profesor
  function generateTeacherCode() {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PROFE-${random}`;
  }

  // -------------------------
  // 🔹 REGISTRO NORMAL
  // -------------------------
  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validación de términos
    if (!form.terms) {
      setError("Debes aceptar los términos y condiciones.");
      setLoading(false);
      return;
    }

    // Validación de contraseña
    if (form.password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      setLoading(false);
      return;
    }

    const hasLetters = /[A-Za-z]/.test(form.password);
    const hasNumbers = /[0-9]/.test(form.password);

    if (!hasLetters || !hasNumbers) {
      setError("La contraseña debe incluir letras y números.");
      setLoading(false);
      return;
    }

    // 1️⃣ Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const userId = authData.user?.id;
    const teacherCode = generateTeacherCode();

    // 2️⃣ Insertar perfil en teachers_v2
    const { error: insertError } = await supabase.from("teachers_v2").insert({
      id: userId,
      first_name: form.firstName,
      last_name: form.lastName,
      subject: form.subject,
      course: form.course,
      email: form.email,
      phone: form.phone,
      teacher_code: teacherCode,
      accepted_terms: form.terms,
      user_id: userId,
      full_name: `${form.firstName} ${form.lastName}`,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // 3️⃣ Redirigir para mostrar el código
    navigate("/teacher/success", {
      state: { teacherCode },
    });
  }

  // -------------------------
  // 🔹 LOGIN / REGISTRO GOOGLE
  // -------------------------
  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/teacher/success",
      },
    });

    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-600 to-blue-500 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700">
          Registro Docente
        </h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          type="text"
          name="firstName"
          placeholder="Nombre"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Apellido"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          name="subject"
          placeholder="Asignatura que imparte"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          name="course"
          placeholder="Curso (ej. 6°A, 3°B)"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        {/* Checkbox */}
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            name="terms"
            checked={form.terms}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span>
            Acepto los{" "}
            <a href="/terminos" className="text-blue-500 underline">
              Términos y Condiciones
            </a>
          </span>
        </label>

        <button
          disabled={loading}
          className="bg-purple-600 text-white w-full p-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          {loading ? "Registrando..." : "Registrarme"}
        </button>

        <button
          type="button"
          onClick={handleGoogle}
          className="bg-red-500 text-white w-full p-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Registrarme con Google
        </button>
      </form>
    </div>
  );
}
