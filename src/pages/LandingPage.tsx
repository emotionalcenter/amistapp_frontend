import React from "react";
import { useNavigate } from "react-router-dom";
import HeroHeader from "../components/HeroHeader";
import FeatureCard from "../components/FeatureCard";
import BottomNav from "../components/BottomNav";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <HeroHeader />

      <main className="mx-auto flex max-w-md flex-col gap-6 px-5 pt-6">
        {/* Botones de rol */}
        <section className="space-y-3">
          <button
            type="button"
            onClick={() => navigate("/estudiante")}
            className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-lg">
                🎓
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900">
                  Soy Estudiante
                </p>
                <p className="text-xs text-slate-500">
                  Accede a tu espacio de aprendizaje.
                </p>
              </div>
            </div>
            <span className="text-xl text-slate-300">›</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/docente")}
            className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-lg">
                🍎
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900">
                  Soy Docente
                </p>
                <p className="text-xs text-slate-500">
                  Gestiona tu clase y estudiantes.
                </p>
              </div>
            </div>
            <span className="text-xl text-slate-300">›</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/tutor")}
            className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-lg">
                👨‍👩‍👧
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900">
                  Soy Tutor
                </p>
                <p className="text-xs text-slate-500">
                  Acompaña el desarrollo de tus hijos.
                </p>
              </div>
            </div>
            <span className="text-xl text-slate-300">›</span>
          </button>
        </section>

        {/* Novedades / carrusel simple */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Novedades y Características
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-1">
            <article className="min-w-[70%] rounded-3xl bg-white shadow-sm">
              <div className="h-28 rounded-3xl bg-slate-200" />
              <div className="space-y-1 p-3">
                <p className="text-sm font-semibold text-slate-900">
                  Refuerzo Positivo
                </p>
                <p className="text-xs text-slate-500">
                  Convierte tu aula en un espacio de motivación.
                </p>
              </div>
            </article>

            <article className="min-w-[70%] rounded-3xl bg-white shadow-sm">
              <div className="h-28 rounded-3xl bg-slate-200" />
              <div className="space-y-1 p-3">
                <p className="text-sm font-semibold text-slate-900">
                  Monitoreo en tiempo real
                </p>
                <p className="text-xs text-slate-500">
                  Sigue el progreso socioemocional de tus estudiantes.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Características */}
        <section className="space-y-3 pb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Características
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <FeatureCard
              icon="💗"
              title="Seguimiento Emocional"
              description="Monitorea el bienestar de los estudiantes."
            />
            <FeatureCard
              icon="🎓"
              title="Sistema de Puntos"
              description="Refuerza el comportamiento positivo."
            />
            <FeatureCard
              icon="🛡️"
              title="Reportes Anónimos"
              description="Canal seguro de comunicación."
            />
            <FeatureCard
              icon="🎁"
              title="Premios Personalizados"
              description="Catálogo adaptable a tu escuela."
            />
          </div>
        </section>
      </main>

      <BottomNav active="inicio" />
    </div>
  );
};

export default LandingPage;
