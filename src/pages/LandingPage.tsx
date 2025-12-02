// src/pages/LandingPage.tsx
import React, { useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import "../styles/Landing.css";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Autoscroll tipo Duolingo muy simple
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (!container) return;
      const scrollAmount = 270; // más o menos el ancho de una tarjeta
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft + scrollAmount >= maxScroll) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-container">
      {/* HEADER */}
      <div className="landing-header">
        <img src={logo} alt="AmistApp Logo" className="landing-logo" />
        <h1 className="landing-title">AmistApp</h1>

        <div className="landing-box">
          <h2>Fortaleciendo lazos, desarrollando educación socioemocional</h2>
          <p>
            Construye un ambiente positivo en tu aula mediante el refuerzo del comportamiento positivo y el seguimiento emocional.
          </p>
        </div>
      </div>

      {/* OPCIONES PRINCIPALES */}
      <div className="landing-options">
        <div className="option-card" onClick={() => navigate("/student")}>
          <span className="emoji">🎓</span>
          <div>
            <h3>Soy Estudiante</h3>
            <p>Accede a tu espacio de aprendizaje.</p>
          </div>
          <span className="arrow">›</span>
        </div>

        <div
          className="option-card"
          onClick={() => navigate("/register/teacher")}
        >
          <span className="emoji">🍎</span>
          <div>
            <h3>Soy Docente</h3>
            <p>Gestiona tu clase y estudiantes.</p>
          </div>
          <span className="arrow">›</span>
        </div>

        <div className="option-card" onClick={() => navigate("/tutor")}>
          <span className="emoji">👨‍👩‍👧‍👦</span>
          <div>
            <h3>Soy Tutor</h3>
            <p>Acompaña el desarrollo de tus hijos.</p>
          </div>
          <span className="arrow">›</span>
        </div>
      </div>

      {/* CARRUSEL */}
      <div className="carousel-section">
        <h2>Novedades y Características</h2>

        <div className="carousel" ref={carouselRef}>
          <div className="carousel-item">🌟 Seguimiento emocional diario</div>
          <div className="carousel-item">🎁 Sistema de premios y logros</div>
          <div className="carousel-item">
            📊 Reportes automáticos para docentes
          </div>
          <div className="carousel-item">
            🤝 Conexión estudiantes–familias–profesores
          </div>
        </div>
      </div>
    </div>
  );
}
