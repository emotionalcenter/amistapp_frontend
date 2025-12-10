import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import mascot from "../assets/mascot.png"; 
import { supabase } from "../lib/supabaseClient";

import {
  Heart,
  Users,
  GraduationCap,
  Star,
  Award,
  Sparkles,
} from "lucide-react";

interface Benefit {
  id: number;
  title: string;
  description: string;
  icon?: string | null;
}

const staticBenefits: Benefit[] = [
  {
    id: 1,
    title: "Convivencia educativa positiva",
    description:
      "Fortalece habilidades socioemocionales y el clima del aula.",
  },
  {
    id: 2,
    title: "Premios y refuerzos positivos",
    description:
      "Sistema de puntos y recompensas que motiva a los estudiantes.",
  },
  {
    id: 3,
    title: "Emociones y bienestar",
    description:
      "Registro diario de emociones para acompañar el bienestar.",
  },
];

const carouselItems = [
  {
    id: 1,
    title: "Actividades socioemocionales",
    description:
      "Retos y dinámicas para trabajar empatía, respeto y autocontrol.",
    imageUrl:
      "https://images.pexels.com/photos/8617981/pexels-photo-8617981.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 2,
    title: "Seguimiento en tiempo real",
    description: "Profesores, estudiantes y tutores conectados en una sola app.",
    imageUrl:
      "https://images.pexels.com/photos/5212335/pexels-photo-5212335.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 3,
    title: "Premios y logros",
    description:
      "Gamificación para reconocer el esfuerzo diario de los estudiantes.",
    imageUrl:
      "https://images.pexels.com/photos/8422202/pexels-photo-8422202.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export default function UserSelect() {
  const [benefits, setBenefits] = useState<Benefit[]>(staticBenefits);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cargar beneficios desde Supabase
  useEffect(() => {
    const fetchBenefits = async () => {
      const { data, error } = await supabase
        .from("benefits")
        .select("id, title, description, icon");

      if (error) return;
      if (data && data.length > 0) setBenefits(data);
    };

    fetchBenefits();
  }, []);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length);

  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );

  const currentItem = carouselItems[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-500 flex flex-col items-center text-white">

      {/* Logo con Fade-in */}
      <motion.div
        className="mt-8 flex flex-col items-center px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={logo}
          className="w-28 drop-shadow-lg"
          alt="AmistApp"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        <h1 className="text-2xl font-bold mt-4 text-center">
          Bienvenido a <span className="text-yellow-300">AmistApp</span>
        </h1>

        <p className="text-center mt-2 text-sm max-w-md">
          La aplicación para la educación socioemocional  
          y la vida escolar positiva 🌱✨
        </p>

        <div className="flex gap-6 mt-4 text-pink-200">
          <Heart size={28} />
          <Users size={28} />
          <GraduationCap size={28} />
        </div>
      </motion.div>

      {/* Mascota kawaii */}
      <motion.div
        className="mt-6 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={mascot}
          alt="Mascota AmistApp"
          className="w-32 h-32 rounded-full shadow-xl border-4 border-white"
        />
        <p className="text-sm mt-2">Hola, soy Amis 💜</p>
      </motion.div>

      {/* Caja con botones */}
      <motion.div
        className="bg-white w-full mt-8 p-6 rounded-t-3xl shadow-xl"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >

        {/* ESTUDIANTE */}
        <Link
          to="//student/login"
          state={{ role: "student" }}
          className="flex items-center gap-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition mb-4"
        >
          <span className="text-3xl">🎒</span>
          <div>
            <h3 className="font-bold text-lg">Soy Estudiante</h3>
            <p className="text-purple-100 text-sm">
              Accede a tu espacio de aprendizaje
            </p>
          </div>
        </Link>

        {/* PROFESOR */}
        <Link
          to="/login"
          state={{ role: "teacher" }}
          className="flex items-center gap-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition mb-4"
        >
          <span className="text-3xl">📘</span>
          <div>
            <h3 className="font-bold text-lg">Soy Docente</h3>
            <p className="text-indigo-100 text-sm">
              Gestiona tu clase y estudiantes
            </p>
          </div>
        </Link>

        {/* TUTOR */}
        <Link
          to="/auth/choice"
          state={{ role: "tutor" }}
          className="flex items-center gap-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition"
        >
          <span className="text-3xl">👨‍👩‍👧</span>
          <div>
            <h3 className="font-bold text-lg">Soy Tutor</h3>
            <p className="text-teal-100 text-sm">
              Acompaña el desarrollo de tus hijos
            </p>
          </div>
        </Link>

        {/* Video YouTube */}
        <div className="mt-8">
          <h2 className="text-gray-800 font-bold text-lg mb-2 flex items-center gap-2">
            <Sparkles className="text-purple-500" size={22} />
            Video introductorio
          </h2>

          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-xl bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/bzB3WAa8HbM"
              title="AmistApp Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Beneficios */}
        <div className="mt-8">
          <h2 className="text-gray-800 font-bold text-lg mb-3 flex items-center gap-2">
            <Star className="text-yellow-400" size={22} />
            Beneficios de AmistApp
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="flex items-start gap-3 bg-gray-100 p-4 rounded-xl shadow"
              >
                <Award className="text-purple-500 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrusel */}
        <div className="mt-10">
          <h2 className="text-gray-800 font-bold text-lg mb-3 flex items-center gap-2">
            <Sparkles className="text-blue-500" size={22} />
            Así se ve AmistApp en acción
          </h2>

          <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-gray-200">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={currentItem.imageUrl}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-gray-800">
                  {currentItem.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {currentItem.description}
                </p>
              </div>
            </motion.div>

            {/* Botones del carrusel */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 px-3 py-1 rounded-full shadow"
            >
              ◀
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 px-3 py-1 rounded-full shadow"
            >
              ▶
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
