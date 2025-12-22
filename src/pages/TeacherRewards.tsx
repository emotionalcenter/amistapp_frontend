import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";

/** ========== TIPOS (NO CAMBIA LÓGICA) ========== */
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

type TabKey = "catalog" | "claims";

/** ========== HELPERS UI ========== */
function pillClass(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "entregado") return "bg-green-100 text-green-700";
  if (s === "aprobado") return "bg-blue-100 text-blue-700";
  if (s === "pendiente") return "bg-yellow-100 text-yellow-700";
  if (s === "rechazado" || s === "cancelado") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

function formatStatus(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "pendiente") return "Pendiente";
  if (s === "aprobado") return "Aprobado";
  if (s === "rechazado") return "Rechazado";
  if (s === "entregado") return "Entregado";
  if (s === "cancelado") return "Cancelado";
  return status || "—";
}

export default function TeacherRewards() {
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  const [rewards, setRewards] = useState<RewardRow[]>([]);
  const [claims, setClaims] = useState<ClaimRow[]>([]);

  const [tab, setTab] = useState<TabKey>("catalog");

  const [form, setForm] = useState({
    title: "",
    cost_points: "",
    stock: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ========== MISMA LÓGICA DE CARGA (NO TOCAR) ========== */
  async function loadAll() {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

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

    // Catálogo de premios (del profesor)
    const { data: rewardsRows } = await supabase
      .from("rewards_catalog")
      .select("id, title, cost_points, stock")
      .eq("teacher_id", teacher.id)
      .order("created_at");

    setRewards(rewardsRows || []);

    // Solicitudes / historial de canjes (del profesor)
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
        student_name: c.students?.name ?? "Estudiante",
        reward_title: c.rewards_catalog?.title ?? "Premio",
      }))
    );

    setLoading(false);
  }

  /** ========== CREAR PREMIO (MISMA LÓGICA) ========== */
  async function handleCreateReward() {
    if (!teacherId) return;

    const title = form.title.trim();
    const cost = Number(form.cost_points);
    const stock = Number(form.stock);

    if (!title) {
      alert("Escribe el nombre del premio.");
      return;
    }
    if (!Number.isFinite(cost) || cost <= 0) {
      alert("El costo debe ser un número mayor a 0.");
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      alert("El stock debe ser 0 o mayor.");
      return;
    }

    try {
      setSaving(true);

      await supabase.from("rewards_catalog").insert({
        teacher_id: teacherId,
        title,
        cost_points: cost,
        stock,
      });

      setForm({ title: "", cost_points: "", stock: "" });
      await loadAll();
      setTab("catalog");
    } catch (e) {
      console.error(e);
      alert("No se pudo crear el premio.");
    } finally {
      setSaving(false);
    }
  }

  /** ========== ACCIONES DE CANJE (MISMA LÓGICA RPC) ========== */
  async function updateClaim(id: string, status: "aprobado" | "rechazado") {
    try {
      setSaving(true);
      await supabase.rpc("teacher_update_reward_request", {
        p_claim_id: id,
        p_status: status,
      });
      await loadAll();
    } catch (e) {
      console.error(e);
      alert("No se pudo actualizar la solicitud.");
    } finally {
      setSaving(false);
    }
  }

  async function deliver(id: string) {
    try {
      setSaving(true);
      await supabase.rpc("teacher_deliver_reward", {
        p_claim_id: id,
      });
      await loadAll();
    } catch (e) {
      console.error(e);
      alert("No se pudo marcar como entregado.");
    } finally {
      setSaving(false);
    }
  }

  const pendingCount = useMemo(
    () => claims.filter((c) => (c.status || "").toLowerCase() === "pendiente").length,
    [claims]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center p-6">
        <div className="bg-white/95 rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
          <p className="text-purple-700 font-bold text-lg">Cargando premios…</p>
          <p className="text-gray-500 text-sm mt-1">
            Preparando tu catálogo y solicitudes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 pt-6 pb-24 px-4">
      {/* HEADER DUOLINGO-LIKE */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/95 rounded-2xl shadow-xl p-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-purple-700">
              🎁 Premios
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Crea premios motivadores y gestiona solicitudes de canje.
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-[11px] text-gray-500">Pendientes</span>
            <span className="inline-flex items-center justify-center min-w-[44px] px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm">
              {pendingCount}
            </span>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-4 bg-white/95 rounded-2xl shadow p-2 flex gap-2">
          <button
            onClick={() => setTab("catalog")}
            className={
              "flex-1 py-2 rounded-xl text-sm font-bold transition " +
              (tab === "catalog"
                ? "bg-purple-600 text-white shadow"
                : "bg-white text-purple-700")
            }
          >
            📦 Catálogo
          </button>

          <button
            onClick={() => setTab("claims")}
            className={
              "flex-1 py-2 rounded-xl text-sm font-bold transition " +
              (tab === "claims"
                ? "bg-purple-600 text-white shadow"
                : "bg-white text-purple-700")
            }
          >
            🧾 Canjes
          </button>
        </div>

        {/* CONTENT */}
        <div className="mt-4 space-y-4">
          {/* ========== TAB: CATÁLOGO ========== */}
          {tab === "catalog" && (
            <>
              {/* FORM CREAR (BONITO) */}
              <div className="bg-white/95 rounded-2xl shadow-xl p-5">
                <h2 className="text-sm font-extrabold text-purple-700">
                  Crear un premio nuevo
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Ejemplos: “5 min extra de recreo”, “Elegir juego”, “Sticker”.
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Nombre del premio
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder='Ej: "10 min de recreo extra"'
                      className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600">
                        Costo (puntos)
                      </label>
                      <input
                        value={form.cost_points}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, cost_points: e.target.value }))
                        }
                        placeholder="Ej: 50"
                        type="number"
                        className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600">
                        Stock disponible
                      </label>
                      <input
                        value={form.stock}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, stock: e.target.value }))
                        }
                        placeholder="Ej: 10"
                        type="number"
                        className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>
                  </div>

                  <button
                    disabled={saving}
                    onClick={handleCreateReward}
                    className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-extrabold py-3 rounded-xl shadow disabled:opacity-60"
                  >
                    {saving ? "Guardando..." : "Guardar premio"}
                  </button>
                </div>
              </div>

              {/* LISTADO PREMIOS */}
              <div className="bg-white/95 rounded-2xl shadow-xl p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-gray-800">
                    Tus premios creados
                  </h2>
                  <span className="text-xs text-gray-500">
                    Total: {rewards.length}
                  </span>
                </div>

                {rewards.length === 0 ? (
                  <div className="mt-4 bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-purple-700">
                    Aún no tienes premios. Crea el primero arriba 👆
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {rewards.map((r) => (
                      <div
                        key={r.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="font-extrabold text-purple-700 truncate">
                            {r.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ⭐ {r.cost_points} pts · 📦 Stock: {r.stock}
                          </p>
                        </div>

                        {/* Acciones (por ahora informativas, NO CAMBIA LÓGICA) */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold">
                            Activo
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ========== TAB: CANJES ========== */}
          {tab === "claims" && (
            <div className="bg-white/95 rounded-2xl shadow-xl p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-gray-800">
                  Solicitudes de canje
                </h2>
                <span className="text-xs text-gray-500">
                  Total: {claims.length}
                </span>
              </div>

              {claims.length === 0 ? (
                <div className="mt-4 bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-purple-700">
                  Aún no hay solicitudes de canje.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {claims.map((c) => {
                    const st = (c.status || "").toLowerCase();
                    return (
                      <div
                        key={c.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-extrabold text-purple-700 truncate">
                              {c.student_name}
                            </p>
                            <p className="text-sm text-gray-800 font-semibold">
                              {c.reward_title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              ⭐ {c.points_spent} puntos
                            </p>
                          </div>

                          <span
                            className={
                              "text-[11px] font-extrabold px-3 py-1 rounded-full " +
                              pillClass(c.status)
                            }
                          >
                            {formatStatus(c.status)}
                          </span>
                        </div>

                        {/* Acciones */}
                        {st === "pendiente" && (
                          <div className="flex gap-2 pt-1">
                            <button
                              disabled={saving}
                              onClick={() => updateClaim(c.id, "aprobado")}
                              className="flex-1 bg-green-600 hover:bg-green-700 transition text-white font-extrabold py-2 rounded-xl text-sm disabled:opacity-60"
                            >
                              Aprobar
                            </button>
                            <button
                              disabled={saving}
                              onClick={() => updateClaim(c.id, "rechazado")}
                              className="flex-1 bg-red-600 hover:bg-red-700 transition text-white font-extrabold py-2 rounded-xl text-sm disabled:opacity-60"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}

                        {st === "aprobado" && (
                          <button
                            disabled={saving}
                            onClick={() => deliver(c.id)}
                            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-extrabold py-2 rounded-xl text-sm disabled:opacity-60"
                          >
                            Marcar como entregado
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNav active="rewards" />
    </div>
  );
}
