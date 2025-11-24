import React from "react";

type TeacherProfileData = {
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
  about: string;
  availablePoints: number;
  studentsCount: number;
  pendingNotifications: number;
};

const mockTeacher: TeacherProfileData = {
  code: "PROF-7H3K2",
  firstName: "María",
  lastName: "González",
  email: "maria.gonzalez@colegio.cl",
  specialty: "Lenguaje y Comunicación",
  about:
    "Docente comprometida con el desarrollo socioemocional de mis estudiantes. Me encanta usar el refuerzo positivo y las emociones como parte del aprendizaje diario.",
  availablePoints: 1000,
  studentsCount: 28,
  pendingNotifications: 3,
};

export default function TeacherProfile() {
  const teacher = mockTeacher;

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-24 pt-6">
      {/* Encabezado */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Perfil del profesor</h1>
        <p className="text-sm text-gray-500">
          Revisa tu información y el resumen de tu curso.
        </p>
      </div>

      {/* Card de información personal */}
      <section className="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
            {teacher.firstName.charAt(0)}
            {teacher.lastName.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {teacher.firstName} {teacher.lastName}
            </h2>
            <p className="text-xs text-gray-500">Código profesor: {teacher.code}</p>
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <p>
            <span className="font-semibold text-gray-700">Correo: </span>
            <span className="text-gray-800">{teacher.email}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-700">Especialidad: </span>
            <span className="text-gray-800">{teacher.specialty}</span>
          </p>
        </div>
      </section>

      {/* Acerca de mí */}
      <section className="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Acerca de mí
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">{teacher.about}</p>
      </section>

      {/* Panel de estadísticas */}
      <section className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Panel de estadísticas de la clase
        </h3>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-indigo-50 rounded-xl p-3 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 mb-1">Puntaje disponible</span>
            <span className="text-lg font-bold text-indigo-700">
              {teacher.availablePoints}
            </span>
            <span className="text-[10px] text-gray-500">pts</span>
          </div>

          <div className="bg-emerald-50 rounded-xl p-3 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 mb-1">Estudiantes</span>
            <span className="text-lg font-bold text-emerald-700">
              {teacher.studentsCount}
            </span>
            <span className="text-[10px] text-gray-500">en la clase</span>
          </div>

          <div className="bg-amber-50 rounded-xl p-3 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 mb-1">Notificaciones</span>
            <span className="text-lg font-bold text-amber-700">
              {teacher.pendingNotifications}
            </span>
            <span className="text-[10px] text-gray-500">pendientes</span>
          </div>
        </div>
      </section>
    </div>
  );
}
