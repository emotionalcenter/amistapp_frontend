import React from "react";
import HeroHeader from "../components/HeroHeader";
import FeatureCard from "../components/FeatureCard";
import BottomNav from "../components/BottomNav";

const StudentHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <HeroHeader subtitle="Espacio de estudiantes" />

      <main className="mx-auto flex max-w-md flex-col gap-6 px-5 pt-6 pb-4">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            Tus emociones hoy
          </h2>
          <p className="text-sm text-slate-500">
            Registra cómo te sientes, gana puntos por cuidar de ti y de tu curso
            y recibe apoyo cuando lo necesites.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <FeatureCard
            icon="😊"
            title="Estoy bien"
            description="Registra emociones positivas y gana puntos extras."
          />
          <FeatureCard
            icon="😐"
            title="Podría estar mejor"
            description="Comparte cómo te sientes para que tu docente pueda ayudarte."
          />
          <FeatureCard
            icon="😔"
            title="Necesito apoyo"
            description="Activa canales de apoyo confidenciales."
          />
          <FeatureCard
            icon="⭐"
            title="Mis logros"
            description="Mira los puntos y premios que has ganado."
          />
        </section>
      </main>

      <BottomNav active="emociones" />
    </div>
  );
};

export default StudentHome;
