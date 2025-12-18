import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import mascot from "../assets/mascot.png";
import logo from "../assets/logo.png";

/* Avatares de animales (dicebear) */
const animalAvatars = [
  "lion",
  "cat",
  "dog",
  "fox",
  "panda",
  "bear",
  "koala",
  "tiger",
  "owl",
  "rabbit",
];

/* Consejos socioemocionales */
const consejos = [
  "Reconocer a otros fortalece la empatía y el respeto 💜",
  "Las acciones positivas inspiran a tus compañeros 🌱",
  "Pedir ayuda también es una forma de valentía 🤝",
  "Cuidar tus emociones te ayuda a aprender mejor ✨",
  "Un pequeño gesto puede cambiar el día de alguien 😊",
];

export default function StudentHome() {
  const navigate = useNavigate();

  const [student, setStudent] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [consejo, setConsejo] = useState("");

  useEffect(() => {
    async function loadData() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      const userId = sessionData.session.user.id;

      /* 1️⃣ Obtener estudiante */
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (studentError || !studentData) {
        setLoading(false);
        return;
      }

      setStudent(studentData);

      /* 2️⃣ Obtener profesor */
      const { data: teacherData } = await supabase
        .from("teachers_v2")
        .select("name, teacher_code")
        .eq("id", studentData.teacher_id)
        .single();

      setTeacher(teacherData || null);
      setLoading(false);
    }

    loadData();
    setConsejo(consejos[Math.floor(Math.random() * consejos.length)]);
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Cargando...</div>;

  if (!student)
    return (
      <div className="p-6 text-red-600 font-semibold">
        No se encontró tu perfil de estudiante.
      </div>
    );

  /* Avatar animal consistente por estudiante */
  const avatarSeed =
    animalAvatars[student.user_id.charCodeAt(0) % animalAvatars.length];

  return (
    <div className="p-4 pb-28 space-y-6">

      {/* LOGO */}
      <div className="flex justify-center">
        <img src={logo} alt="AmistApp" className="h-10" />
      </div>

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4">
        <img
          src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${avatarSeed}`}
          className="w-16 h-16 rounded-full border-4 border-purple-300"
          alt="Avatar"
        />

        <div>
          <h2 className="text-xl font-bold text-purple-700">
            Hola, {student.name} 👋
          </h2>
          <p className="text-gray-600 text-sm">
            Colegio: {student.school_name}
          </p>
        </div>
      </div>

      {/* PUNTAJE */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white shadow-lg">
        <p className="text-sm opacity-90">Tu puntaje actual</p>
        <p className="text-4xl font-extrabold">{student.points}</p>
        <p className="text-xs opacity-90 mt-1">
          Ganas puntos con acciones positivas 💜
        </p>
      </div>

      {/* ACCIÓN PRINCIPAL */}
      <button
        onClick={() => navigate("/give-points/actions")}
        className="w-full bg-purple-600 text-white py-4 rounded-xl text-lg font-bold shadow hover:bg-purple-700 transition"
      >
        ⭐ Reconocer a un compañero
      </button>

      {/* INFO CLASE */}
      {teacher && (
        <div className="bg-white rounded-2xl shadow p-4 text-sm space-y-1">
          <p>
            👨‍🏫 <b>Profesor:</b> {teacher.name}
          </p>
          <p>
            🧩 <b>Código de la clase:</b>{" "}
            <span className="font-mono text-purple-600">
              {teacher.teacher_code}
            </span>
          </p>
        </div>
      )}

      {/* CONSEJO SOCIOEMOCIONAL */}
      <div className="bg-purple-100 rounded-2xl p-5 flex items-center gap-4 shadow">
        <img src={mascot} className="w-20 h-20" alt="Mascota" />
        <div>
          <p className="font-bold text-purple-700">Amis te recuerda 💜</p>
          <p className="text-sm text-purple-800">{consejo}</p>
        </div>
      </div>
    </div>
  );
}
