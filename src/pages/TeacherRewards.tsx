import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BottomNav from "../components/BottomNav";

type RewardStatus = "pendiente" | "aprobado" | "rechazado" | "entregado" | "cancelado";

interface RewardRow {
  id: string;
  title: string;
  description: string | null;
  cost_points: number;
  stock: number | null;
  active?: boolean | null; // si existe en DB
  created_at?: string | null;
}

interface ClaimRowUI {
  id: string;
  status: RewardStatus;
  points_spent: number;
  created_at: string | null;
  student_name: string;
  reward_title: string;
}

function pillClass(status: RewardStatus) {
  if (status === "entregado") return "bg-green-100 text-green-700";
  if (status === "aprobado") return "bg-blue-100 text-blue-700";
  if (status === "pendiente") return "bg-yellow-100 text-yellow-700";
  if (status === "cancelado") return "bg-gray-200 text-gray-700";
  return "bg-red-100 text-red-700";
}

export default function TeacherRewards() {
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  const [rewards, setRewards] = useState<RewardRow[]>([]);
  const [claims, setClaims] = useState<ClaimRowUI[]>([]);

  const [tab, setTab] = useState<"rewards" | "requests" | "history">("rewards");

  // Form crear/editar
  const [form, setForm] = useState({
    id: "" as string,
    title: "",
    cost_points: "",
    stock: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(form.id);

  // Helpers
  const pendingClaims = useMemo(
    () => claims.filter((c) => c.status === "pendiente"),
    [claims]
  );

  const approvedClaims = useMemo(
    () => claims.filter((c) => c.status === "aprobado"),
    [claims]
  );

  const historyClaims = useMemo(
    () => claims.filter((c) => c.status !== "pendiente"),
    [claims]
  );

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAll() {
    setLoading(true);

    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (sessionErr || !userId) {
      setLoading(false);
      return;
    }

    // 1) teacherId
    const { data: teacher, error: teacherErr } = await supabase
      .from("teachers_v2")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (teacherErr || !teacher) {
      console.error(teacherErr);
      setLoading(false);
      return;
    }

    setTeacherId(teacher.id);

    // 2) rewards
    const { data: rewardsRows, error: rewardsErr } = await supabase
      .from("rewards_catalog")
      .select("id, title, description, cost_points, stock, active, created_at")
      .eq("teacher_id", teacher.id)
      .order("created_at", { ascending: false });

    if (rewardsErr) console.error(rewardsErr);
    setRewards((rewardsRows as any) || []);

    // 3) claims (con joins)
    // OJO: asume rewards_claims tiene teacher_id (ideal). Si no, igual cargará por join con rewards_catalog.
    // Intentamos primero por teacher_id; si falla, hacemos fallback.
    const tryByTeacherId = await supabase
      .from("rewards_claims")
      .select(
        `
        id,
        status,
        points_spent,
        created_at,
        students ( name ),
        rewards_catalog ( title )
      `
      )
      .eq("teacher_id", teacher.id)
      .order("created_at", { ascending: false });

    let claimsRows: any[] | null = tryByTeacherId.data as any[] | null;
    let claimsErr = tryByTeacherId.error;

    // fallback (si rewards_claims no tiene teacher_id)
    if (claimsErr) {
      const fallback = await supabase
        .from("rewards_claims")
        .select(
          `
          id,
          status,
          points_spent,
          created_at,
          students ( name ),
          rewards_catalog ( title, teacher_id )
        `
        )
        .order("created_at", { ascending: false });

      claimsRows = (fallback.data as any[] | null) || [];
      claimsErr = fallback.error;

      // filtrar por teacher_id desde rewards_catalog
      if (!claimsErr && claimsRows) {
        claimsRows = claimsRows.filter((r) => r?.rewards_catalog?.teacher_id === teacher.id);
      }
    }

    if (claimsErr) console.error(claimsErr);

    const mapped: ClaimRowUI[] = (claimsRows || [])
      .map((c: any) => ({
        id: c.id,
        status: c.status,
        points_spent: c.points_spent ?? 0,
        created_at: c.created_at ?? null,
        student_name: c?.students?.name ?? "Estudiante",
        reward_title: c?.rewards_catalog?.title ?? "Premio",
      }))
      .filter(Boolean);

    setClaims(mapped);

    setLoading(false);
  }

  function resetForm() {
    setForm({
      id: "",
      title: "",
      cost_points: "",
      stock: "",
      description: "",
    });
  }

  async function handleSaveReward() {
    if (!teacherId) return;

    const title = form.title.trim();
    const cost = Number(form.cost_points);
    const stock =
      form.stock.trim() === "" ? null : Number(form.stock);

    if (!title) return alert("Falta el nombre del premio.");
    if (!Number.isFinite(cost) || cost <= 0) return alert("Costo inválido.");
    if (stock !== null && (!Number.isFinite(stock) || stock < 0)) return alert("Stock inválido.");

    setSaving(true);
    try {
      if (!isEditing) {
        // crear
        const { error } = await supabase.from("rewards_catalog").insert({
          teacher_id: teacherId,
          title,
          cost_points: cost,
          stock,
          description: form.description.trim() || null,
          active: true,
        });

        if (error) {
          console.error(error);
          alert(error.message || "No se pudo crear el premio.");
          return;
        }
      } else {
        // editar
        const { error } = await supabase
          .from("rewards_catalog")
          .update({
            title,
            cost_points: cost,
            stock,
            description: form.description.trim() || null,
          })
          .eq("id", form.id);

        if (error) {
          console.error(error);
          alert(error.message || "No se pudo actualizar el premio.");
          return;
        }
      }

      resetForm();
      await loadAll();
      alert(isEditing ? "Premio actualizado ✅" : "Premio creado ✅");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(reward: RewardRow) {
    setTab("rewards");
    setForm({
      id: reward.id,
      title: reward.title || "",
      cost_points: String(reward.cost_points ?? ""),
      stock: reward.stock === null || reward.stock === undefined ? "" : String(reward.stock),
      description: reward.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggleActive(reward: RewardRow) {
    // Si tu DB no tiene "active", esto fallará → usa el SQL del final.
    const next = !(reward.active ?? true);

    const ok = confirm(
      next
        ? `¿Habilitar el premio "${reward.title}"?`
        : `¿Deshabilitar el premio "${reward.title}"? (El estudiante no lo verá)`
    );
    if (!ok) return;

    const { error } = await supabase
      .from("rewards_catalog")
      .update({ active: next })
      .eq("id", reward.id);

    if (error) {
      console.error(error);
      alert(error.message || "No se pudo cambiar el estado del premio.");
      return;
    }

    await loadAll();
  }

  async function deleteReward(reward: RewardRow) {
    const ok = confirm(
      `¿Eliminar el premio "${reward.title}"?\n\nRecomendado solo si nadie lo ha canjeado.`
    );
    if (!ok) return;

    const { error } = await supabase
      .from("rewards_catalog")
      .delete()
      .eq("id", reward.id);

    if (error) {
      console.error(error);
      alert(
        "No se pudo eliminar. Probablemente ya tiene solicitudes/historial.\n" +
          (error.message || "")
      );
      return;
    }

    await loadAll();
  }

  async function approveClaim(claimId: string) {
    const ok = confirm("¿Autorizar esta solicitud?");
    if (!ok) return;

    const { error } = await supabase.rpc("teacher_update_reward_request", {
      p_claim_id: claimId,
      p_status: "aprobado",
    });

    if (error) {
      console.error(error);
      alert(error.message || "No se pudo autorizar.");
      return;
    }

    await loadAll();
  }

  async function rejectClaim(claimId: string) {
    const ok = confirm("¿Rechazar esta solicitud?");
    if (!ok) return;

    const { error } = await supabase.rpc("teacher_update_reward_request", {
      p_claim_id: claimId,
      p_status: "rechazado",
    });

    if (error) {
      console.error(error);
      alert(error.message || "No se pudo rechazar.");
      return;
    }

    await loadAll();
  }

  async function deliverClaim(claimId: string) {
    const ok = confirm(
      "¿Marcar como ENTREGADO?\n\nEsto debe descontar puntos al estudiante y stock del premio (según tu SQL)."
    );
    if (!ok) return;

    const { error } = await supabase.rpc("teacher_deliver_reward", {
      p_claim_id: claimId,
    });

    if (error) {
      console.error(error);
      alert(error.message || "No se pudo marcar como entregado.");
      return;
    }

    await loadAll();
    alert("Marcado como entregado ✅");
  }

  if (loading) {
    return <div className="p-6 text-gray-700">Cargando panel de premios...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4 space-y-5">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h1 className="text-2xl font-extrabold text-purple-700">Premios 🎁</h1>
        <p className="text-sm text-gray-600 mt-1">
          Crea premios, habilita/deshabilita, y autoriza canjes de tus estudiantes.
        </p>

        {/* Tabs */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setTab("rewards")}
            className={
              "px-4 py-2 rounded-xl text-sm font-semibold " +
              (tab === "rewards"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700")
            }
          >
            Premios
          </button>
          <button
            onClick={() => setTab("requests")}
            className={
              "px-4 py-2 rounded-xl text-sm font-semibold " +
              (tab === "requests"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700")
            }
          >
            Solicitudes ({pendingClaims.length})
          </button>
          <button
            onClick={() => setTab("history")}
            className={
              "px-4 py-2 rounded-xl text-sm font-semibold " +
              (tab === "history"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700")
            }
          >
            Historial
          </button>
        </div>
      </div>

      {/* TAB: PREMIOS */}
      {tab === "rewards" && (
        <>
          {/* CREAR / EDITAR */}
          <div className="bg-white rounded-2xl shadow p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">
                {isEditing ? "Editar premio" : "Crear nuevo premio"}
              </h2>
              {isEditing && (
                <button
                  onClick={resetForm}
                  className="text-sm font-semibold text-gray-600 underline"
                >
                  Cancelar edición
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              <input
                className="w-full border rounded-xl px-4 py-3 text-sm"
                placeholder="Nombre del premio"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full border rounded-xl px-4 py-3 text-sm"
                  placeholder="Costo (puntos)"
                  type="number"
                  value={form.cost_points}
                  onChange={(e) => setForm((p) => ({ ...p, cost_points: e.target.value }))}
                />
                <input
                  className="w-full border rounded-xl px-4 py-3 text-sm"
                  placeholder="Stock (vacío = ilimitado)"
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                />
              </div>

              <textarea
                className="w-full border rounded-xl px-4 py-3 text-sm min-h-[90px]"
                placeholder="Descripción del premio (opcional)"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>

            <button
              onClick={handleSaveReward}
              disabled={saving}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold disabled:opacity-60"
            >
              {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear premio"}
            </button>
          </div>

          {/* LISTA PREMIOS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700 px-1">
              Premios administrados
            </h3>

            {rewards.length === 0 && (
              <div className="bg-white rounded-2xl shadow p-5 text-sm text-gray-600">
                Aún no has creado premios.
              </div>
            )}

            {rewards.map((r) => {
              const active = r.active ?? true;
              return (
                <div key={r.id} className="bg-white rounded-2xl shadow p-5 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-base font-extrabold text-purple-700 truncate">
                        {r.title}
                      </p>
                      {r.description && (
                        <p className="text-sm text-gray-600 mt-1">{r.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        ⭐ {r.cost_points} pts{" "}
                        {typeof r.stock === "number" ? `· 📦 Stock: ${r.stock}` : "· 📦 Stock: ilimitado"}
                      </p>
                    </div>

                    <span
                      className={
                        "shrink-0 text-[11px] font-bold px-3 py-1 rounded-full " +
                        (active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700")
                      }
                    >
                      {active ? "ACTIVO" : "DESHABILITADO"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => startEdit(r)}
                      className="px-3 py-2 rounded-xl bg-gray-100 text-gray-800 text-sm font-semibold"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => toggleActive(r)}
                      className={
                        "px-3 py-2 rounded-xl text-sm font-semibold " +
                        (active
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800")
                      }
                    >
                      {active ? "Deshabilitar" : "Habilitar"}
                    </button>

                    <button
                      onClick={() => deleteReward(r)}
                      className="px-3 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* TAB: SOLICITUDES */}
      {tab === "requests" && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-base font-bold text-gray-900">Solicitudes pendientes</h2>
            <p className="text-sm text-gray-600 mt-1">
              Autoriza o rechaza solicitudes. Al marcar como entregado (cuando esté aprobado),
              se aplican los descuentos según tus funciones SQL.
            </p>
          </div>

          {pendingClaims.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-5 text-sm text-gray-600">
              No hay solicitudes pendientes.
            </div>
          )}

          {pendingClaims.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow p-5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-extrabold text-gray-900">
                    {c.student_name} → <span className="text-purple-700">{c.reward_title}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    ⭐ {c.points_spent} pts · {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
                  </p>
                </div>

                <span className={"text-[11px] font-bold px-3 py-1 rounded-full " + pillClass(c.status)}>
                  {c.status.toUpperCase()}
                </span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => approveClaim(c.id)}
                  className="flex-1 bg-green-600 text-white py-2 rounded-xl font-bold"
                >
                  Autorizar
                </button>
                <button
                  onClick={() => rejectClaim(c.id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-xl font-bold"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}

          {/* APROBADOS LISTOS PARA ENTREGAR */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-sm font-bold text-gray-800">Aprobados (listos para entregar)</h3>
            <p className="text-xs text-gray-600 mt-1">
              Cuando entregas, debe descontar puntos del estudiante y stock del premio.
            </p>

            {approvedClaims.length === 0 ? (
              <p className="text-sm text-gray-600 mt-3">No hay solicitudes aprobadas.</p>
            ) : (
              <div className="space-y-3 mt-3">
                {approvedClaims.map((c) => (
                  <div key={c.id} className="border rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-gray-900">
                          {c.student_name} → <span className="text-purple-700">{c.reward_title}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">⭐ {c.points_spent} pts</p>
                      </div>
                      <span className={"text-[11px] font-bold px-3 py-1 rounded-full " + pillClass(c.status)}>
                        {c.status.toUpperCase()}
                      </span>
                    </div>

                    <button
                      onClick={() => deliverClaim(c.id)}
                      className="w-full mt-3 bg-purple-600 text-white py-2 rounded-xl font-bold"
                    >
                      Marcar como ENTREGADO
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: HISTORIAL */}
      {tab === "history" && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-base font-bold text-gray-900">Historial de canjes</h2>
            <p className="text-sm text-gray-600 mt-1">
              Registro completo de solicitudes y estados (incluye rechazados/cancelados/entregados).
            </p>
          </div>

          {historyClaims.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-5 text-sm text-gray-600">
              Aún no hay historial.
            </div>
          )}

          {historyClaims.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow p-5 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-gray-900">
                  {c.student_name} → <span className="text-purple-700">{c.reward_title}</span>
                </p>
                <span className={"text-[11px] font-bold px-3 py-1 rounded-full " + pillClass(c.status)}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600">⭐ {c.points_spent} pts</p>
              {c.created_at && (
                <p className="text-xs text-gray-500">
                  {new Date(c.created_at).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <BottomNav active="rewards" />
    </div>
  );
}
