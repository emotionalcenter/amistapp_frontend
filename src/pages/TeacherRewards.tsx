import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";

interface Reward {
  id: string;
  title: string;
  cost_points: number;
  stock: number;
}

interface Claim {
  id: string;
  status: string;
  student_name: string;
  reward_title: string;
  points_spent: number;
}

export default function TeacherRewards() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    cost_points: "",
    stock: "",
  });

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);

    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    if (!userId) return;

    const { data: teacher } = await supabase
      .from("teachers_v2")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!teacher) return;
    setTeacherId(teacher.id);

    const { data: rewardsData } = await supabase
      .from("rewards_catalog")
      .select("id, title, cost_points, stock")
      .eq("teacher_id", teacher.id)
      .order("created_at");

    setRewards(rewardsData || []);

    const { data: claimsData } = await supabase
      .from("rewards_claims")
      .select(`
        id,
        status,
        points_spent,
        students(name),
        rewards_catalog(title)
      `)
      .eq("teacher_id", teacher.id)
      .order("created_at", { ascending: false });

    setClaims(
      (claimsData || []).map((c: any) => ({
        id: c.id,
        status: c.status,
        points_spent: c.points_spent,
        student_name: c.students.name,
        reward_title: c.rewards_catalog.title,
      }))
    );

    setLoading(false);
  }

  async function createReward() {
    if (!teacherId) return;

    await supabase.from("rewards_catalog").insert({
      teacher_id: teacherId,
      title: form.title,
      cost_points: Number(form.cost_points),
      stock: Number(form.stock),
    });

    setForm({ title: "", cost_points: "", stock: "" });
    loadAll();
  }

  async function approve(id: string, status: "aprobado" | "rechazado") {
    await supabase.rpc("teacher_update_reward_request", {
      p_claim_id: id,
      p_status: status,
    });
    loadAll();
  }

  async function deliver(id: string) {
    await supabase.rpc("teacher_deliver_reward", {
      p_claim_id: id,
    });
    loadAll();
  }

  if (loading) return <p className="p-6">Cargando premios…</p>;

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-28 px-4 space-y-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h1 className="text-2xl font-bold text-purple-700">🎁 Premios</h1>
        <p className="text-sm text-gray-600">
          Motiva conductas positivas con premios claros y significativos.
        </p>
      </div>

      {/* CREAR PREMIO */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-5 shadow space-y-3">
        <h2 className="font-bold text-lg">Crear nuevo premio</h2>

        <input
          className="w-full rounded-xl px-4 py-3 text-gray-800"
          placeholder="Ej: Elegir música de la clase 🎶"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <div className="flex gap-3">
          <input
            type="number"
            className="w-1/2 rounded-xl px-4 py-3 text-gray-800"
            placeholder="Costo en puntos (ej: 20)"
            value={form.cost_points}
            onChange={(e) =>
              setForm({ ...form, cost_points: e.target.value })
            }
          />
          <input
            type="number"
            className="w-1/2 rounded-xl px-4 py-3 text-gray-800"
            placeholder="Stock disponible (ej: 5)"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>

        <button
          onClick={createReward}
          className="w-full bg-white text-purple-700 font-bold py-3 rounded-xl"
        >
          Guardar premio
        </button>
      </div>

      {/* PREMIOS CREADOS */}
      <div className="space-y-3">
        <h2 className="font-bold text-gray-700">🎯 Premios creados</h2>

        {rewards.map((r) => (
          <div key={r.id} className="bg-white rounded-xl shadow p-4">
            <p className="font-semibold text-purple-700">{r.title}</p>
            <p className="text-sm text-gray-600">
              Costo: {r.cost_points} pts · Stock: {r.stock}
            </p>
          </div>
        ))}

        {rewards.length === 0 && (
          <p className="text-sm text-gray-500">
            Aún no has creado premios.
          </p>
        )}
      </div>

      {/* SOLICITUDES */}
      <div className="space-y-3">
        <h2 className="font-bold text-gray-700">📩 Solicitudes de canje</h2>

        {claims.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow p-4 space-y-2">
            <p className="font-semibold">
              👩‍🎓 {c.student_name}
            </p>
            <p className="text-sm">
              Premio: <b>{c.reward_title}</b> ({c.points_spent} pts)
            </p>
            <p className="text-xs text-gray-500">Estado: {c.status}</p>

            {c.status === "pendiente" && (
              <div className="flex gap-2">
                <button
                  onClick={() => approve(c.id, "aprobado")}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => approve(c.id, "rechazado")}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                >
                  Rechazar
                </button>
              </div>
            )}

            {c.status === "aprobado" && (
              <button
                onClick={() => deliver(c.id)}
                className="w-full bg-purple-600 text-white py-2 rounded-lg"
              >
                Marcar como entregado
              </button>
            )}
          </div>
        ))}

        {claims.length === 0 && (
          <p className="text-sm text-gray-500">
            No hay solicitudes por ahora.
          </p>
        )}
      </div>

      <BottomNav active="rewards" />
    </div>
  );
}
