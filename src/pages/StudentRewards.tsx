import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import StudentBottomNav from "../components/StudentBottomNav";

interface StudentRow {
  id: string;
  points: number;
  teacher_id: string;
}

interface RewardRow {
  id: string;
  title: string;
  description: string | null;
  cost_points: number;
  stock: number | null;
}

interface ClaimRow {
  id: string;
  reward_id: string;
  status: string;
}

export default function StudentRewards() {
  const [student, setStudent] = useState<StudentRow | null>(null);
  const [rewards, setRewards] = useState<RewardRow[]>([]);
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      const { data: stu } = await supabase
        .from("students")
        .select("id, points, teacher_id")
        .eq("user_id", userId)
        .single();

      if (!stu) {
        setLoading(false);
        return;
      }

      setStudent(stu);

      // Catálogo de premios del profesor
      const { data: rew } = await supabase
        .from("rewards_catalog")
        .select("id, title, description, cost_points, stock")
        .eq("teacher_id", stu.teacher_id)
        .order("cost_points", { ascending: true });

      setRewards(rew || []);

      // Historial de canjes
      const { data: claimsRows } = await supabase
        .from("rewards_claims")
        .select("id, reward_id, status")
        .eq("student_id", stu.id)
        .order("created_at", { ascending: false });

      setClaims(claimsRows || []);
      setLoading(false);
    }

    load();
  }, []);

  async function handleClaim(reward: RewardRow) {
    if (!student) return;

    if (student.points < reward.cost_points) {
      alert("No tienes suficientes puntos para este premio.");
      return;
    }

    if (
      !confirm(
        `¿Quieres canjear "${reward.title}" por ${reward.cost_points} puntos?`
      )
    ) {
      return;
    }

    try {
      setSending(true);

      // 1. Crear solicitud de canje
      await supabase.from("rewards_claims").insert({
        student_id: student.id,
        reward_id: reward.id,
        status: "pendiente",
      });

      // 2. Descontar puntos del estudiante
      await supabase.rpc("increment_student_points", {
        student_id_input: student.id,
        points_input: -reward.cost_points,
      });

      // 3. Notificar al profesor (ajusta columnas según tu tabla)
      await supabase.from("notifications").insert({
        teacher_id: student.teacher_id,
        student_id: student.id,
        message: `Solicitud de canje: ${reward.title}`,
      });

      alert("Solicitud de canje enviada al profesor.");
    } catch (err) {
      console.error(err);
      alert("No se pudo realizar el canje.");
    } finally {
      setSending(false);
    }
  }

  function statusColor(status: string) {
    if (status === "entregado" || status === "aprobado")
      return "bg-green-100 text-green-700";
    if (status === "pendiente") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  }

  const claimsByReward: Record<string, ClaimRow[]> = {};
  claims.forEach((c) => {
    if (!claimsByReward[c.reward_id]) claimsByReward[c.reward_id] = [];
    claimsByReward[c.reward_id].push(c);
  });

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Cargando premios...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Premios</h1>
        <p className="text-sm text-gray-600">
          Puedes canjear tus puntos por estos premios acordados con tu profesor.
        </p>
        <p className="mt-1 text-sm">
          Tus puntos actuales:{" "}
          <span className="font-bold text-green-600">{student.points}</span>
        </p>
      </header>

      <section className="space-y-3 mb-6">
        {rewards.length === 0 && (
          <p className="text-sm text-gray-500">
            Tu profesor aún no ha creado premios.
          </p>
        )}

        {rewards.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{r.title}</p>
                {r.description && (
                  <p className="text-xs text-gray-500">{r.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {r.cost_points} puntos
                  {typeof r.stock === "number"
                    ? ` · Stock: ${r.stock}`
                    : ""}
                </p>
              </div>

              <button
                disabled={sending}
                onClick={() => handleClaim(r)}
                className="px-3 py-2 text-xs rounded-lg bg-purple-600 text-white font-semibold disabled:bg-gray-300"
              >
                Canjear
              </button>
            </div>

            {/* Historial de este premio */}
            {claimsByReward[r.id] && claimsByReward[r.id].length > 0 && (
              <div className="border-t pt-2 mt-1 space-y-1">
                {claimsByReward[r.id].map((c) => (
                  <div
                    key={c.id}
                    className={
                      "inline-flex items-center gap-2 text-[11px] px-2 py-1 rounded-full " +
                      statusColor(c.status)
                    }
                  >
                    <span>Historial: {c.status.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      <StudentBottomNav active="rewards" />
    </div>
  );
}
