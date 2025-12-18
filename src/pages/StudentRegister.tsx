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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      /* VALIDACIONES */
      if (!form.accept) throw new Error("Debes aceptar los términos.");
      if (form.password.length < 6)
        throw new Error("La contraseña debe tener al menos 6 caracteres.");

      const teacherCode = form.teacherCode.trim().toUpperCase();
      const email = form.email.trim().toLowerCase();

      /* 1️⃣ VALIDAR PROFESOR (teachers_v2) */
      const { data: teacher, error: teacherError } = await supabase
        .from("teachers_v2")
        .select("id")
        .eq("teacher_code", teacherCode)
        .single();

      if (teacherError || !teacher) {
        throw new Error("El código del profesor no existe.");
      }

      /* 2️⃣ CREAR USUARIO AUTH */
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password: form.password,
        });

      if (signUpError || !signUpData.user) {
        throw new Error(
          signUpError?.message || "No se pudo crear el usuario."
        );
      }

      const userId = signUpData.user.id;

      /* 3️⃣ CREAR PERFIL ESTUDIANTE (RPC YA FUNCIONA) */
      const { error: rpcError } = await supabase.rpc(
        "create_student_profile",
        {
          p_user_id: userId,
          p_name: form.name.trim(),
          p_email: email,
          p_school_name: form.schoolName.trim(),
          p_teacher_id: teacher.id,
        }
      );

      if (rpcError) {
        console.error(rpcError);
        throw new Error("No se pudo crear el perfil del estudiante.");
      }

      /* 4️⃣ INICIAR SESIÓN (MUY IMPORTANTE) */
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password: form.password,
        });

      if (signInError) {
        throw new Error("La cuenta se creó, pero no se pudo iniciar sesión.");
      }

      /* 5️⃣ ÉXITO */
      navigate("/student/success");
    } catch (err: any) {
      setError(err.message || "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex flex-col items-center">
          <img src={mascot} className="w-20 h-20 mb-2" />
          <h1 className="text-2xl font-bold text-purple-700">
            Registro de Estudiante
          </h1>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border rounded-lg p-2">
            {error}
          </p>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            name="teacherCode"
            placeholder="Código del profesor"
            onChange={handleChange}
            required
          />
          <input
            name="name"
            placeholder="Nombre completo"
            onChange={handleChange}
            required
          />
          <input
            name="schoolName"
            placeholder="Colegio"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Correo"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />

          <label className="flex gap-2 text-xs">
            <input type="checkbox" name="accept" onChange={handleChange} />
            Acepto normas y términos
          </label>

          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-lg"
          >
            {loading ? "Creando..." : "Crear mi cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
