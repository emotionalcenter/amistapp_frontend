import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";

interface RewardRow {
  id: string;
  title: string;
  description: string | null;
  cost_points: number;
  stock: number;
}

export default function TeacherRewards() {
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<RewardRow[]>([]);
  const [form, setForm] = useState({
    title: "",
    cost_points: "",
    stock: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      const { data: teacher } = await supabase
        .from("teachers_v2")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!teacher) {
        setLoading(false);
        return;
      }

      setTeacherId(teacher.id);

      const { data: rewardsRows } = await supabase
        .from("rewards_catalog")
        .select("id, title, description, cost_points, stock")
        .eq("teacher_id", teacher.id)
        .order("created_at", { ascending: true });

      setRewards(rewardsRows || []);
      setLoading(false);
    }

    load();
  }, []);

  function getStatus(reward: RewardRow): "disponible" | "pendiente" | "rechazado" | "entregado" {
    if (reward.stock > 0) return "disponible";
    return "pendiente"; // placeholder hasta conectar rewards_claims
  }

  function getStatusClass(status: string) {
    if (status === "disponible") return "bg-green-100 text-green-700";
    if (status === "entregado") return "bg-blue-100 text-blue-700";
    if (status === "pendiente") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  }

  async function handleSaveReward() {
    if (!teacherId) return;
    if (!form.title || !form.cost_points || !form.stock) return;

    setSaving(true);

    const payload = {
      teacher_id: teacherId,
      title: form.title,
      description: form.description || null,
      cost_points: Number(form.cost_points),
      stock: Number(form.stock),
    };

    const { data, error } = await supabase
      .from("rewards_catalog")
      .insert(payload)
      .select("id, title, description, cost_points, stock")
      .single();

    if (!error && data) {
      setRewards((prev) => [...prev, data]);
      setForm({
        title: "",
        cost_points: "",
        stock: "",
        description: "",
      });
    }

    setSaving(false);
  }

  if (loading) {
    return <p className="p-6">Cargando premios...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Premios</h1>
        <p className="text-sm text-gray-600">
          Gestiona los premios y los canjes de tus estudiantes
        </p>
      </header>

      {/* Crear premio */}
      <section className="bg-white rounded-2xl shadow-md p-4 mb-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">
          Crear nuevo premio
        </h2>
        <div className="space-y-2">
          <input
            className="w-full border rounded-lg px-3 py-2 text-xs"
            placeholder="Nombre del premio"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="w-full border rounded-lg px-3 py-2 text-xs"
            placeholder="Puntos de canje"
            type="number"
            value={form.cost_points}
            onChange={(e) => setForm({ ...form, cost_points: e.target.value })}
          />
          <input
            className="w-full border rounded-lg px-3 py-2 text-xs"
            placeholder="Stock disponible"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <input
            className="w-full border rounded-lg px-3 py-2 text-xs"
            placeholder="Características / detalles"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button
            onClick={handleSaveReward}
            disabled={saving}
            className="w-full bg-purple-600 text-white text-xs font-semibold py-2 rounded-lg disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar premio"}
          </button>
        </div>
      </section>

      {/* Listado */}
      <section className="space-y-3">
        {rewards.map((reward) => {
          const status = getStatus(reward);
          return (
            <div
              key={reward.id}
              className="bg-white rounded-xl shadow-sm px-4 py-3 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {reward.title}
                </p>
                <p className="text-xs text-gray-500">
                  {reward.cost_points} puntos · Stock: {reward.stock}
                </p>
                {reward.description && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    {reward.description}
                  </p>
                )}
              </div>
              <span
                className={
                  "text-[11px] font-semibold px-2 py-1 rounded-full " +
                  getStatusClass(status)
                }
              >
                {status}
              </span>
            </div>
          );
        })}

        {rewards.length === 0 && (
          <p className="text-sm text-gray-600">
            Aún no has creado premios para tus estudiantes.
          </p>
        )}
      </section>

      <BottomNav active="rewards" />
    </div>
  );
}
