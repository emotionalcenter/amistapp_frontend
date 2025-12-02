import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function TeacherCompleteRegister() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    subject: "",
    course: "",
    phone: "",
    terms: false,
  });

  function generateTeacherCode() {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PROFE-${random}`;
  }

  function handleChange(e: any) {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/register/teacher");
        return;
      }

      setUser(user);

      if (user.user_metadata?.full_name) {
        const full = user.user_metadata.full_name.split(" ");
        setForm((prev) => ({
          ...prev,
          firstName: full[0] || "",
          lastName: full.slice(1).join(" ") || "",
        }));
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");

    if (!form.terms) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    const teacherCode = generateTeacherCode();

    const { error: insertError } = await supabase.from("teachers_v2").insert({
      id: user.id,
      user_id: user.id,
      first_name: form.firstName,
      last_name: form.lastName,
      subject: form.subject,
      course: form.course,
      email: user.email,
      phone: form.phone,
      teacher_code: teacherCode,
      accepted_terms: form.terms,
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    alert("Registro completado con éxito 🎉");
    navigate("/dashboard/teacher");
  }

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700">
          Completar Registro Docente
        </h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          type="text"
          name="firstName"
          placeholder="Nombre"
          value={form.firstName}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Apellido"
          value={form.lastName}
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
          type="text"
          name="phone"
          placeholder="Teléfono"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <label className="flex items-center gap-2 text-sm">
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

        <button className="bg-purple-600 text-white w-full p-3 rounded-lg font-bold hover:bg-purple-700 transition">
          Finalizar Registro
        </button>
      </form>
    </div>
  );
}
