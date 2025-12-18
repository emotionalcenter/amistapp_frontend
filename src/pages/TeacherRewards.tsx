import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";

interface RewardRow {
  id: string;
  title: string;
  cost_points: number;
  stock: number;
}

interface ClaimRow {
  id: string;
  status: string;
  points_spent: number;
  student_name: string;
  reward_title: string;
}

export default function TeacherRewards() {
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<RewardRow[]>([]);
  const [claims, setClaims] = useState<ClaimRow[]>([]);
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

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return;

    const { data: teacher } = await supabase
      .from("teachers_v2")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!teacher) return;

    setTeacherId(teacher.id);

    const { data: rewardsRows } = await supabase
      .from("rewards_catalog")
      .select("id, title, cost_points, stock")
      .eq("teacher_id", teacher.id)
      .order("created_at");

    setRewards(rewardsRows || []);

    const { data: claimsRows } = await supabase
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
      (claimsRows || []).map((c: any) => ({
        id: c.id,
        status: c.status,
        points_spent: c.points_spent,
        student_name: c.students.name,
        reward_title: c.rewards_catalog.title,
      }))
    );

    setLoading(false);
  }

  async function handleCreateReward() {
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

  async function updateClaim(id: string, status: "aprobado" | "rechazado") {
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

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-purple-700">Premios</h1>

      {/* Crear premio */}
      <section className="bg-white rounded-xl p-4 shadow space-y-2">
        <h2 className="font-semibold">Crear premio</h2>
        <input
          placeholder="Nombre"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Puntos"
          type="number"
          value={form.cost_points}
          onChange={(e) => setForm({ ...form, cost_points: e.target.value })}
        />
        <input
          placeholder="Stock"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <button onClick={handleCreateReward}>Guardar</button>
      </section>

      {/* Solicitudes */}
      <section className="space-y-3">
        <h2 className="font-semibold">Solicitudes</h2>

        {claims.map((c) => (
          <div key={c.id} className="bg-white p-4 rounded-xl shadow space-y-2">
            <p className="font-semibold">
              {c.student_name} → {c.reward_title}
            </p>
            <p className="text-sm">Puntos: {c.points_spent}</p>
            <p className="text-xs">Estado: {c.status}</p>

            {c.status === "pendiente" && (
              <div className="flex gap-2">
                <button onClick={() => updateClaim(c.id, "aprobado")}>
                  Aprobar
                </button>
                <button onClick={() => updateClaim(c.id, "rechazado")}>
                  Rechazar
                </button>
              </div>
            )}

            {c.status === "aprobado" && (
              <button onClick={() => deliver(c.id)}>
                Marcar como entregado
              </button>
            )}
          </div>
        ))}
      </section>

      <BottomNav active="rewards" />
    </div>
  );
}
