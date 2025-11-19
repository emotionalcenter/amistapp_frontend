import React from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50">
        <span className="text-xl">{icon}</span>
      </div>
      <h3 className="mb-1 text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
};

export default FeatureCard;
