import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function TeacherRegister() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    subject: "",
    course: "",
    email: "",
    phone: "",
    password: "",
    terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.terms) {
      alert("Debes aceptar los términos y condiciones para registrarte.");
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) return alert(authError.message);

    const userId = authData.user?.id;

    await supabase.from("teachers_v2").insert({
      first_name: form.first_name,
      last_name: form.last_name,
      subject: form.subject,
      course: form.course,
      email: form.email,
      phone: form.phone,
      accepted_terms: form.terms,
      user_id: userId,
      teacher_code: crypto.randomUUID().slice(0, 8),
    });

    alert("Registro exitoso. Revisa tu correo para activar tu cuenta.");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registro de Profesor</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="first_name"
          placeholder="Nombre"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="last_name"
          placeholder="Apellido"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="subject"
          placeholder="Asignatura"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="course"
          placeholder="Curso"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Teléfono"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
          minLength={6}
        />

        {/* CHECKBOX DE TÉRMINOS */}
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
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded w-full"
        >
          Registrarme
        </button>
      </form>
    </div>
  );
}
