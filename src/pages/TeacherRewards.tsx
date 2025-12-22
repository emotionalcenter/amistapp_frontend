import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";

/* -------------------- TIPOS -------------------- */
interface Reward {
  id: string;
  title: string;
  description: string | null;
  cost_points: number;
  stock: number;
  active: boolean;
}

interface Claim {
  id: string;
  status: string;
  points_spent: number;
  student_name: string;
  reward_title: string;
}

/* -------------------- COMPONENTE -------------------- */
export default function TeacherRewards() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<Reward | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    cost_points: "",
    stock: "",
  });

  /* -------------------- CARGA INICIAL -------------------- */
  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);

    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;
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
      .select("*")
      .eq("teacher_id", teacher.id)
      .order("created_at");

    setRewards(rewardsRows || []);

    /* Solicitudes */
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

  /* -------------------- PREMIO CRUD -------------------- */
  async function saveReward() {
    if (!teacherId) return;

    if (editing) {
      await supabase
        .from("rewards_catalog")
        .update({
          title: form.title,
          description: form.description || null,
          cost_points: Number(form.cost_points),
          stock: Number(form.stock),
        })
        .eq("id", editing.id);
    } else {
      await supabase.from("rewards_catalog").insert({
        teacher_id: teacherId,
        title: form.title,
        description: form.description || null,
        cost_points: Number(form.cost_points),
        stock: Number(form.stock),
        active: true,
      });
    }

    resetForm();
    loadAll();
  }

  async function toggleReward(reward: Reward) {
    await supabase
      .from("rewards_catalog")
      .update({ active: !reward.active })
      .eq("id", reward.id);

    loadAll();
  }

  async function deleteReward(id: string) {
    if (!confirm("¿Eliminar este premio?")) return;
    await supabase.from("rewards_catalog").delete().eq("id", id);
    loadAll();
  }

  function resetForm() {
    setEditing(null);
    setForm({ title: "", description: "", cost_points: "", stock: "" });
  }

  /* -------------------- CANJES -------------------- */
  async function updateClaim(id: string, status: "aprobado" | "rechazado") {
    await supabase.rpc("teacher_update_reward_request", {
      p_claim_id: id,
      p_status: status,
    });
    loadAll();
  }

  async function deliver(id: string) {
    await supabase.rpc("teacher_deliver_reward", { p_claim_id: id });
    loadAll();
  }

  if (loading) return <p className="p-6">Cargando premios...</p>;

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4 space-y-8">
      <h1 className="text-2xl font-bold text-purple-700">🎁 Premios</h1>

      {/* -------- CREAR / EDITAR -------- */}
      <section className="bg-white rounded-2xl shadow p-5 space-y-3">
        <h2 className="font-semibold text-purple-700">
          {editing ? "Editar premio" : "Crear nuevo premio"}
        </h2>

        <input
          placeholder="Ej: 10 minutos de recreo extra"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border rounded-xl px-4 py-2"
        />

        <textarea
          placeholder="Descripción del premio"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded-xl px-4 py-2"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Puntos"
            value={form.cost_points}
            onChange={(e) =>
              setForm({ ...form, cost_points: e.target.value })
            }
            className="border rounded-xl px-4 py-2"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="border rounded-xl px-4 py-2"
          />
        </div>

        <button
          onClick={saveReward}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold"
        >
          {editing ? "Guardar cambios" : "Crear premio"}
        </button>

        {editing && (
          <button
            onClick={resetForm}
            className="w-full text-sm text-gray-500"
          >
            Cancelar edición
          </button>
        )}
      </section>

      {/* -------- MIS PREMIOS -------- */}
      <section className="space-y-3">
        <h2 className="font-semibold text-gray-700">Mis premios</h2>

        {rewards.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{r.title}</p>
              <p className="text-xs text-gray-500">
                {r.cost_points} pts · Stock: {r.stock}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(r);
                  setForm({
                    title: r.title,
                    description: r.description || "",
                    cost_points: String(r.cost_points),
                    stock: String(r.stock),
                  });
                }}
                className="text-blue-600 text-sm"
              >
                ✏️
              </button>

              <button
                onClick={() => toggleReward(r)}
                className="text-sm"
              >
                {r.active ? "🔴" : "🟢"}
              </button>

              <button
                onClick={() => deleteReward(r.id)}
                className="text-red-600 text-sm"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* -------- SOLICITUDES -------- */}
      <section className="space-y-3">
        <h2 className="font-semibold text-gray-700">
          Solicitudes de canje
        </h2>

        {claims.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl shadow p-4 space-y-1"
          >
            <p className="font-semibold">
              {c.student_name} → {c.reward_title}
            </p>
            <p className="text-xs text-gray-500">
              {c.points_spent} puntos · Estado: {c.status}
            </p>

            {c.status === "pendiente" && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => updateClaim(c.id, "aprobado")}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => updateClaim(c.id, "rechazado")}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Rechazar
                </button>
              </div>
            )}

            {c.status === "aprobado" && (
              <button
                onClick={() => deliver(c.id)}
                className="mt-2 bg-purple-600 text-white px-3 py-1 rounded-lg text-sm"
              >
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
