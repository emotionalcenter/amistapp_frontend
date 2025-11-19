import React from "react";
import HeroHeader from "../components/HeroHeader";
import FeatureCard from "../components/FeatureCard";
import BottomNav from "../components/BottomNav";

const TeacherHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <HeroHeader subtitle="Panel de docentes" />

      <main className="mx-auto flex max-w-md flex-col gap-6 px-5 pt-6 pb-4">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            Gestiona tu curso
          </h2>
          <p className="text-sm text-slate-500">
            Premia conductas positivas, revisa alertas socioemocionales y
            fortalece la convivencia educativa.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <FeatureCard
            icon="➕"
            title="Otorgar puntos"
            description="Refuerza conductas positivas en segundos."
          />
          <FeatureCard
            icon="📊"
            title="Indicadores"
            description="Visualiza el clima del curso y su progreso."
          />
          <FeatureCard
            icon="📣"
            title="Alertas"
            description="Recibe reportes anónimos y actúa a tiempo."
          />
          <FeatureCard
            icon="🎁"
            title="Catálogo"
            description="Configura premios y reconocimientos."
          />
        </section>
      </main>

      <BottomNav active="premios" />
    </div>
  );
};

export default TeacherHome;
