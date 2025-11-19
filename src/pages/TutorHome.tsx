import React from "react";
import HeroHeader from "../components/HeroHeader";
import FeatureCard from "../components/FeatureCard";
import BottomNav from "../components/BottomNav";

const TutorHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <HeroHeader subtitle="Familias y tutores" />

      <main className="mx-auto flex max-w-md flex-col gap-6 px-5 pt-6 pb-4">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            Acompaña a tus hijos
          </h2>
          <p className="text-sm text-slate-500">
            Visualiza el bienestar emocional, los logros y los reconocimientos
            que gana tu hijo en la escuela.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <FeatureCard
            icon="💬"
            title="Resumen emocional"
            description="Mira cómo se ha sentido tu hijo en la última semana."
          />
          <FeatureCard
            icon="🏅"
            title="Reconocimientos"
            description="Descubre los premios y logros obtenidos."
          />
          <FeatureCard
            icon="🤝"
            title="Acuerdos"
            description="Refuerza acuerdos de convivencia desde el hogar."
          />
          <FeatureCard
            icon="📚"
            title="Recursos"
            description="Accede a recomendaciones socioemocionales."
          />
        </section>
      </main>

      <BottomNav active="perfil" />
    </div>
  );
};

export default TutorHome;
