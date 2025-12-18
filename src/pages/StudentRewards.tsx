import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import mascot from "../assets/mascot.png";
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
  points_spent: number;
}

export default function StudentRewards() {
  const [student, setStudent] = useState<StudentRow | null>(null);
  const [rewards, setRewards] = useState<RewardRow[]>([]);
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
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

    const { data: rew } = await supabase
      .from("rewards_catalog")
      .select("id, title, description, cost_points, stock")
      .eq("teacher_id", stu.teacher_id)
      .order("cost_points", { ascending: true });

    setRewards(rew || []);

    const { data: claimsRows } = await supabase
      .from("rewards_claims")
      .select("id, reward_id, status, points_spent")
      .eq("student_id", stu.id)
      .order("created_at", { ascending: false });

    setClaims(claimsRows || []);
    setLoading(false);
  }

  async function handleClaim(reward: RewardRow) {
    if (!student) return;

    const alreadyPending = claims.some(
      (c) => c.reward_id === reward.id && c.status === "pendiente"
    );

    if (alreadyPending) {
      alert("Ya tienes una solicitud pendiente para este premio.");
      return;
    }

    if (
      !confirm(
        `¿Solicitar "${reward.title}" por ${reward.cost_points} puntos?`
      )
    )
      return;

    try {
      setSending(true);

      await supabase.rpc("request_reward", {
        p_reward_id: reward.id,
      });

      await loadAll();
    } catch (err) {
      console.error(err);
      alert("No se pudo solicitar el premio.");
    } finally {
      setSending(false);
    }
  }

  async function handleCancel(claimId: string) {
    if (!confirm("¿Cancelar esta solicitud?")) return;

    try {
      await supabase.rpc("cancel_reward_request", {
        p_claim_id: claimId,
      });

      await loadAll();
    } catch (err) {
      console.error(err);
      alert("No se pudo cancelar la solicitud.");
    }
  }

  function statusColor(status: string) {
    if (status === "entregado")
      return "bg-green-100 text-green-700";
    if (status === "aprobado")
      return "bg-blue-100 text-blue-700";
    if (status === "pendiente")
      return "bg-yellow-100 text-yellow-700";
    if (status === "cancelado")
      return "bg-gray-200 text-gray-600";
    return "bg-red-100 text-red-700";
  }

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Cargando premios...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 px-4 space-y-5">
      <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
        <img src={mascot} className="w-16 h-16" />
        <div>
          <h1 className="text-xl font-bold text-purple-700">Premios 🎁</h1>
          <p className="text-sm text-gray-600">
            Solicita premios por tus acciones positivas.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow">
        <p className="text-sm">Tus puntos actuales</p>
        <p className="text-3xl font-extrabold">{student.points}</p>
      </div>

      {rewards.map((r) => {
        const claim = claims.find((c) => c.reward_id === r.id);

        return (
          <div key={r.id} className="bg-white rounded-2xl shadow p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-purple-700">{r.title}</p>
                {r.description && (
                  <p className="text-sm text-gray-500">{r.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  Costo: {r.cost_points} pts
                </p>
              </div>

              {!claim && (
                <button
                  disabled={sending}
                  onClick={() => handleClaim(r)}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold"
                >
                  Solicitar
                </button>
              )}
            </div>

            {claim && (
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${statusColor(
                    claim.status
                  )}`}
                >
                  {claim.status.toUpperCase()}
                </span>

                {claim.status === "pendiente" && (
                  <button
                    onClick={() => handleCancel(claim.id)}
                    className="text-xs text-red-600 underline"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      <StudentBottomNav active="rewards" />
    </div>
  );
}
