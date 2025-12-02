import BottomNav from "../components/BottomNav";

interface Reward {
  id: number;
  name: string;
  points: number;
  stock: number;
  status: "disponible" | "entregado" | "pendiente" | "rechazado";
}

const mockRewards: Reward[] = [
  { id: 1, name: "Tiempo extra en recreo", points: 50, stock: 5, status: "disponible" },
  { id: 2, name: "Certificado de reconocimiento", points: 80, stock: 2, status: "entregado" },
  { id: 3, name: "Sticker especial", points: 20, stock: 10, status: "pendiente" },
];

export default function TeacherRewards() {
  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Premios</h1>
        <p className="text-sm text-gray-600">
          Gestiona los premios y los canjes de tus estudiantes
        </p>
      </header>

      {/* Crear premio (UI mock) */}
      <section className="bg-white rounded-2xl shadow-md p-4 mb-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">
          Crear nuevo premio
        </h2>
        <div className="space-y-2">
          <input
            className="w-full border rounded-lg px-3 py-2 text-xs"
            placeholder="Nombre del premio"
          />
          <input
            className="w-full border rounded-lg px-3 py-2 text-xs"
            placeholder="Puntos de canje"
            type="number"
          />
          <input
            className="w-full border rounded-lg px-3 py-2 text-xs"
            placeholder="Stock disponible"
            type="number"
          />
          <input
            className="w-full border rounded-lg px-3 py-2 text-xs"
            placeholder="Características / detalles"
          />
          <button className="w-full bg-purple-600 text-white text-xs font-semibold py-2 rounded-lg">
            Guardar premio
          </button>
        </div>
      </section>

      {/* Listado de premios */}
      <section className="space-y-3">
        {mockRewards.map((reward) => (
          <div
            key={reward.id}
            className="bg-white rounded-xl shadow-sm px-4 py-3 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {reward.name}
              </p>
              <p className="text-xs text-gray-500">
                {reward.points} puntos · Stock: {reward.stock}
              </p>
            </div>
            <span
              className={
                "text-[11px] font-semibold px-2 py-1 rounded-full " +
                (reward.status === "disponible"
                  ? "bg-green-100 text-green-700"
                  : reward.status === "entregado"
                  ? "bg-blue-100 text-blue-700"
                  : reward.status === "pendiente"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700")
              }
            >
              {reward.status}
            </span>
          </div>
        ))}
      </section>

      <BottomNav active="rewards" />
    </div>
  );
}
