import React from "react";

interface HeroHeaderProps {
  subtitle?: string;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({ subtitle }) => {
  return (
    <header className="app-gradient rounded-b-3xl pb-8 pt-10 text-white shadow-md">
      <div className="mx-auto flex max-w-md flex-col gap-4 px-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Amistapp</span>
            {subtitle && (
              <span className="text-xs text-slate-100/80">{subtitle}</span>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-semibold">
            A
          </div>
        </div>
        <div className="rounded-3xl bg-white/10 p-4">
          <h1 className="mb-1 text-lg font-semibold">
            Fortaleciendo lazos, desarrollando educación socioemocional
          </h1>
          <p className="text-xs text-slate-100/90">
            Construye un ambiente positivo en tu aula mediante el refuerzo del
            comportamiento positivo y el seguimiento emocional.
          </p>
        </div>
      </div>
    </header>
  );
};

export default HeroHeader;
