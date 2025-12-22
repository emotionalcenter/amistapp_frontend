import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";

interface RewardRow {
  id: string;
  title: string;
  description: string | null;
  cost_points: number;
  stock: number;
  is_active: boolean;
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
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    cost_points: "",
    stock: "",
  });

  const [editing, setEditing] = useState<RewardRow | null>(null);

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

    /* Premios */
    const { data: rewardsRows } = await supabase
      .from("rewards_catalog")
      .select("id, title, description, cost_points, stock, is_active")
      .eq("teacher_id", teacher.id)
      .order("created_at", { ascending: true });

    setRewards(rewardsRows || []);

    /* Canjes */
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

  /* CREAR */
  async function handleCreateReward() {
    if (!teacherId) return;
    if (!form.title || !form.cost_points || !form.stock) {
      alert("Completa los campos obligatorios.");
      return;
    }

    setSaving(true);

    await supabase.from("rewards_catalog").insert({
      teacher_id: teacherId,
      title: form.title,
      description: form.description || null,
      cost_points: Number(form.cost_points),
      stock: Number(form.stock),
      is_active: true,
    });

    setForm({ title: "", description: "", cost_points: "", stock: "" });
    loadAll();
    setSaving(false);
  }

  /* EDITAR */
  async function handleSaveEdit() {
    if (!editing) return;

    setSaving(true);

    await supabase
      .from("rewards_catalog")
      .update({
        title: editing.title,
        description: editing.description,
        cost_points: editing.cost_points,
        stock: editing.stock,
      })
      .eq("id", editing.id);

    setEditing(null);
    loadAll();
    setSaving(false);
  }

  /* HABILITAR / DESHABILITAR */
  async function toggleReward(reward: RewardRow) {
    await supabase
      .from("rewards_catalog")
      .update({ is_active: !reward.is_active })
      .eq("id", reward.id);

    loadAll();
  }

  /* CANJES */
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

  if (loading) return <p className="p-6">Cargando premios...</p>;

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-purple-700">
        🎁 Gestión de Premios
      </h1>

      {/* CREAR */}
      <section className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
        <h2 className="font-bold text-sm">Crear nuevo premio</h2>

        <input
          placeholder='Ej: "Elegir música en clase"'
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border rounded-xl px-4 py-3 text-sm"
        />

        <textarea
          placeholder="Describe el premio"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded-xl px-4 py-3 text-sm min-h-[70px]"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Puntos"
            value={form.cost_points}
            onChange={(e) =>
              setForm({ ...form, cost_points: e.target.value })
            }
            className="border rounded-xl px-4 py-3 text-sm"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="border rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <button
          onClick={handleCreateReward}
          disabled={saving}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold"
        >
          Guardar premio
        </button>
      </section>

      {/* PREMIOS */}
      <section className="space-y-3">
        <h2 className="font-bold text-sm">Tus premios creados</h2>

        {rewards.map((r) => (
          <div
            key={r.id}
            className={`bg-white rounded-xl shadow p-4 ${
              !r.is_active && "opacity-50"
            }`}
          >
            <p className="font-bold text-purple-700">{r.title}</p>
            {r.description && (
              <p className="text-xs text-gray-600">{r.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              ⭐ {r.cost_points} pts · 📦 {r.stock}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditing(r)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs"
              >
                Editar
              </button>

              <button
                onClick={() => toggleReward(r)}
                className={`flex-1 py-2 rounded-lg text-xs text-white ${
                  r.is_active ? "bg-gray-500" : "bg-green-600"
                }`}
              >
                {r.is_active ? "Deshabilitar" : "Habilitar"}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* CANJES */}
      <section className="space-y-3">
        <h2 className="font-bold text-sm">Solicitudes de canje</h2>

        {claims.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow p-4">
            <p className="text-sm font-semibold">
              {c.student_name} → {c.reward_title}
            </p>
            <p className="text-xs">Estado: {c.status}</p>

            {c.status === "pendiente" && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => updateClaim(c.id, "aprobado")}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => updateClaim(c.id, "rechazado")}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs"
                >
                  Rechazar
                </button>
              </div>
            )}

            {c.status === "aprobado" && (
              <button
                onClick={() => deliver(c.id)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs mt-2"
              >
                Marcar entregado
              </button>
            )}
          </div>
        ))}
      </section>

      {/* MODAL EDITAR */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-5 w-[90%] max-w-md space-y-3">
            <h3 className="font-bold text-purple-700">Editar premio</h3>

            <input
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
              className="border rounded-xl px-3 py-2 text-sm"
            />

            <textarea
              value={editing.description || ""}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
              className="border rounded-xl px-3 py-2 text-sm min-h-[70px]"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={editing.cost_points}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    cost_points: Number(e.target.value),
                  })
                }
                className="border rounded-xl px-3 py-2 text-sm"
              />
              <input
                type="number"
                value={editing.stock}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    stock: Number(e.target.value),
                  })
                }
                className="border rounded-xl px-3 py-2 text-sm"
              />
            </div>

            <button
              onClick={handleSaveEdit}
              className="w-full bg-purple-600 text-white py-2 rounded-xl"
            >
              Guardar cambios
            </button>

            <button
              onClick={() => setEditing(null)}
              className="w-full text-xs text-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <BottomNav active="rewards" />
    </div>
  );
}
